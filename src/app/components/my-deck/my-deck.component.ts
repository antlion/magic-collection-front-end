import { Component, OnInit } from '@angular/core';
import {Deck} from '../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddDeckComponent} from '../../add-deck/add-deck.component';
import {DecksService} from '../../services/decks/decks.service';
import {catchError, map} from 'rxjs/operators';



@Component({
  selector: 'app-my-deck',
  templateUrl: './my-deck.component.html',
  styleUrls: ['./my-deck.component.scss'],
  providers: [DecksService]
})
export class MyDeckComponent implements OnInit {

  myDeck: Deck[];
  constructor(public dialog: MatDialog, public decksService: DecksService ) {



  }

  ngOnInit(): void {
    this.myDeck = [];
    console.log('ssss');
    this.decksService.getMyDecks().subscribe((data: any[]) => {
      this.myDeck = data['data'];
    });
  }

  addNewDeck() {
    const dialogRef = this.dialog.open(AddDeckComponent, {
      data: new Deck('')
    });

    dialogRef.afterClosed().subscribe(result => {
      // add deck
      this.decksService.addDeck(result).subscribe(value => {
        console.log('deck new')
        if (value && 'result' in value) {
          result._id = value['result']['_id']
        }
      })
      this.myDeck.push(result);
    });
  }

  deleteDeck(deck: Deck) {
    console.log('aaaa')
    this.decksService.deleteDeck(deck).subscribe( value => {

      this.myDeck.forEach( (item, index) => {
        if(item['_id'] === value['data']._id)  this.myDeck.splice(index,1);
      });


      }

    );
  }
}


