import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ok, err, Ok, Err, Result } from '../dist/index.js';

describe('ok', () => {
  it('creates an Ok result', () => {
    const result = ok(42);
    assert.equal(result instanceof Ok, true);
    assert.equal(result.value, 42);
  });
});

describe('err', () => {
  it('creates an Err result', () => {
    const result = err('failure');
    assert.equal(result instanceof Err, true);
    assert.equal(result.error, 'failure');
  });
});

describe('Ok', () => {
  it('isOk returns true', () => {
    assert.equal(ok(1).isOk(), true);
  });

  it('isErr returns false', () => {
    assert.equal(ok(1).isErr(), false);
  });

  it('map transforms the value', () => {
    const result = ok(2).map((v) => v * 3);
    assert.equal(result.isOk(), true);
    assert.equal(result.unwrap(), 6);
  });

  it('mapErr does nothing', () => {
    const result = ok<number, string>(5).mapErr((e) => e.toUpperCase());
    assert.equal(result.unwrap(), 5);
  });

  it('flatMap chains with another Result', () => {
    const result = ok(10).flatMap((v) => ok(v + 5));
    assert.equal(result.unwrap(), 15);
  });

  it('flatMap can return Err', () => {
    const result = ok(10).flatMap(() => err('nope'));
    assert.equal(result.isErr(), true);
  });

  it('unwrap returns the value', () => {
    assert.equal(ok('hello').unwrap(), 'hello');
  });

  it('unwrapOr returns the value', () => {
    assert.equal(ok(42).unwrapOr(0), 42);
  });

  it('unwrapOrElse returns the value', () => {
    assert.equal(ok<number, string>(42).unwrapOrElse(() => 0), 42);
  });

  it('match calls ok handler', () => {
    const result = ok(3).match({
      ok: (v) => v * 2,
      err: () => -1,
    });
    assert.equal(result, 6);
  });
});

describe('Err', () => {
  it('isOk returns false', () => {
    assert.equal(err('fail').isOk(), false);
  });

  it('isErr returns true', () => {
    assert.equal(err('fail').isErr(), true);
  });

  it('map does nothing', () => {
    const result = err<string, number>('fail').map((v) => v * 2);
    assert.equal(result.isErr(), true);
  });

  it('mapErr transforms the error', () => {
    const result = err<string, number>('fail').mapErr((e) => e.toUpperCase());
    assert.equal(result.isErr(), true);
    if (result.isErr()) {
      assert.equal(result.error, 'FAIL');
    }
  });

  it('flatMap does nothing', () => {
    const result = err<string, number>('fail').flatMap((v) => ok(v + 1));
    assert.equal(result.isErr(), true);
  });

  it('unwrap throws', () => {
    assert.throws(() => err('oops').unwrap(), {
      message: 'Called unwrap on an Err value: oops',
    });
  });

  it('unwrapOr returns default value', () => {
    assert.equal(err<string, number>('fail').unwrapOr(99), 99);
  });

  it('unwrapOrElse calls the function', () => {
    assert.equal(err<string, number>('fail').unwrapOrElse((e) => e.length), 4);
  });

  it('match calls err handler', () => {
    const result = err<string, number>('bad').match({
      ok: (v) => v * 2,
      err: (e) => e.length,
    });
    assert.equal(result, 3);
  });
});

describe('Result.fromPromise', () => {
  it('wraps a resolved promise as Ok', async () => {
    const result = await Result.fromPromise(Promise.resolve(42));
    assert.equal(result.isOk(), true);
    assert.equal(result.unwrap(), 42);
  });

  it('wraps a rejected promise as Err', async () => {
    const result = await Result.fromPromise<number, string>(Promise.reject('error'));
    assert.equal(result.isErr(), true);
    if (result.isErr()) {
      assert.equal(result.error, 'error');
    }
  });
});

describe('Result.fromThrowable', () => {
  it('wraps a successful function as Ok', () => {
    const result = Result.fromThrowable(() => JSON.parse('{"a":1}'));
    assert.equal(result.isOk(), true);
    assert.deepEqual(result.unwrap(), { a: 1 });
  });

  it('wraps a throwing function as Err', () => {
    const result = Result.fromThrowable(() => JSON.parse('invalid'));
    assert.equal(result.isErr(), true);
  });
});

describe('Result.all', () => {
  it('returns Ok with all values when all are Ok', () => {
    const result = Result.all([ok(1), ok(2), ok(3)]);
    assert.equal(result.isOk(), true);
    assert.deepEqual(result.unwrap(), [1, 2, 3]);
  });

  it('returns first Err when any is Err', () => {
    const result = Result.all([ok(1), err('fail'), ok(3)]);
    assert.equal(result.isErr(), true);
    if (result.isErr()) {
      assert.equal(result.error, 'fail');
    }
  });

  it('handles empty array', () => {
    const result = Result.all([]);
    assert.equal(result.isOk(), true);
    assert.deepEqual(result.unwrap(), []);
  });
});

describe('Result.allSettled', () => {
  it('collects all Ok and Err values', () => {
    const result = Result.allSettled([ok(1), err('a'), ok(2), err('b')]);
    assert.equal(result.isOk(), true);
    const settled = result.unwrap();
    assert.deepEqual(settled.ok, [1, 2]);
    assert.deepEqual(settled.err, ['a', 'b']);
  });

  it('handles all Ok', () => {
    const result = Result.allSettled([ok(1), ok(2)]);
    const settled = result.unwrap();
    assert.deepEqual(settled.ok, [1, 2]);
    assert.deepEqual(settled.err, []);
  });

  it('handles all Err', () => {
    const result = Result.allSettled([err('x'), err('y')]);
    const settled = result.unwrap();
    assert.deepEqual(settled.ok, []);
    assert.deepEqual(settled.err, ['x', 'y']);
  });
});
