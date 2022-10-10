import lodash from "lodash";
import type { CamelCasedPropertiesDeep } from "type-fest";

export function toCamelCase<T extends Record<string, unknown>>(obj: T) {
  return lodash.transform(
    obj,
    (result: Record<string, unknown>, value: unknown, key: string, target) => {
      const camelKey = lodash.isArray(target) ? key : lodash.camelCase(key);
      result[camelKey] = lodash.isObject(value)
        ? toCamelCase(value as Record<string, unknown>)
        : value;
    }
  ) as CamelCasedPropertiesDeep<T>;
}
