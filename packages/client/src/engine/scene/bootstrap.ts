import { EventLoop } from '@exile/client/engine/loop/event-loop';
import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Constructor } from '@exile/common/types/class';
import { Injector } from '@exile/common/utils/di';

/**
 * Bootstrap the game with the root scene containing main logic and creating
 * additional sub scenes and running the game clock and related global handlers.
 *
 * The passed rootInjector should have all required services and configurations
 * provided already.
 */
export function bootstrap(rootInjector: Injector, Scene: Constructor<RootScene>): void {
    const sceneRoot = rootInjector.provide(Scene, RootScene);

    RootScene.bootstrap(sceneRoot);

    const loop = rootInjector.inject(EventLoop);

    loop.start();
}
