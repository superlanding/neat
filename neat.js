#!/usr/bin/env node --experimental-specifier-resolution=node
import {
  acorn,
  acornLoose,
  fs,
  minimist,
  path,
  util
} from './utils/index'
import compose from './compose'
import setLineRows from './setLineRows'
import sortComponentProps from './sortComponentProps'
import sortImports from './sortImports'

const getComposedFns = context => {
  const { argv } = context
  if (argv['sort-imports']) {
    return [setLineRows, sortImports]
  }
  if (argv['sort-component-props']) {
    return [setLineRows, sortComponentProps]
  }
  return [
    setLineRows,
    sortImports,
    sortComponentProps
  ]
}

const neat = context => {

  const { content } = context
  const isVue = context.ext === '.vue'

  let beforeJs = ''
  let afterJs = ''
  let code = content

  if (isVue) {
    const startTag = '<script>'
    const endTag = '</script>'
    const scriptStart = content.indexOf(startTag) + startTag.length
    const scriptEnd = content.indexOf(endTag)
    context.content = content.slice(scriptStart, scriptEnd)
    beforeJs = content.slice(0, scriptStart)
    afterJs = content.slice(scriptEnd)
  }
  const fns = getComposedFns(context)
  const resultContext = compose(...fns)(context)
  const fileContent = beforeJs + resultContext.rows.map(row => row.line).join('') + afterJs
  fs.writeFileSync(context.filePath, fileContent, 'utf8')
}

const cwd = process.cwd()
const argv = minimist(process.argv.slice(2))
const filePaths = argv._.map(filename => path.resolve(cwd, filename))
  .flat()
  .filter(p => (! p.includes('*')))

filePaths.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath)
  const parse = argv.loose ? acornLoose : acorn.parse.bind(acorn)
  const parserContext = {
    filePath,
    ext,
    source: content,
    content,
    argv,
    parse: code => parse(code, {
      ecmaVersion: 2020,
      sourceType: 'module'
    }),
    rows: []
  }
  neat(parserContext)
})
