import { Clock } from '@exile/client/engine/loop/clock';
import { InjectableGlobal } from '@exile/common/utils/di';
import { GameEvents } from '@exile/client/engine/game-event/game-events';
import { Server } from '@exile/client/engine/server/server';
import { Store } from '@exile/client/engine/store/store';
import { ViewEvents } from '@exile/client/engine/input/view-events';
import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';

/**
 * Service handling the main game loop in a generic sense => fetches events
 * from inputs (player, backend...) and emits them to registered scenes and
 * possibly other event handlers.
 */
export class EventLoop extends InjectableGlobal {

    private clock = this.inject(Clock);
    private viewEvents = this.inject(ViewEvents);
    private gameEvents = this.inject(GameEvents);
    private server = this.inject(Server);
    private store = this.inject(Store);
    private rootScene = this.inject(RootScene);
    private renderer = this.inject(Renderer);

    public start(): void {
        this.clock.start(this.executeFrame.bind(this));
    }

    private executeFrame(hrt: number): void {
        // Get player's input and propagate it into components, so they either
        // change their internal state or emit game event
        ViewEvents.emitEvents(this.viewEvents);

        // Emit game events caused by backend messages that arrived before this
        // frame
        this.server.tick();

        // Call game event handlers that may change state for events fired this
        // frame
        GameEvents.emitEvents(this.gameEvents);

        // Inform current scene(s) about changes the game events handlers
        // caused
        Store.emitEvents(this.store);

        // All changes to the components should be propagated from store to the
        // component via the scenes, so we can update components
        RootScene.runTick(this.rootScene, hrt);

        // And last step is actually rendering the frame
        this.renderer.render();
    }
}
