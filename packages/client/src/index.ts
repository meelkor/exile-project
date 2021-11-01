import { AppConfig } from '@exile/client/engine/config/app-config';
import { ViewConfig } from '@exile/client/engine/config/view-config';
import { bootstrap } from '@exile/client/engine/scene/bootstrap';
import { NoopServer } from '@exile/client/engine/server/noop-server';
import { Server } from '@exile/client/engine/server/server';
import { MainScene } from '@exile/client/game/main.scn';
import { Injector } from '@exile/common/utils/di';

const root = new Injector();

const canvas = document.createElement('canvas');

canvas.width = 1920;
canvas.height = 1080;

document.body.appendChild(canvas);

root.provide(new AppConfig({
}));
root.provide(new ViewConfig({
    canvas,
}));

root.provide(NoopServer, Server);

bootstrap(root, MainScene);
