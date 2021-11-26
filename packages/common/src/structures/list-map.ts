/**
 * Map of sets that automatically creates arrays for new keys
 */
export class ListMap<Key, Value> {

    private innerMap: Map<Key, Value[]> = new Map();

    public add(key: Key, value: Value): this {
        const arr = this.innerMap.get(key);

        if (arr) {
            arr.push(value);
        } else {
            this.innerMap.set(key, [value]);
        }

        return this;
    }

    public get(key: Key): Value[] {
        return this.innerMap.get(key) || [];
    }

    public has(key: Key): boolean {
        return this.innerMap.has(key);
    }

    public delete(key: Key): this {
        this.innerMap.delete(key);

        return this;
    }

    public entries(): Iterable<[Key, Value[]]> {
        return this.innerMap.entries();
    }

    public keys(): Iterable<Key> {
        return this.innerMap.keys();
    }

    public values(): Iterable<Value[]> {
        return this.innerMap.values();
    }

    public *allValues(): Iterable<Value> {
        for (const list of this.innerMap.values()) {
            for (const value of list) {
                yield value;
            }
        }
    }
}
