import { groupBy, sortBy } from '../utils/index'
import getVueProp from './getVueProp'
import getObjValueStr from './getObjValueStr'

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

  return getObjValueStr(props)
}

const sortComponentProps = (valueNode, code) => {

  const group = groupBy(valueNode.properties, 'shorthand')
  const before = code.slice(0, valueNode.start)
  const middle = getSortedObjValues(group, code)
  const after = code.slice(valueNode.end)

  return  before + middle + after
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
