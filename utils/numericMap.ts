export class NumericMap<TKey extends string> {
  private map: Record<TKey, number> = {} as Record<TKey, number>;

  constructor(private defaultValue: number = 0, map?: NumericMap<TKey>) {
    if (map) {
      this.map = { ...map.raw() };
    }
  }

  private change(key: TKey, value: number) {
    this.map[key] ||= this.defaultValue;
    this.map[key] += value;
  }

  get(key: TKey) {
    return this.has(key) ? this.map[key] : this.defaultValue;
  }

  has(key: TKey) {
    return this.map[key] !== undefined;
  }

  set(key: TKey, value: number) {
    this.map[key] ||= this.defaultValue;
    this.map[key] = value;
  }

  inc(key: TKey, value: number) {
    this.change(key, value);
  }

  dec(key: TKey, value: number) {
    this.change(key, -1 * value);
  }

  raw() {
    return this.map;
  }

  keys() {
    return Object.keys(this.map);
  }

  values() {
    return Object.values(this.map);
  }
}
