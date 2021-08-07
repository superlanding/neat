import {
  IMPORT_TYPE_CONTAINER,
  IMPORT_TYPE_COMPONENT,
  IMPORT_TYPE_MIXIN,
  IMPORT_TYPE_REDUCER,
  IMPORT_TYPE_MODEL,
  IMPORT_TYPE_UTIL,
  IMPORT_TYPE_CONST,
  IMPORT_TYPE_OTHER
} from './consts'

export default function getImportType(node, line) {
  if (node.type !== 'ImportDeclaration') {
    return ''
  }
  if (line.includes('/containers')) {
    return IMPORT_TYPE_CONTAINER
  }
  if (line.includes('/components')) {
    return IMPORT_TYPE_COMPONENT
  }
  if (line.includes('/mixins')) {
    return IMPORT_TYPE_MIXIN
  }
  if (line.includes('redux/reducers')) {
    return IMPORT_TYPE_REDUCER
  }
  if (line.includes('/models')) {
    return IMPORT_TYPE_MODEL
  }
  if (line.includes('/utils')) {
    return IMPORT_TYPE_UTIL
  }
  if (line.includes('/consts')) {
    return IMPORT_TYPE_CONST
  }
  return IMPORT_TYPE_OTHER
}
