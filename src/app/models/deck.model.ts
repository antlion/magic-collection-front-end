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


  constructor(name: string) {
    this.name = name;
    this.creatures = [];
    this.artifacts = [];
    this.enchantments = [];
    this.planeswalkers = [];
    this.spells = [];
    this.lands = [];

  }

  addCardToDeck($card: Card){
    if ($card.type.includes('Creature')) {
      const filteredCard = this.creatures.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.creatures.push($card);
      }
      return;
    }
    if ($card.type.includes('Artifact')){
      const filteredCard = this.artifacts.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.artifacts.push($card);
      }
      return;
    }
    if ($card.type.includes('Instant')){
      const filteredCard = this.spells.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.spells.push($card);
      }
      return;
    }
    if ($card.type.includes('Enchantment')){
      const filteredCard = this.enchantments.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.enchantments.push($card);
      }
      return;
    }
    if ($card.type.includes('Land')){
      const filteredCard = this.lands.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.lands.push($card);
      }
      return;
    }
    if ($card.type.includes('Planeswalker')){
      const filteredCard = this.planeswalkers.filter(value => value.name === $card.name)[0];
      if (filteredCard){
        filteredCard.quantity += 1;
      } else {
        this.planeswalkers.push($card);
      }
      return;
    }
  }
}
