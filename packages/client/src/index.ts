import { AppConfig } from '@exile/client/engine/config/app-config';
import { ViewConfig } from '@exile/client/engine/config/view-config';
import { bootstrap } from '@exile/client/engine/scene/bootstrap';
import { NoopServer } from '@exile/client/engine/server/noop-server';
import { Server } from '@exile/client/engine/server/server';
import { Store } from '@exile/client/engine/store/store';
import { TestStore } from '@exile/client/game/store/test-store';
import { MainScene } from '@exile/client/game/test/main.scn';
import { Injector } from '@exile/common/utils/di';

const root = new Injector();

const canvas = document.createElement('canvas');

canvas.width = 400;
canvas.height = 400;

document.body.appendChild(canvas);

root.provide(new AppConfig({}));
root.provide(new ViewConfig({
    canvas,
}));

root.provide(NoopServer, Server);
root.provide(TestStore, Store);

bootstrap(root, MainScene);
