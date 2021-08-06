const getImportType = require('./getImportType')

const getId = index => `#${index}`

const toLineRows = context => {

  const code = context.content
  const res = context.parse(code)

  const rows = []
  let pos = 0
  let index = 0

  res.body.forEach(node => {
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
  context.rows = rows
  return context
}

module.exports = toLineRows
