import { get, groupBy, sortBy } from '../utils/index'
import getVueProp from './getVueProp'
import getObjValueStr from './getObjValueStr'

const getPropType = node => {
  const required = (node.value.type === 'ObjectExpression') &&
    (!! node.value.properties.find(p => ((p.key.name === 'required') && p.value.value)))
  return { required }
}

const mapPropTypes = nodes => {
  return nodes.map(node => {
    const propType = getPropType(node)
    return { node, propType }
  })
}

export default function sortProps(context) {
  const { rows } = context
  context.rows = rows.map(row => {
    const propNode = getVueProp({ context, row, prop: 'props' })
    if (propNode) {
      const propRows = mapPropTypes(propNode.value.properties)
      const group = groupBy(propRows, p => p.propType.required)
      const requiredRows = sortBy(group.true || [], 'node.key.name')
      const optionalRows = sortBy(group.false || [], 'node.key.name')
      const code = row.line
      const sortedRows = [...requiredRows, ...optionalRows]
      // four spaces
      const indent  = '    '
      const propStrs = sortedRows.map(r => {
        const { node } = r
        return indent + code.slice(node.start, node.end)
      })
      const before = code.slice(0, propNode.value.start)
      const middle = getObjValueStr(propStrs)
      const after = code.slice(propNode.value.end)
      const nextLine = before + middle + after
      row.line = nextLine
      return row
    }
    return row
  })
  return context
}
