import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {SearchCardService} from '../services/search-card.service';
import {Card} from '../models/card.model';
import {DecksService} from '../services/decks/decks.service';
import {Deck} from '../models/deck.model';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SpinnerComponent} from "../components/spinner/spinner.component";
import {fromEvent, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {UtilsFunctionsService} from "../utils-functions.service";

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


  @ViewChild('searchCardInput', { static: true }) movieSearchInput: ElementRef;


  constructor(private searchCardService: SearchCardService,
              private decksService: DecksService,
              private helperFunctions: UtilsFunctionsService,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(1000)

      // If previous query is diffent from current
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {

      let dialogRef: MatDialogRef<SpinnerComponent> = this.dialog.open(SpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });


      this.searchCardService.get_card_by_name(text).subscribe((data) => {
        if (data['object'] === 'list'){
          this.cardList = this.createCards(data['data']);
        }else{
          this.cardList = this.createCards([data]);
        }
        dialogRef.close()
      }, error => {
        dialogRef.close()
      });

    });
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


  }

  createCards(data){
    const cards: Array<Card> = [];
    for (const card of data){
      let cardNew =  this.helperFunctions.createCardFromScryfallResource(card, 0, card['collector_number'])
      cards.push(cardNew);
      // this.decksService.getCardByName(card.name).subscribe((value: Array<any>) => {
      //
      //
      // })
    }
    return cards;
  }
}
