export const IMPORT_TYPE_CONTAINER = 'container'
export const IMPORT_TYPE_COMPONENT = 'component'
export const IMPORT_TYPE_INLINE_SVG = 'svg'
export const IMPORT_TYPE_MIXIN = 'mixin'
export const IMPORT_TYPE_REDUCER = 'reducer'
export const IMPORT_TYPE_MODEL = 'model'
export const IMPORT_TYPE_UTIL = 'util'
export const IMPORT_TYPE_CONST = 'const'
export const IMPORT_TYPE_OTHER = 'other'

export const IMPORT_TYPES = [
  IMPORT_TYPE_CONTAINER,
  IMPORT_TYPE_COMPONENT,
  IMPORT_TYPE_INLINE_SVG,
  IMPORT_TYPE_MIXIN,
  IMPORT_TYPE_REDUCER,
  IMPORT_TYPE_MODEL,
  IMPORT_TYPE_UTIL,
  IMPORT_TYPE_CONST,
  IMPORT_TYPE_OTHER
]

export const IMPORT_TYPE_MAP = IMPORT_TYPES.reduce((o, prop) => {
  o[prop] = true
  return o
}, {})
