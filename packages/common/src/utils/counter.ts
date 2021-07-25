export namespace Counter {

    let counter = 0;

    export function make(): number {
        return counter++;
    }
}
