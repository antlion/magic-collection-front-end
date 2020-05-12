import {Card} from './card.model';
import {DecksService} from "../services/decks/decks.service";
import {SearchCardService} from "../services/search-card.service";

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
  totalPrice = 0;
  totalCard

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


  findCardsCollections(decksService: DecksService, wishlist = false){
    this.findCardCollections(this.creatures, decksService, wishlist);
    this.findCardCollections(this.artifacts, decksService, wishlist);
    this.findCardCollections(this.spells, decksService, wishlist);
    this.findCardCollections(this.enchantments, decksService, wishlist);
    this.findCardCollections(this.planeswalkers, decksService, wishlist);
    this.findCardCollections(this.lands, decksService, wishlist);
    this.findCardCollections(this.sideboard, decksService, wishlist);
    this.findCardCollections(this.mayboard, decksService, wishlist);
  }

  findCardCollections(cardArray: Card[], decksService, wishList = false){
    for (let i = 0; i < cardArray.length; i++) {
        decksService.getCardByName(cardArray[i].name, wishList).subscribe((value: Array<any>) => {
          if (value.length > 0) {
            if (wishList) {
              cardArray[i].inWishList = true;
              cardArray[i].quantityCollectionWishList = value[0].cardList[0]['quantity'];
            } else {
              cardArray[i].inCollection = true;
              cardArray[i].quantityCollection = value[0].cardList[0]['quantity'];
            }

          }
        });
      }
  }

  findPrices(decksService) {
    this.findPrice(this.creatures, decksService);
    this.findPrice(this.artifacts, decksService);
    this.findPrice(this.spells, decksService);
    this.findPrice(this.enchantments, decksService);
    this.findPrice(this.planeswalkers, decksService);
    this.findPrice(this.lands, decksService);
    this.findPrice(this.sideboard, decksService);
    this.findPrice(this.mayboard, decksService);
  }

  findPrice(cardArray:Object[], searchCardService: SearchCardService){
    cardArray.forEach((item, index) => {
      searchCardService.findCardPrice(item['name']).subscribe( value => {
        item['price'] = value['prices']['eur'];
        this.totalPrice += item['price'] *item ['quantity']
      })
    })
  }
}
