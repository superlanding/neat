const groupBy = require('lodash.groupby')
const sortBy = require('lodash.sortby')
const keyBy = require('lodash.keyby')
const { IMPORT_TYPES, IMPORT_TYPE_MAP } = require('./consts')

const sortImports = context => {

  const { rows } = context
  const rowMap = keyBy(rows, 'id')
  const typeRows = rows.filter(row => IMPORT_TYPE_MAP[row.importType])
  const group = groupBy(typeRows, row => row.importType)

  const sortedTypeRows = IMPORT_TYPES.map(type => {
    const sortedArr = sortBy(group[type], row => row.line)
    return sortedArr
  })
  .flat()

  const arr = []
  sortedTypeRows.forEach((r, i) => {
    arr.push([r.id, typeRows[i].index])
  })
  arr.forEach(([id, index]) => {
    rowMap[id].index = index
  })
  context.rows = sortBy(rows, 'index')
  return context
}

module.exports = sortImports
