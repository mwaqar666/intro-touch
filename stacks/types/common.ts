export type Key<T> = keyof T;

export type Optional<T> = undefined | T;

export type Nullable<T> = null | T;

export interface IAnyObject {
	[key: string]: any;
}

export type Delegate<TArgs extends Array<unknown> = Array<void>, TReturn = void> = (...args: TArgs) => TReturn;

export type Action<TArgs extends Array<unknown> = Array<void>> = Delegate<TArgs>;

export type Constructable<T, TArgs extends Array<unknown> = Array<void>> = new (...args: TArgs) => T;

export type PartialOnly<T, K extends Key<T>> = Partial<Pick<T, K>> & Omit<T, K>;

export type PositiveFilterCondition<T, P extends Key<T>, C> = T[P] extends C ? P : never;

export type InverseFilterCondition<T, P extends Key<T>, C> = T[P] extends C ? never : P;

export type PositiveFilter<T, C> = { [P in Key<T>]: PositiveFilterCondition<T, P, C> }[Key<T>];

export type InverseFilter<T, C> = { [P in Key<T>]: InverseFilterCondition<T, P, C> }[Key<T>];

export type FilterWhere<T, C> = Pick<T, PositiveFilter<T, C>>;

export type FilterWhereNot<T, C> = Pick<T, InverseFilter<T, C>>;

export type Without<T, R> = { [K in Exclude<Key<T>, Key<R>>]?: never };

export type SingleExclusiveUnion<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type ExclusiveUnion<T extends Array<any>> = T extends [infer Only] ? Only : T extends [infer First, infer Second, ...infer Rest] ? ExclusiveUnion<[SingleExclusiveUnion<First, Second>, ...Rest]> : never;
