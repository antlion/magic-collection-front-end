import { Component, OnInit } from '@angular/core';
import {Deck} from '../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddDeckComponent} from '../../add-deck/add-deck.component';
import {DecksService} from '../../services/decks/decks.service';



@Component({
  selector: 'app-my-deck',
  templateUrl: './my-deck.component.html',
  styleUrls: ['./my-deck.component.scss']
})
export class MyDeckComponent implements OnInit {

  myDeck: Deck[];
  constructor(public dialog: MatDialog, public decksService: DecksService) { }

  ngOnInit(): void {
    this.myDeck = [];
    console.log('ssss');
    this.decksService.getMyDecks().subscribe((data: any[]) => {
      this.myDeck = data.data;
    });
  }

  addNewDeck() {
    const dialogRef = this.dialog.open(AddDeckComponent, {
      width: '250px',
      data: new Deck('')
    });

    dialogRef.afterClosed().subscribe(result => {
      // add deck
      this.decksService.addDeck(result);
      this.myDeck.push(result);
    });
  }
}


