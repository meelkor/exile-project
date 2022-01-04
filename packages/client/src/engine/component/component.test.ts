import { Component } from '@exile/client/engine/component/component';
import { ComponentIo } from '@exile/client/engine/component/componentIo';
import { Injectable } from '@exile/common/utils/di';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Component', function () {
    it('should correctly provide IO to child injectables', function () {
        class ChildController extends Injectable {

            public assertInjectedIo(io: ComponentIo): void {
                expect(this.inject(ComponentIo)).to.eq(io);
            }
        }

        class TestComponent extends Component {

            public test(): void {

                this.inject(ChildController).assertInjectedIo(this.io);
            }

            public onInit() { /** noop */}
            public onTick() { /** noop */}
        }

        new TestComponent().test();
    });
});
