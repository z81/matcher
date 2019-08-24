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
      value('str', v => console.log('Это строка str')),
      value(7, v => console.log('Это число 7')),
      value({ a: '2' }, v => console.log("Это {a: '2'}", v)),
      value({ a: '3' }, v => console.log("Это {a: '3'}")),
      value(null, v => console.log('Это null')),
      value(false, v => console.log('Это false')),
      type(0, () => console.log('Это число')),
      string(() => console.log('Это строка')),
      boolean(() => console.log('Это boolean')),
      regexp(() => console.log('Это RegExp')),
      nan(() => console.log('Это NaN')),
      array(() => console.log('Это array')),
      instance(Store, () => console.log('Это Store'))
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
