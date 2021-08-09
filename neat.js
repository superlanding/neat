#!/usr/bin/env node --experimental-specifier-resolution=node
import {
  acorn,
  acornLoose,
  fs,
  minimist,
  path,
  program,
} from './utils/index'
import compose from './compose'
import setLineRows from './setLineRows'
import sortComponentProps from './sortComponentProps'
import sortImports from './sortImports'

const getComposedFns = context => {
  const { options } = context
  if (options.imports) {
    return [setLineRows, sortImports]
  }
  if (options.componentProps) {
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

  let beforeJs = ''
  let afterJs = ''

  if (context.isVue) {
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

program
  .option('-i, --imports', 'sort js import declarations')
  .option('-c, --component-props', 'sort vue component props')
  .option('-l, --loose', 'use the error-tolerant version of parser')

const { argv } = process
program.parse(argv)

const cwd = process.cwd()
const args = minimist(argv.slice(2))
const filePaths = args._
  .filter(filename => (! filename.includes('*')))
  .map(filename => path.resolve(cwd, filename))
  .flat()

filePaths.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath)
  const options = program.opts()
  const parse = options.loose ? acornLoose : acorn
  const parserContext = {
    filePath,
    ext,
    isVue: (ext === '.vue'),
    source: content,
    content,
    options,
    parse: code => parse(code, {
      ecmaVersion: 2020,
      sourceType: 'module'
    }),
    rows: []
  }
  neat(parserContext)
})
