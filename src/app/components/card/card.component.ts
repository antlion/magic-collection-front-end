import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Deck} from '../../models/deck.model';
import {Card} from '../../models/card.model';
import {DecksService} from '../../services/decks/decks.service';
import {Collection} from '../../models/collection.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cards: any;
  @Input() deck;
  @Input() sideboard;
  @Input() collection: Collection;
  @Input() todeck;
  @Input() collections:Collection[];

  constructor(private decksService: DecksService) {}

  ngOnInit(): void {
  }

  onCardChange($card: Card) {
    console.log(this.todeck);
    if(this.todeck == 'mayboard'){
      this.deck.addCardToDeck($card, false, true);
      this.decksService.saveDeck(this.deck);
      return;
    }
    if (this.deck) {
      this.deck.addCardToDeck($card, this.sideboard);
      this.decksService.saveDeck(this.deck);
    } else {
      this.collection.addCard($card);
      this.decksService.saveCollection(this.collection);
    }

  }

  addCardsCollection(card: Card, number: number, numberCollection = 0) {
    console.log('addtocollection')
    card.quantity = number
    card['quantityCol'] = number + numberCollection
    this.decksService.addCardToDefaultCollection(card, false).subscribe(value => {
      if (value == true || '_id' in value){
        card.inCollection = true
        card.quantityCollection = number + numberCollection;
      }
    })
  }
}
