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
  const props = [...trueValues, ...falseValues]

  const commaProps = props.map((p, i) => {
    // no comma dangle
    if (i === (props.length - 1)) {
      return p
    }
    return p + ','
  })

  const arr = ['{', ...commaProps, '  }']

  return arr.map((p, i) => {
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

const baseSortComponentProps = rows => {
  return rows.map(row => {
    const { node } = row
    if (! node) {
      return row
    }
    if ((node.type === 'ExportDefaultDeclaration') &&
      (get(node, 'declaration.type') === 'ObjectExpression')) {
        const code = row.line
        const res = Parser.parse(code, {
          ecmaVersion: 2020,
          sourceType: 'module'
        })
        const declaration = res.body[0].declaration
        const componentProp = declaration.properties.find(p => p.key.name === 'components')
        if (! componentProp) {
          return row
        }
        const nextCode = sortComponentProps(componentProp.value, code)
        row.line = nextCode
    }
    return row
  })
}

module.exports = baseSortComponentProps
