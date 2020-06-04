import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Deck} from '../../models/deck.model';
import {Card} from '../../models/card.model';
import {DecksService} from '../../services/decks/decks.service';
import {Collection} from '../../models/collection.model';
import {ShowImageCardComponent} from "../../modals/show-image-card/show-image-card.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  @Input() eventEmitter: EventEmitter<any>;
  @Input() searching: boolean;


  constructor(private decksService: DecksService, private modalService: NgbModal) {}

  ngOnInit(): void {
  }

  onCardChange($card: Card) {
    if(this.todeck == 'mayboard'){
      this.deck.addCardToDeck($card, false, true);
      this.decksService.saveDeck(this.deck).subscribe(value => {

      });
      return;
    }
    if (this.deck) {
      this.deck.addCardToDeck($card, this.sideboard);
      this.decksService.saveDeck(this.deck).subscribe(value => {

      });
    } else {
      this.collection.addCard($card, this.decksService);
    }
    this.eventEmitter.emit($card)

  }

  addCardsCollection(card: Card, number: number, numberCollection = 0) {
    card.quantity = number
    card['quantityCol'] = number + numberCollection
    this.decksService.addCardToDefaultCollection(card, false).subscribe(value => {
      if (value == true || '_id' in value){
        card.inCollection = true
        card.quantityCollection = number + numberCollection;
      }
    })
  }

  showImageCard( card) {
    const modalRef = this.modalService.open(ShowImageCardComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'windows-dialog'
    })

    modalRef.componentInstance.card = card;

  }
}
