import {Card} from './card.model';

export class Deck {
  name: string;
  type: string;
  creatures: Card[] = [];
  spells: Card[] = [];
  lands: Card[] = [];


  constructor(name: string) {
    this.name = name;
  }
}
