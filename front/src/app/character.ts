import {Tag} from './tag';

export class Character {
    _id: string;
    name: string;
    tags: Tag[];
    physique: string;
    morale: string;
    histoire: string;
    isActive: boolean;
}