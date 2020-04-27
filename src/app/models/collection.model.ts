import {Card} from './card.model';

export class Collection {
  id: string;
  name: string;
  wishList: boolean;
  cardList: Card[] = [];


  constructor(name: string, wishList: boolean = false, cardList: Card[] = []) {
    this.name = name;
    this.wishList = wishList;
    this.cardList = cardList;
  }

  addCard($card){
    this.cardList.push($card);
  }
}
