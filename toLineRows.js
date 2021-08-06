const getImportType = require('./getImportType')

const getId = index => `#${index}`

const toLineRows = (nodes, code) => {
  const rows = []
  let pos = 0
  let index = 0

  nodes.forEach(node => {
    const { start, end } = node
    if (pos < start) {
      const line = code.slice(pos, start)
      const id = getId(index)
      rows.push({ id, line, index })
      index += 1
    }
    const line = code.slice(start, end + 1)
    const importType = getImportType(node, line)
    const id = getId(index)
    rows.push({ id, line, node, index, importType })
    index += 1
    pos = end + 1
  })
  return rows
}

module.exports = toLineRows
