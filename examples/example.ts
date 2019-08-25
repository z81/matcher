import {
  value,
  matchAll,
  type,
  boolean,
  string,
  nan,
  instance,
  array,
  match,
  regexp
} from '../src/matcher'

class Store {}

;['str', 7, 'b', false, null, undefined, /regex/, NaN, [], { a: '2' }, new Store()].forEach(
  v =>
    void console.info(`Match`, v) ||
    matchAll(v)(
      value('str', v => console.log(`This is string "${v}"`)),
      value(7, v => console.log('This is number 7')),
      value({ a: '2' }, v => console.log("This is {a: '2'}", v)),
      value({ a: '3' }, v => console.log("This is {a: '3'}")),
      value(null, v => console.log('This is null')),
      value(false, v => console.log('This is false')),
      type(0, () => console.log('This is number')),
      string(() => console.log('This is string')),
      boolean(() => console.log('This is boolean')),
      regexp(() => console.log('This is RegExp')),
      nan(() => console.log('This is NaN')),
      array(() => console.log('This is array')),
      instance(Store, () => console.log('This is Store'))
    )
)

console.info('Match one')
console.log(
  match(7 as number | string)(
    value(7, () => '=7'),
    value('Str', () => '=Str'),
    value('Str2', () => '=Str2'),
    value(null, () => '=null')
  )
)
