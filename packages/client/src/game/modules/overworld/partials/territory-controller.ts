import { Territory } from '@exile/client/game/models/territory';
import { Injectable } from '@exile/common/utils/di';

/**
 * Controller which takes care of rendering each territory. Abstracted so
 * various controllers using different techniques can be implemented and
 * performance compared.
 */
export abstract class TerritoryController extends Injectable {

    public abstract register(allTerritories: Territory[]): void;

    public abstract renderTerritory(territory: Territory): void;
}
