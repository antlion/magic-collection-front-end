import { Injectable } from '@angular/core';
import {Card} from "./models/card.model";

@Injectable({
  providedIn: 'root'
})
export class UtilsFunctionsService {

  constructor() { }

  createCardFromScryfallResource(scryfallResource, quantity = 0, code_number ){
    let newCard;
    if (scryfallResource['object'] === 'list'){
      newCard = new Card(scryfallResource['data'][0].name, scryfallResource['data'][0].set,
        this.extractScyrfallImageCard(scryfallResource['data'][0]), quantity, scryfallResource['data'][0].type_line,
        this.extractScyrfallManaCost(scryfallResource['data'][0]),  this.extractScyrfallImageCard(scryfallResource['data'][0], false), scryfallResource['data'][0].rarity);
      newCard.set_number = code_number
      newCard['price'] = scryfallResource['data'][0]['prices']['eur']
    }else{
      newCard = new Card(scryfallResource['name'], scryfallResource['set'],
        this.extractScyrfallImageCard(scryfallResource), quantity, scryfallResource['type_line'],
        this.extractScyrfallManaCost(scryfallResource),  this.extractScyrfallImageCard(scryfallResource, false), scryfallResource['rarity']);
      newCard.set_number = code_number
      newCard['price'] =scryfallResource['prices']['eur']
    }

    return newCard
  }

  extractScyrfallImageCard(scryfallCard, art_crop = true){
    if (scryfallCard.hasOwnProperty('card_faces') &&  scryfallCard['card_faces'].length > 0 && scryfallCard['layout'] != 'adventure'){
      return art_crop ? scryfallCard['card_faces'][0]['image_uris']['art_crop'] : scryfallCard['card_faces'][0]['image_uris']['png']
    } else {
      return art_crop ? scryfallCard['image_uris']['art_crop'] : scryfallCard['image_uris']['png']
    }
  }

  extractScyrfallManaCost(scryfallCard){
    if (scryfallCard.hasOwnProperty('card_faces') &&  scryfallCard['card_faces'].length > 0){
      return  scryfallCard['card_faces'][0]['mana_cost']
    } else {
      return scryfallCard['mana_cost']
    }
  }
}
