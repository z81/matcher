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
  clb,
]

export const type = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => [
  (val) => typeof val === typeof value,
  clb,
]

export const instance = <T extends new (...args: any) => any>(
  value: T,
  clb: MatcherClb<T>
): Matcher<InstanceType<T>> => [(val) => (val as any) instanceof value, clb]

export const nan = (clb: MatcherClb<number>): Matcher<number> => [(val) => Number.isNaN(val), clb]

export const string = (clb: MatcherClb<string>) => type('' as string, clb)

export const number = (clb: MatcherClb<number>) => type(0 as number, clb)

export const boolean = (clb: MatcherClb<boolean>) => type(false as boolean, clb)

export const object = (clb: MatcherClb<object>) => type(global, clb)

export const array = (clb: MatcherClb<Array<any>>): Matcher<Array<any>> => [
  (val) => val instanceof Array,
  clb,
]

export const regexp = (clb: MatcherClb<RegExp>): Matcher<RegExp> => [
  (val) => val instanceof RegExp,
  clb,
]

export const positive = (clb: MatcherClb<number>): Matcher<number> => [(val) => val >= 0, clb]

export const negative = (clb: MatcherClb<number>): Matcher<number> => [(val) => val < 0, clb]

export const any = <T>(clb: MatcherClb<T>): Matcher<T> => [() => true, clb]

export const not = <T extends Matcher<any>>([matcher, clb]: T) => [(v) => !matcher(v), clb] as T

export const tuple = <T extends Array<any>, F extends { [k in keyof T]: Exclude<T[k], undefined> }>(
  clb: (...args: F) => any
): Matcher<T> => [
  (val) => Array.isArray(val) && clb.length <= val.length,
  (arr) => clb(...(arr as F)),
]

export const matchAll = <T, F extends T extends Array<any> ? T : any>(value: T) => (
  ...matchers: Matcher<F>[]
) => matchers.filter(([match]) => match(value as F)).map(([_, callback]) => callback(value as F))

export const match = <T, F extends T extends Array<any> ? T : any>(value: T) => (
  ...matchers: Matcher<F>[]
) => {
  const [, clb = false] = matchers.find(([match]) => match(value as F)) || []
  if (clb) {
    return clb(value as F)
  }
}
