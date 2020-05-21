import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {SearchCardService} from '../services/search-card.service';
import {Card} from '../models/card.model';
import {DecksService} from '../services/decks/decks.service';
import {Deck} from '../models/deck.model';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss']
})
export class SearchCardComponent implements OnInit {

  cardList: any = [];
  @Input() saveToDB;
  _value = 0;
  _step = 1;
  _min = 0;
  _max = Infinity;
  _wrap = false;
  color = 'default';
  @Input() deck: Deck;
  @Input() event: any;
  @Input() eventEmitter: EventEmitter<any>;
  @Input() sideboard = false;
  @Input() collection;
  @Input() todeck;

  constructor(private searchCardService: SearchCardService, private decksService: DecksService) {

  }

  ngOnInit(): void {

  }

  @Input('event')
  set eventValue(event) {
    this.event = event;
  }

  @Input('deck')
  set deckValue(deck) {
    this.deck = deck;
  }

  onSearchChange(card_name: any) {
    this.searchCardService.get_card_by_name(card_name).subscribe((data) => {
      console.log(data);
      if (data['object'] === 'list'){
        this.cardList = this.createCards(data['data']);
      }else{
        this.cardList = this.createCards([data]);
      }
    });
  }

  createCards(data){
    const cards: Array<Card> = [];
    for (const card of data){
      this.decksService.getCardByName(card.name).subscribe((value: Array<any>) => {
        let carNew;
        if (value.length > 0) {
           carNew = new Card(card.name, card.set, card.image_uris.art_crop, 0, card.type_line,
            card.mana_cost, card.image_uris.png,card.rarity, true, value[0].cardList[0]['quantity']);
           carNew['price'] = card['prices']['eur']

        } else {
           carNew = new Card(card.name, card.set, card.image_uris.art_crop, 0, card.type_line,
            card.mana_cost, card.image_uris.png, card.rarity)
          carNew['price'] = card['prices']['eur']

        }
        cards.push(carNew);

      })
    }
    return cards;
  }
}
