import { should } from 'chai';
import { assert } from '@exile/common/utils/assert';

should();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(global as any).assert = assert;
