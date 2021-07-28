import { InjectableGlobal } from '@exile/common/utils/di';
import * as three from 'three';

export class GlobalLoader extends InjectableGlobal {

    private textureLoader = new three.TextureLoader();

    public load(url: string): three.Texture {
        return this.textureLoader.load(url);
    }
}
