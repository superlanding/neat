import fs from 'fs'
import get from 'lodash.get'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'
import minimist from 'minimist'
import path from 'path'
import sortBy from 'lodash.sortby'
import { parse as acorn } from 'acorn'
import { parse as acornLoose } from 'acorn-loose'
import { program } from 'commander'
import compose from './compose'

export {
  acorn,
  acornLoose,
  compose,
  fs,
  get,
  groupBy,
  keyBy,
  minimist,
  path,
  program,
  sortBy
}
