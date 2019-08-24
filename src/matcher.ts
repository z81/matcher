import * as equal from 'fast-deep-equal'

console.log(equal)

export type MatcherClb<T> = (value: T) => any

export type Matcher<T> = [<V>(value: V | T) => boolean, MatcherClb<T>]

export const value = <T>(value: T, clb: MatcherClb<T>): Matcher<T> => [
  val => {
    if (typeof val === 'object' || val instanceof RegExp || val instanceof Date) {
      return equal(val, value)
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

export const matchAll = <T>(value: T) => (...matchers: Matcher<T>[]) =>
  matchers.filter(([match]) => match(value)).map(([_, callback]) => callback(value))

export const match = <T>(value: T) => (...matchers: Matcher<T>[]) => {
  const [, clb = false] = matchers.find(([match]) => match(value)) || []
  if (clb) {
    return clb(value)
  }
}
