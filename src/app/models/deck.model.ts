import {Card} from './card.model';

export class Deck {
  id: string;
  name: string;
  type: string;
  creatures: Card[] = [];
  artifacts: Card[] = [];
  enchantments: Card[] = [];
  planeswalkers: Card[] = [];
  spells: Card[] = [];
  lands: Card[] = [];
  sideboard: Card[] = [];


  constructor(name: string) {
    this.name = name;
    this.creatures = [];
    this.artifacts = [];
    this.enchantments = [];
    this.planeswalkers = [];
    this.spells = [];
    this.lands = [];
    this.sideboard = [];

  }

  addCardToDeck($card: Card, sideboard = false){
    if (sideboard) {
      this.addSingleCard(this.sideboard, $card);
      return;
    }
    if ($card.type.includes('Creature')) {
      this.addSingleCard( this.creatures, $card);
      return;
    }
    if ($card.type.includes('Artifact')){
      this.addSingleCard( this.artifacts, $card);
      return;
    }
    if ($card.type.includes('Instant')){
      this.addSingleCard( this.spells, $card);
      return;
    }
    if ($card.type.includes('Enchantment')){
      this.addSingleCard( this.enchantments, $card);
      return;
    }
    if ($card.type.includes('Land')){
      this.addSingleCard( this.lands, $card);
      return;
    }
    if ($card.type.includes('Planeswalker')){
      this.addSingleCard( this.planeswalkers, $card);
      return;
    }
  }

  addSingleCard(cardArray, $card: Card){
    const filteredCard = cardArray.filter(value => value.name === $card.name)[0];
    if ($card.quantity <= 0 && filteredCard ){

      for (let i = 0; i < cardArray.length; i++) {
        if (cardArray[i].name === $card.name) {
          cardArray.splice(i--, 1);
          return;

        }
      }
    }
    if (filteredCard){
      filteredCard.quantity = $card.quantity;
    } else {
      cardArray.push($card);
    }
    return;
  }
}
