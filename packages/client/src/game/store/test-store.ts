import { Store } from '@exile/client/engine/store/store';

export const SomeEvent = Symbol();

export class TestStore extends Store<typeof SomeEvent> {}
