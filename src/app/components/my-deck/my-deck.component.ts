import { Component, OnInit } from '@angular/core';
import {Deck} from '../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddDeckComponent} from '../../add-deck/add-deck.component';
import {DecksService} from '../../services/decks/decks.service';
import {catchError, map} from 'rxjs/operators';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-my-deck',
  templateUrl: './my-deck.component.html',
  styleUrls: ['./my-deck.component.scss'],
  providers: [DecksService]
})
export class MyDeckComponent implements OnInit {

  myDeck: Deck[];
  deck: Deck = new Deck("")
  constructor(public dialog: MatDialog, public decksService: DecksService, private modalService: NgbModal ) {



  }

  ngOnInit(): void {
    this.myDeck = [];
    console.log('ssss');
    this.decksService.getMyDecks().subscribe((data: any[]) => {
      this.myDeck = data['data'];
    });
  }

  addNewDeck(component) {
    const modalRef = this.modalService.open(component, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'save'){

        this.decksService.addDeck(this.deck).subscribe(value => {
          console.log('deck new')
          if (value && 'result' in value) {
            this.deck["_id"]= value['result']['_id']
            this.myDeck.push(this.deck);
            this.deck = new Deck("")

          }
        })
      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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


