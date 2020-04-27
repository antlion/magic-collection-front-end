import { Component, OnInit } from '@angular/core';
import {AddDeckComponent} from '../../../add-deck/add-deck.component';
import {Deck} from '../../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCollectionComponent} from '../add-collection/add-collection.component';
import {Collection} from '../../../models/collection.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DecksService} from '../../../services/decks/decks.service';

@Component({
  selector: 'app-my-collections',
  templateUrl: './my-collections.component.html',
  styleUrls: ['./my-collections.component.scss']
})
export class MyCollectionsComponent implements OnInit {

  collection = new Collection('');
  collections = []

  constructor(public deckSerivce: DecksService, private modalService: NgbModal) {
    deckSerivce.getMyCollections().subscribe(data => {
      this.collections = data['data'];
    })
  }

  ngOnInit(): void {
  }

  addNewCollection(content){

    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
       if (result === 'save'){
         this.deckSerivce.saveNewCollection(this.collection);
       }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // const dialogRef = this.dialog.open(AddCollectionComponent, {
    //   data: new Collection('New')
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   // add deck
    //   // this.decksService.addDeck(result);
    //   // this.myDeck.push(result);
    // });
  }
}
