import {Card} from './card.model';
import {SearchCardService} from "../services/search-card.service";
import {DecksService} from "../services/decks/decks.service";
import {async} from "rxjs-compat/scheduler/async";

export class Collection {
  id: string;
  name: string;
  wishList: boolean;
  cardList: Card[] = [];
  edition:string;


  constructor(name: string, wishList: boolean = false, cardList: Card[] = [], id = '') {
    this.name = name;
    this.wishList = wishList;
    this.cardList = cardList;
    this.id = id;
  }

  async addCard($card, decksService:DecksService, imported=false){
    const filteredCard = this.cardList.filter( value => (value.name === $card.name
      && value.edition == $card.edition
      && $card.set_number ==  value.set_number))[0];
    if ($card.quantity <= 0 && filteredCard ) {
      for (let i = 0; i < this.cardList.length; i++) {
        if (this.cardList[i].name === $card.name && this.cardList[i].edition == $card.edition
          && $card.set_number ==  this.cardList[i].set_number) {
          this.cardList.splice(i--, 1);
           await decksService.deleteCardFromCollection(this.cardList[i], this.id).toPromise().then(async (data) => {
            console.log(data)
          })
          return;
        }
      }
    }
    else if (filteredCard){
      if(imported){
        filteredCard.quantity += $card.quantity
      } else {
        filteredCard.quantity += 1
      }
      await decksService.modifyCardCollection(filteredCard, this.id).toPromise().then(async (data) => {
      })
    }
    else {
      this.cardList.push($card);
      await decksService.addCardToCollection($card, this.id).toPromise().then(async (data) => {
      })
    }
  }

  findPrices(searchCardService: SearchCardService) {
    this.cardList.forEach((item, index) => {
      searchCardService.get_card_by_exact_name(item['name'], item['edition'], item['set_number']).subscribe( value => {
        if(value['prices']['eur'] == undefined && value['prices']['usd']){
          item['price'] = value['prices']['usd'] * 0.92
        } else {
          item['price'] = value['prices']['eur'];
        }
        //this.totalPrice += item['price'] *item ['quantity']
      })
    })
  }
}
