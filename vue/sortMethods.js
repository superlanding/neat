import { groupBy, sortBy } from '../utils/index'
import getVueProp from './getVueProp'
import getObjValueStr from './getObjValueStr'

export default function sortMethods(context) {
  const { rows } = context
  context.rows = rows.map(row => {
    const propNode = getVueProp({ context, row, prop: 'methods' })
    if (propNode) {
      const group = groupBy(propNode.value.properties, p => {
        if (p.shorthand) {
          return 'shorthand'
        }
        if (p.value.async) {
          return 'async'
        }
        return 'others'
      })
      const sortedRows = ['shorthand', 'async', 'others'].reduce((arr, prop) => {
        return arr.concat(sortBy(group[prop] || [], 'key.name'))
      }, [])

      // four spaces
      const indent  = '    '
      const code = row.line
      const propStrs = sortedRows.map(node => {
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
