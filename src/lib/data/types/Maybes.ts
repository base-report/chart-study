type Maybe<T> = T | null;
type MaybePromise<T> = T | Promise<T>;
type MaybeString = Maybe<string>;
type MaybeNumber = Maybe<number>;
type MaybeDate = Maybe<Date>;

export type { Maybe, MaybePromise, MaybeString, MaybeNumber, MaybeDate };
