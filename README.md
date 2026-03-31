# @philiprehberger/result-chain

[![CI](https://github.com/philiprehberger/result-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/result-chain/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/result-chain.svg)](https://www.npmjs.com/package/@philiprehberger/result-chain)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/result-chain)](https://github.com/philiprehberger/result-chain/commits/main)

Chainable Result monad for error handling without exceptions

## Installation

```bash
npm install @philiprehberger/result-chain
```

## Usage

```ts
import { ok, err, Result } from '@philiprehberger/result-chain';

// Create results
const success = ok(42);
const failure = err('something went wrong');

// Chain operations
const result = ok(10)
  .map((v) => v * 2)
  .flatMap((v) => (v > 15 ? ok(v) : err('too small')))
  .mapErr((e) => `Error: ${e}`);

// Extract values
const value = result.unwrapOr(0);

// Pattern match
const message = result.match({
  ok: (v) => `Got ${v}`,
  err: (e) => `Failed: ${e}`,
});

// Wrap throwable functions
const parsed = Result.fromThrowable(() => JSON.parse(rawInput));

// Wrap promises
const fetched = await Result.fromPromise(fetch('/api/data'));

// Combine results
const all = Result.all([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
const settled = Result.allSettled([ok(1), err('x')]); // Ok({ ok: [1], err: ['x'] })
```

## API

### Factories

- **`ok<T, E>(value: T): Result<T, E>`** - Creates an Ok result containing the given value.
- **`err<E, T>(error: E): Result<T, E>`** - Creates an Err result containing the given error.

### Instance Methods

- **`.isOk(): boolean`** - Returns `true` if the result is Ok.
- **`.isErr(): boolean`** - Returns `true` if the result is Err.
- **`.map<U>(fn: (value: T) => U): Result<U, E>`** - Transforms the Ok value, leaving Err untouched.
- **`.mapErr<F>(fn: (error: E) => F): Result<T, F>`** - Transforms the Err value, leaving Ok untouched.
- **`.flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>`** - Chains a function that returns a Result.
- **`.unwrap(): T`** - Returns the Ok value or throws if Err.
- **`.unwrapOr(defaultValue: T): T`** - Returns the Ok value or the provided default.
- **`.unwrapOrElse(fn: (error: E) => T): T`** - Returns the Ok value or computes a default from the error.
- **`.match<U>(handlers: { ok, err }): U`** - Pattern matches on the result, calling the appropriate handler.

### Static Methods

- **`Result.fromPromise<T, E>(promise: Promise<T>): Promise<Result<T, E>>`** - Wraps a promise, catching rejections as Err.
- **`Result.fromThrowable<T, E>(fn: () => T): Result<T, E>`** - Wraps a function that may throw into a Result.
- **`Result.all<T, E>(results: Result<T, E>[]): Result<T[], E>`** - Returns Ok with all values if every result is Ok, otherwise the first Err.
- **`Result.allSettled<T, E>(results: Result<T, E>[]): Result<{ ok: T[]; err: E[] }, never>`** - Collects all results, separating Ok values and Err errors.

## Development

```bash
npm install
npm run build
npm run typecheck
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/result-chain)

🐛 [Report issues](https://github.com/philiprehberger/result-chain/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/result-chain/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
