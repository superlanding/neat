#!/usr/bin/env node --experimental-specifier-resolution=node
import {
  acorn,
  acornLoose,
  compose,
  fs,
  path,
  program,
} from './utils/index'
import setLineRows from './setLineRows'
import sortVueComponents from './vue/sortComponents'
import sortVueProps from './vue/sortProps'
import sortVueComputedProps from './vue/sortComputedProps'
import sortVueMethods from './vue/sortMethods'
import sortImports from './sortImports'
import rmTrailingSpaces from './rmTrailingSpaces'

const getComposedFns = context => {
  const { options, isVue } = context
  if (options.imports) {
    return [setLineRows, sortImports]
  }
  if (options.trailingSpaces) {
    return [rmTrailingSpaces]
  }
  if (options.componentProps && isVue) {
    return [setLineRows, sortVueComponents]
  }
  if (options.props && isVue) {
    return [setLineRows, sortVueProps]
  }
  if (options.computedProps && isVue) {
    return [setLineRows, sortVueComputedProps]
  }
  if (options.methods && isVue) {
    return [setLineRows, sortVueMethods]
  }
  if (isVue) {
    return [
      setLineRows,
      sortImports,
      sortVueComponents,
      sortVueProps,
      sortVueComputedProps,
      sortVueMethods
    ]
  }
  return [setLineRows, sortImports]
}

const setupScriptStartTag = '<script setup>'
const isSetupScript = content => content.includes(setupScriptStartTag)

const neat = context => {

  const { content } = context

  let beforeJs = ''
  let afterJs = ''

  if (context.isVue) {
    const startTag = isSetupScript(content) ? setupScriptStartTag : '<script>'
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

  if (context.source !== fileContent) {
    fs.writeFileSync(context.filePath, fileContent, 'utf8')
  }
}

program
  .option('-i, --imports', 'sort js import declarations')
  .option('-c, --component-props', 'sort vue components props')
  .option('-p, --props', 'sort vue props')
  .option('-d, --computed-props', 'sort vue computed props')
  .option('-m, --methods', 'sort vue methods props')
  .option('-t, --trailing-spaces', 'remove trailing spaces')
  .option('-l, --loose', 'use the error-tolerant version of parser')

const { argv } = process
program.parse(argv)

const cwd = process.cwd()
const filePaths = program.args
  .filter(filename => (! filename.includes('*')))
  .map(filename => path.resolve(cwd, filename))

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
  try {
    neat(parserContext)
  }
  catch (err) {
    console.error(`Unexpected error in ${filePath}: ${err}`)
  }
})
