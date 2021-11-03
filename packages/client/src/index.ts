import { AppConfig } from '@exile/client/engine/config/app-config';
import { CameraConfig } from '@exile/client/engine/config/camera-config';
import { ViewConfig } from '@exile/client/engine/config/view-config';
import { bootstrap } from '@exile/client/engine/scene/bootstrap';
import { NoopServer } from '@exile/client/engine/server/noop-server';
import { Server } from '@exile/client/engine/server/server';
import { MainScene } from '@exile/client/game/main.scn';
import { Injector } from '@exile/common/utils/di';

const root = new Injector();

const canvas = document.createElement('canvas');

document.body.appendChild(canvas);

root.provide(new AppConfig({
}));
root.provide(new ViewConfig({
    canvas,
    width: 1920,
    height: 1080,
    backbufferScale: 1.5,
}));
root.provide(new CameraConfig({
    angle: Math.PI * 0.11,
    fieldOfView: 40,
}));

root.provide(NoopServer, Server);

bootstrap(root, MainScene);
