import { get } from '../utils/index'

export default function getVueProp(argContext) {
  const { context, row, prop } = argContext
  const { node } = row
  if (! node) {
    return null
  }
  if ((node.type === 'ExportDefaultDeclaration') &&
    (get(node, 'declaration.type') === 'ObjectExpression')) {
      const code = row.line
      const res = context.parse(code)
      const nodes = res.body
      if (nodes.length === 0) {
        return null
      }
      const { declaration } = nodes[0]
      if (! declaration) {
        return null
      }
      return declaration.properties.find(p => p.key.name === prop)
  }
  return null
}
