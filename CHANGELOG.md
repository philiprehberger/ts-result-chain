# Changelog

## 0.1.4

- Standardize README and CHANGELOG formatting

## 0.1.3

- Fix README badge configuration

## 0.1.2

- Standardize package.json configuration

## 0.1.1

- Add CI workflow and badges to README

## 0.1.0

- `ok(value)` and `err(error)` factory functions
- `Ok` and `Err` classes with chainable methods
- Instance methods: `map`, `mapErr`, `flatMap`, `unwrap`, `unwrapOr`, `unwrapOrElse`, `match`, `isOk`, `isErr`
- `Result.fromPromise` for wrapping promises
- `Result.fromThrowable` for wrapping throwable functions
- `Result.all` for combining multiple results
- `Result.allSettled` for collecting all results
