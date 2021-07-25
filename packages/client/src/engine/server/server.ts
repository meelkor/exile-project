import { Injectable } from '@exile/common/utils/di';

export abstract class Server extends Injectable {

    public abstract tick(): void;
}
