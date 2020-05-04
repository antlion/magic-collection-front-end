import {Card} from './card.model';
import {DecksService} from "../services/decks/decks.service";

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
  mayboard: Card[] = [];


  constructor(name: string) {
    this.name = name;
    this.creatures = [];
    this.artifacts = [];
    this.enchantments = [];
    this.planeswalkers = [];
    this.spells = [];
    this.lands = [];
    this.sideboard = [];
    this.mayboard = [];

  }

  addCardToDeck($card: Card, sideboard = false, mayboard = false){
    if (mayboard) {
      this.addSingleCard(this.mayboard, $card);
      return;
    }
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
    if ($card.type.includes('Instant') || $card.type.includes('Sorcery')){
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


  findCardsCollections(decksService: DecksService){
    this.findCardCollections(this.creatures, decksService);
    this.findCardCollections(this.artifacts, decksService);
    this.findCardCollections(this.spells, decksService);
    this.findCardCollections(this.enchantments, decksService);
    this.findCardCollections(this.planeswalkers, decksService);
    this.findCardCollections(this.lands, decksService);
    this.findCardCollections(this.sideboard, decksService);
    this.findCardCollections(this.mayboard, decksService);
  }

  findCardCollections(cardArray: Card[], decksService){
    for (let i = 0; i < cardArray.length; i++) {
        decksService.getCardByName(cardArray[i].name).subscribe((value: Array<any>) => {
          if (value.length > 0) {
            cardArray[i].inCollection = true;
            cardArray[i].quantityCollection = value[0].cardList[0]['quantity'];
          }
        });
      }
  }

}
