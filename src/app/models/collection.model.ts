import {Card} from './card.model';

export class Collection {
  id: string;
  name: string;
  wishList: boolean;
  cardList: Card[] = [];


  constructor(name: string, wishList: boolean = false, cardList: Card[] = [], id = '') {
    this.name = name;
    this.wishList = wishList;
    this.cardList = cardList;
    this.id = id;
  }

  addCard($card){
    const filteredCard = this.cardList.filter(value => value.name === $card.name)[0];
    if ($card.quantity <= 0 && filteredCard ) {
      for (let i = 0; i < this.cardList.length; i++) {
        if (this.cardList[i].name === $card.name && $card.quantity == 0) {
          this.cardList.splice(i--, 1);
          return;
        }
      }
    }
    else if (filteredCard){
      filteredCard.quantity = $card.quantity
    }
    else {
      this.cardList.push($card);
    }

  }
}
