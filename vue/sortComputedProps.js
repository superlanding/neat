import { compose, get, groupBy, sortBy } from '../utils/index'
import getVueProp from './getVueProp'
import getObjValueStr from './getObjValueStr'

export default function sortComputedProps(context) {
  const { rows } = context
  context.rows = rows.map(row => {
    const propNode = getVueProp({ context, row, prop: 'computed' })
    if (propNode) {
      const group = groupBy(propNode.value.properties, p => (!! p.shorthand))
      // four spaces
      const indent = '    '
      const code = row.line
      const toPropStrs = nodes => {
        return (nodes || [])
          .map(node => indent + code.slice(node.start, node.end))
      }
      const transform = compose(toPropStrs, sortBy)
      const trueProps = transform(group.true)
      const falseProps = transform(group.false)
      const propStrs = [...trueProps, ...falseProps]
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
