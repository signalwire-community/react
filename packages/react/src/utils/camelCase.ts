import lodash from "lodash";

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<
        T[K]
      >;
    }
  : T;

export function toCamelCase<T extends Record<string, unknown>>(obj: T) {
  return lodash.transform(
    obj,
    (result: Record<string, unknown>, value: unknown, key: string, target) => {
      const camelKey = lodash.isArray(target) ? key : lodash.camelCase(key);
      result[camelKey] = lodash.isObject(value)
        ? toCamelCase(value as Record<string, unknown>)
        : value;
    }
  ) as SnakeToCamelCaseNested<T>;
}
