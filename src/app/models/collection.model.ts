import {Card} from './card.model';
import {SearchCardService} from "../services/search-card.service";
import {DecksService} from "../services/decks/decks.service";

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

  addCard($card, decksService:DecksService, imported=false){
    const filteredCard = this.cardList.filter(value => value.name === $card.name)[0];
    if ($card.quantity <= 0 && filteredCard ) {
      for (let i = 0; i < this.cardList.length; i++) {
        if (this.cardList[i].name === $card.name && $card.quantity == 0) {
          this.cardList.splice(i--, 1);
          decksService.deleteCardFromCollection(this.cardList[i], this.id).subscribe((data) => {
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
        filteredCard.quantity = $card.quantity
      }
      decksService.modifyCardCollection(filteredCard, this.id).subscribe((data) => {
      })
    }
    else {
      this.cardList.push($card);
      decksService.addCardToCollection($card, this.id).subscribe((data) => {
      })
    }
  }

  findPrices(searchCardService: SearchCardService) {
    this.cardList.forEach((item, index) => {
      searchCardService.findCardPrice(item['name']).subscribe( value => {
        item['price'] = value['prices']['eur'];
        //this.totalPrice += item['price'] *item ['quantity']
      })
    })
  }
}
