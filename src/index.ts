/**
 * Represents the Ok variant of a Result.
 */
export class Ok<T, E = never> {
  readonly _tag = 'Ok' as const;
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<E, T> {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return new Ok(this.value);
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    return fn(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_fn: (error: E) => T): T {
    return this.value;
  }

  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    return handlers.ok(this.value);
  }
}

/**
 * Represents the Err variant of a Result.
 */
export class Err<E, T = never> {
  readonly _tag = 'Err' as const;
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<E, T> {
    return true;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return new Err(this.error);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new Err(fn(this.error));
  }

  flatMap<U, F>(_fn: (value: T) => Result<U, F>): Result<U, E | F> {
    return new Err(this.error);
  }

  unwrap(): never {
    throw new Error(`Called unwrap on an Err value: ${String(this.error)}`);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: (error: E) => T): T {
    return fn(this.error);
  }

  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U {
    return handlers.err(this.error);
  }
}

/**
 * A Result type that represents either success (Ok) or failure (Err).
 */
export type Result<T, E> = Ok<T, E> | Err<E, T>;

/**
 * Creates an Ok result containing the given value.
 */
export function ok<T, E = never>(value: T): Result<T, E> {
  return new Ok(value);
}

/**
 * Creates an Err result containing the given error.
 */
export function err<E, T = never>(error: E): Result<T, E> {
  return new Err(error);
}

/**
 * Static utility methods for working with Results.
 */
export const Result = {
  /**
   * Wraps a promise into a Result, catching rejections as Err.
   */
  async fromPromise<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
      const value = await promise;
      return ok(value);
    } catch (error) {
      return err(error as E);
    }
  },

  /**
   * Wraps a function that may throw into one that returns a Result.
   */
  fromThrowable<T, E = unknown>(fn: () => T): Result<T, E> {
    try {
      return ok(fn());
    } catch (error) {
      return err(error as E);
    }
  },

  /**
   * Combines an array of Results into a single Result.
   * Returns Ok with all values if every Result is Ok, or the first Err encountered.
   */
  all<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isErr()) {
        return err(result.error);
      }
      values.push(result.value);
    }
    return ok(values);
  },

  /**
   * Collects all Results, separating Ok values and Err errors.
   * Always returns Ok with an object containing both arrays.
   */
  allSettled<T, E>(results: Result<T, E>[]): Result<{ ok: T[]; err: E[] }, never> {
    const okValues: T[] = [];
    const errValues: E[] = [];
    for (const result of results) {
      if (result.isOk()) {
        okValues.push(result.value);
      } else {
        errValues.push(result.error);
      }
    }
    return ok({ ok: okValues, err: errValues });
  },
};
