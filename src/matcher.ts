const equal = require('fast-deep-equal/es6')

type MatcherClb<T> = (value: T) => any

export type Matcher<T> = [(value: T) => boolean, MatcherClb<T>]

export const value = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => [
  (val: any): val is T => {
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
  clb
]

export const type = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => [
  val => typeof val === typeof value,
  clb
]

export const instance = <T extends Function>(value: T, clb: MatcherClb<T>): Matcher<T> => [
  val => val instanceof value,
  clb
]

export const nan = (clb: MatcherClb<number>): Matcher<number> => [
  val => Number.isNaN(val as number),
  clb
]

export const string = (clb: MatcherClb<string>) => type('', clb)

export const number = (clb: MatcherClb<number>) => type(0, clb)

export const boolean = (clb: MatcherClb<boolean>) => type(false, clb)

export const object = (clb: MatcherClb<object>) => type(global, clb)

export const array = (clb: MatcherClb<Array<any>>): Matcher<Array<any>> => [
  val => val instanceof Array,
  clb
]

export const regexp = (clb: MatcherClb<RegExp>): Matcher<RegExp> => [
  val => val instanceof RegExp,
  clb
]

export const positive = (clb: MatcherClb<number>): Matcher<number> => [val => val >= 0, clb]

export const negative = (clb: MatcherClb<number>): Matcher<number> => [val => val < 0, clb]

export const any = <T>(clb: MatcherClb<T>): Matcher<T> => [() => true, clb]

// export const not = <T, M extends <T>(clb: MatcherClb<T>) => Matcher<T>>(fun: M) => (
//   ...args: Parameters<M>
// ): Matcher<T> => {
//   const [matcher, clb] = fun(...args)
//   return [v => !matcher(v), clb]
// }

export const tuple = <T extends Array<any>>(clb: (...args: Partial<T>) => any): Matcher<T> => [
  val => Array.isArray(val) && clb.length <= val.length,
  arr => clb(...arr)
]

export const matchAll = <T, F extends T extends Array<any> ? T : any>(value: T) => (
  ...matchers: (Matcher<F>)[]
) => matchers.filter(([match]) => match(value as F)).map(([_, callback]) => callback(value as F))

export const match = <T>(value: T) => (...matchers: Matcher<any>[]) => {
  const [, clb = false] = matchers.find(([match]) => match(value)) || []
  if (clb) {
    return clb(value)
  }
}
