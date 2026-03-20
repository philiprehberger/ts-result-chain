# Changelog

All notable changes to this project will be documented in this file.

## 0.1.1

- Add CI workflow and badges to README

## [0.1.0] - 2026-03-20

### Added

- `ok(value)` and `err(error)` factory functions
- `Ok` and `Err` classes with chainable methods
- Instance methods: `map`, `mapErr`, `flatMap`, `unwrap`, `unwrapOr`, `unwrapOrElse`, `match`, `isOk`, `isErr`
- `Result.fromPromise` for wrapping promises
- `Result.fromThrowable` for wrapping throwable functions
- `Result.all` for combining multiple results
- `Result.allSettled` for collecting all results
