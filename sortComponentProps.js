const get = require('lodash.get')
const groupBy = require('lodash.groupby')
const sortBy = require('lodash.sortby')
const { Parser } = require('acorn')

// four spaces
const indent = '    '

const getSortedObjValues = (group, code) => {
  const sort = props => {
    return sortBy((props || []).map(p => indent + code.slice(p.start, p.end)))
  }
  const trueValues = sort(group.true)
  const falseValues = sort(group.false)
  const undefinedValues = sort(group.undefined)
  const props = [...trueValues, ...falseValues, ...undefinedValues]

  const commaProps = props.map((p, i) => {
    // no comma dangle
    if (i === (props.length - 1)) {
      return p
    }
    return p + ','
  })

  const arr = ['{', ...commaProps, '  }']

  return arr.map((p, i) => {
    // no newline for closing curly brace
    if (i === (arr.length - 1)) {
      return p
    }
    return p + `\n`
  })
}

const sortComponentProps = (valueNode, code) => {
  const { start, end } = valueNode
  const group = groupBy(valueNode.properties, 'shorthand')

  const before = code.slice(0, start)
  const middle = getSortedObjValues(group, code).join('')
  const after = code.slice(end)

  const nextCode = before + middle + after
  return nextCode
}

const baseSortComponentProps = context => {
  const { rows } = context
  context.rows = rows.map(row => {
    const { node } = row
    if (! node) {
      return row
    }
    if ((node.type === 'ExportDefaultDeclaration') &&
      (get(node, 'declaration.type') === 'ObjectExpression')) {
        const code = row.line
        const res = context.parse(code)
        const nodes = res.body
        if (nodes.length === 0) {
          return row
        }
        const { declaration } = nodes[0]
        if (! declaration) {
          return row
        }
        const componentProp = declaration.properties.find(p => p.key.name === 'components')
        if (! componentProp) {
          return row
        }
        const nextCode = sortComponentProps(componentProp.value, code)
        row.line = nextCode
    }
    return row
  })
  return context
}

module.exports = baseSortComponentProps
