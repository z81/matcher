import {
  match,
  matchAll,
  value,
  number,
  positive,
  negative,
  string,
  boolean,
  any,
  object,
  regexp,
  nan,
  array,
  instance,
  tuple,
} from '../src/matcher'

describe('tests', () => {
  it('value 7 is 7', () => {
    expect(value(7, () => 0)[0](7)).toEqual(true)
  })

  it('value 8 is not 7', () => {
    expect(value(8, () => 0)[0](7)).toEqual(false)
  })

  it('number is number', () => {
    expect(number(() => 0)[0](7)).toEqual(true)
  })

  it('string is not number', () => {
    expect(number(() => 0)[0]('5' as any)).toEqual(false)
  })

  it('number is not number', () => {
    expect(number(() => 0)[0]('5' as any)).toEqual(false)
  })
  it('positive is positive', () => {
    expect(positive(() => 0)[0](7)).toEqual(true)
  })

  it('negative is not positive', () => {
    expect(positive(() => 0)[0](-7)).toEqual(false)
  })

  it('negative is negative', () => {
    expect(negative(() => 0)[0](-7)).toEqual(true)
  })

  it('string is string', () => {
    expect(string(() => 0)[0]('')).toEqual(true)
  })

  it('number is not string', () => {
    expect(string(() => 0)[0](1 as any)).toEqual(false)
  })

  it('boolean is boolean', () => {
    expect(boolean(() => 0)[0](true)).toEqual(true)
  })

  it('number is not boolean', () => {
    expect(boolean(() => 0)[0](1 as any)).toEqual(false)
  })

  it('object is object', () => {
    expect(object(() => 0)[0]({ a: '1' } as any)).toEqual(true)
  })

  it('number is not object', () => {
    expect(object(() => 0)[0](1 as any)).toEqual(false)
  })

  it('regexp is regexp', () => {
    expect(regexp(() => 0)[0](/a/)).toEqual(true)
  })

  it('number is not regexp', () => {
    expect(regexp(() => 0)[0](1 as any)).toEqual(false)
  })

  it('array is array', () => {
    expect(array(() => 0)[0]([])).toEqual(true)
  })

  it('number is not array', () => {
    expect(array(() => 0)[0](1 as any)).toEqual(false)
  })

  it('number is any', () => {
    expect(any(() => 0)[0](1)).toEqual(true)
  })

  it('nan is nan', () => {
    expect(nan(() => 0)[0](NaN)).toEqual(true)
  })

  it('Store is instanceof Store', () => {
    class Store {}
    expect(instance(Store, () => 0)[0](new Store())).toEqual(true)
  })

  it('Store is not instanceof Array', () => {
    class Store {}
    expect(instance(Array, () => 0)[0](new Store() as any)).toEqual(false)
  })

  it("{a: '2'} is {a: '2'}", () => {
    expect(value({ a: '2' }, () => 0)[0]({ a: '2' })).toEqual(true)
  })

  it("{a: '3'} is not {a: '2'}", () => {
    expect(value({ a: '3' }, () => 0)[0]({ a: '2' })).toEqual(false)
  })

  it('[1] is [1]', () => {
    expect(value([1], () => 0)[0]([1])).toEqual(true)
  })

  it('[1] is not [1, 2]', () => {
    expect(value([1], () => 0)[0]([1, 2])).toEqual(false)
  })

  it('value new Date(10, 11, 12, 20, 23, 32) is new Date(10, 11, 12, 20, 23, 32)', () => {
    expect(
      value(new Date(10, 11, 12, 20, 23, 32), () => 0)[0](new Date(10, 11, 12, 20, 23, 32))
    ).toEqual(true)
  })

  it('value new Date(5, 11, 12, 20, 23, 32) is not new Date(10, 11, 12, 20, 23, 32)', () => {
    expect(
      value(new Date(5, 11, 12, 20, 23, 32), () => 0)[0](new Date(10, 11, 12, 20, 23, 32))
    ).toEqual(false)
  })

  it('matchAll', () => {
    // prettier-ignore
    expect(matchAll(7)(
      value(7, () => '7'),
      value(9, () => '9'),
      number(() => 'number')
    )).toEqual([
      '7',
      'number'
    ])
  })

  it('match', () => {
    // prettier-ignore
    expect(match(7)(
      value(7, () => '7'),
      value(9, () => '9'),
      number(() => 'number')
    )).toEqual('7')
  })

  it('no matches', () => {
    // prettier-ignore
    expect(match(1)(
      value(7, () => '7'),
      value(9, () => '9'))
    ).toEqual(undefined)
  })

  it('tuple', () => {
    // prettier-ignore
    expect(
      match(['firstName'] as [string, string?])(
        tuple((firstName, lastName) => `${firstName} ${lastName}`),
        tuple((firstName) => `${firstName}`)
      )
    ).toEqual('firstName')
  })

  it('tuple', () => {
    // prettier-ignore
    expect(
      match(['firstName', 'lastName'] as [string, string?])(
        tuple((firstName, lastName) => `${firstName} ${lastName}`),
        tuple((firstName) => `${firstName}`)
      )
    ).toEqual('firstName lastName')
  })

  it('tuple ', () => {
    // prettier-ignore
    expect(
      match(['firstName', 'lastName', 'test'] as [string, string, string?])(
        tuple((firstName, ...other) => `${firstName} ${other}`),
        tuple((firstName) => `${firstName}`)
      )
    ).toEqual('firstName lastName,test')
  })
})
