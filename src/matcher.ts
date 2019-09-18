const equal = require('fast-deep-equal/es6')

type MatcherClb<T> = (value: T) => any

export type Matcher<T> = { match: (value: T) => boolean; exec: MatcherClb<T> }

export const value = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => ({
  match: (val: any): val is T => {
    if (
      typeof val === 'object' ||
      val instanceof RegExp ||
      val instanceof Date ||
      val instanceof Int8Array ||
      val instanceof Uint8Array ||
      val instanceof Uint8ClampedArray ||
      val instanceof Int16Array ||
      val instanceof Uint16Array ||
      val instanceof Int32Array ||
      val instanceof Uint32Array ||
      val instanceof Float32Array ||
      val instanceof Float64Array
    ) {
      return val === value || equal(val, value)
    }

    return val === value
  },
  exec: clb
})

export const type = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => ({
  match: val => typeof val === typeof value,
  exec: clb
})

export const instance = <T extends Function>(value: T, clb: MatcherClb<T>): Matcher<T> => ({
  match: val => val instanceof value,
  exec: clb
})

export const nan = (clb: MatcherClb<number>): Matcher<number> => ({
  match: val => Number.isNaN(val as number),
  exec: clb
})

export const string = (clb: MatcherClb<string>) => type('', clb)

export const number = (clb: MatcherClb<number>) => type(0, clb)

export const boolean = (clb: MatcherClb<boolean>) => type(false, clb)

export const object = (clb: MatcherClb<object>) => type(global, clb)

export const array = (clb: MatcherClb<Array<any>>): Matcher<Array<any>> => ({
  match: val => val instanceof Array,
  exec: clb
})

export const regexp = (clb: MatcherClb<RegExp>): Matcher<RegExp> => ({
  match: val => val instanceof RegExp,
  exec: clb
})

export const positive = (clb: MatcherClb<number>): Matcher<number> => ({
  match: val => val >= 0,
  exec: clb
})

export const negative = (clb: MatcherClb<number>): Matcher<number> => ({
  match: val => val < 0,
  exec: clb
})

export const any = <T>(clb: MatcherClb<T>): Matcher<T> => ({
  match: () => true,
  exec: clb
})

export const not = <T>({ match, exec }: Matcher<T>) => ({
  match: (v: T): boolean => !match(v),
  exec
})

export const tuple = <T extends Array<any>, F extends { [k in keyof T]: Exclude<T[k], undefined> }>(
  clb: (...args: F) => any
): Matcher<T> => ({
  match: val => Array.isArray(val) && clb.length <= val.length,
  exec: arr => clb(...(arr as F))
})

export const matchAll = <T, F extends T extends Array<any> ? T : any>(value: T) => (
  ...matchers: (Matcher<F>)[]
) => matchers.filter(({ match }) => match(value as F)).map(({ exec }) => exec(value as F))

export const match = <T, F extends T extends Array<any> ? T : any>(value: T) => (
  ...matchers: (Matcher<F>)[]
) => {
  const { exec = null } = matchers.find(({ match }) => match(value as F)) || {}

  if (exec) {
    return exec(value as F)
  }
}
