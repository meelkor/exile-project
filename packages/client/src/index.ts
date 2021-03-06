import { AppConfig } from '@exile/client/engine/config/app-config';
import { CameraConfig } from '@exile/client/engine/config/camera-config';
import { ViewConfig } from '@exile/client/engine/config/view-config';
import { bootstrap } from '@exile/client/engine/scene/bootstrap';
import { NoopServer } from '@exile/client/engine/server/noop-server';
import { Server } from '@exile/client/engine/server/server';
import { MainEditorScene } from '@exile/client/game/main-editor.scn';
import { Injector } from '@exile/common/utils/di';

const root = new Injector();

const canvas = document.createElement('canvas');

document.body.appendChild(canvas);

root.provide(new AppConfig({
}));
root.provide(new ViewConfig({
    canvas,
    width: 1280,
    height: 720,
    backbufferScale: 1,
}));
root.provide(new CameraConfig({
    angle: Math.PI * 0.18,
    fieldOfView: 35,
    height: 4.9,
}));

root.provide(NoopServer, Server);

bootstrap(root, MainEditorScene);
