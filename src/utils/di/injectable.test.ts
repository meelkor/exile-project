import { InjectableGlobal, Injector, InjectableValue, Injectable } from '@exile/utils/di';

describe('di/injectable', function () {
    it('should correctly get value from parent injector', function () {
        class AValue extends Injectable {

            public a: boolean = true;
        }

        class AReader extends Injectable {

            public a: boolean;

            private aValue = this.inject(AValue);

            constructor() {
                super();

                this.a = this.aValue.a;
            }
        }

        class Test extends Injectable {

            private aReader = this.provide(AReader);

            constructor() {
                super();
            }

            public getA(): boolean {
                return this.aReader.a;
            }
        }

        const injector = new Injector();

        injector.provide(AValue);
        const test = injector.provide(Test);

        test.getA().should.eq(true);
    });

    it('should correctly inject value', function () {
        const injector = new Injector();

        class SomeMap extends InjectableValue<Map<string, string>> {
        }

        const inputMap: Map<string, string> = new Map();

        injector.provide(new SomeMap(inputMap));

        const map = injector.inject(SomeMap);

        map.should.eq(inputMap);
    });

    it('should correctly inject global injectable', function () {
        const root = new Injector();
        const injector = new Injector(new Injector(root));

        class SomeService extends InjectableGlobal {
        }

        root.inject(SomeService).should.eq(injector.inject(SomeService));
    });
});
