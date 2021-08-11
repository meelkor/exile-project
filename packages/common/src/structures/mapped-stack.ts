/**
 * Combination of hashmap and array. Allows accessing last element via push and
 * pop methods while also allowing finding items via key of any type. Item is
 * still O(N) though.
 */
export class MappedStack<TKey, TValue> implements Iterable<TValue> {

    private list: TKey[] = [];

    private map: Map<TKey, TValue> = new Map();

    public get length(): number {
        return this.list.length;
    }

    public [Symbol.iterator](): Iterator<TValue> {
        return this.map.values();
    }

    public push(key: TKey, value: TValue): number {
        this.map.set(key, value);
        this.list.push(key);

        return this.list.length;
    }

    public pop(): TValue | undefined {
        const key = this.list.pop();

        if (key) {
            const value = this.map.get(key);
            this.map.delete(key);

            return value;
        }
    }

    public get(key: TKey): TValue | undefined {
        return this.map.get(key);
    }

    public delete(key: TKey): void {
        if (this.map.has(key)) {
            this.map.delete(key);

            const index = this.list.indexOf(key);
            this.list.splice(index, 1);
        }
    }

    public last(): TValue | undefined {
        const key = this.list[this.list.length - 1];

        if (key) {
            return this.map.get(key);
        }
    }
}
