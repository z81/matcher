# TypeScript pattern matching

## Install

yarn add perfect-matcher

npm install perfect-matcher

# Features

- [x] match by value (include deep compare with objects, Date, array, typed arrays)
- [x] match by type
- [x] match by instance
- [x] match NaN, regexp, positive/negative number
- [ ] optional matching arrays/objects

## Docs

[z81.github.io/matcher](https://z81.github.io/matcher/)

# Example

```ts
match(7)(
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
```

[![npm version](https://badge.fury.io/js/perfect-matcher.svg)](https://badge.fury.io/js/perfect-matcher)
[![Build Status](https://travis-ci.org/z81/matcher.svg?branch=master)](https://travis-ci.org/z81/matcher)
[![Coverage Status](https://coveralls.io/repos/github/z81/matcher/badge.svg?branch=master)](https://coveralls.io/github/z81/matcher?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
