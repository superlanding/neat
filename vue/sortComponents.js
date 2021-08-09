import { groupBy, sortBy } from '../utils/index'
import getVueProp from './getVueProp'

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

export default function sortComponents(context) {
  const { rows } = context
  context.rows = rows.map(row => {
    const componentProp = getVueProp({
      row,
      context,
      prop: 'components'
    })
    if (componentProp) {
      const nextCode = sortComponentProps(componentProp.value, row.line)
      row.line = nextCode
      return row
    }
    return row
  })
  return context
}
