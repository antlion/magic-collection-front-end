import { Component, OnInit } from '@angular/core';
import {DecksService} from '../../../services/decks/decks.service';
import {Collection} from '../../../models/collection.model';
import {ActivatedRoute} from '@angular/router';
import {AddCardComponent} from '../../../dialog/add-card/add-card.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  collection: Collection;

  constructor(private decksService: DecksService, private actRoute: ActivatedRoute, private dialog: MatDialog) {
    const idDeck = this.actRoute.snapshot.paramMap.get('id');

    this.decksService.getCollection(idDeck).subscribe((data: any[]) => {
      this.collection = new Collection( data['data']['name'],data['data']['wishList'], data['data']['cardList'],data['data']['_id'] );
    });
  }

  ngOnInit(): void {
  }

  addCard() {
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '600px',
      data: {
        collection: this.collection,
        deck: null,
        saveToDB: true,
        sideboard: true
      }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data) => {
      console.log('card added collection')
      //this.decksService.saveDeck(this.deck);
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
