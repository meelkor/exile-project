import { InjectableGlobal } from '@exile/common/utils/di';

export class DialogCounter extends InjectableGlobal {

    public currentWidth = 0;

    /**
     * Announce that new dialog was opened
     */
    public announce(width: number): void {
        this.currentWidth += width;
    }

    /**
     * Remove one dialog level
     */
    public remove(width: number): void {
        this.currentWidth -= width;
    }
}
