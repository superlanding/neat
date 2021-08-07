#!/usr/bin/env node --experimental-specifier-resolution=node
import {
  Parser,
  fs,
  minimist,
  path,
  util
} from './utils/index'
import compose from './compose'
import sortComponentProps from './sortComponentProps'
import sortImports from './sortImports'
import setLineRows from './setLineRows'

const argv = minimist(process.argv.slice(2))

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
  console.log('here', context.argv)
  process.exit(1)
  const resultContext = compose(
    setLineRows,
    sortImports,
    sortComponentProps
  )(context)

  const fileContent = beforeJs + resultContext.rows.map(row => row.line).join('') + afterJs
  fs.writeFileSync(context.filePath, fileContent, 'utf8')
}

const cwd = process.cwd()
const filePaths = argv._.map(filename => path.resolve(cwd, filename))
  .flat()

filePaths.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath)
  const parserContext = {
    filePath,
    ext,
    source: content,
    content,
    argv,
    parse: code => Parser.parse(code, {
      ecmaVersion: 2020,
      sourceType: 'module'
    }),
    rows: []
  }
  neat(parserContext)
})
