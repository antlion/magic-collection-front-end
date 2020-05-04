import { Component, OnInit } from '@angular/core';
import {DecksService} from '../../../services/decks/decks.service';
import {Collection} from '../../../models/collection.model';
import {ActivatedRoute} from '@angular/router';
import {AddCardComponent} from '../../../dialog/add-card/add-card.component';
import {MatDialog} from '@angular/material/dialog';
import {Card} from "../../../models/card.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SearchCardService} from "../../../services/search-card.service";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  collection: Collection;
  importCardsList: any;

  constructor(private decksService: DecksService, private actRoute: ActivatedRoute,
              private modalService: NgbModal,
              private searchCardService: SearchCardService,
              private dialog: MatDialog) {
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

  importCards(content) {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'Import'){
        let cardDeck = []
        let sidebaordDeck = []
        let sideboard= false

        var splitted = this.importCardsList.split("\n");
        splitted.forEach((item, index) => {
          console.log(item[0])
          console.log(item.substring(2,item.length))
          if (item[0] == undefined){
            sideboard = true;
            return;
          }
          if (sideboard){
            sidebaordDeck.push([item[0],item.substring(2,item.length)])
          } else {
            cardDeck.push([item[0],item.substring(2,item.length)])
          }
        });

        cardDeck.forEach((item, index) => {
          this.searchCardService.get_card_by_exact_name(item[1]).subscribe((data) => {
            console.log(data);
            let carNew;
            if (data['object'] === 'list'){
              carNew = new Card(data['data'][0].name, data['data'][0].set,
                data['data'][0].image_uris.art_crop, +item[0], data['data'][0].type_line,
                data['data'][0].mana_cost, data['data'][0].image_uris.png);
            }else{
              carNew = new Card(data['name'], data['set'],
                data['image_uris'].art_crop, +item[0], data['type_line'],
                data['mana_cost'], data['image_uris'].png);
            }
            this.collection.addCard(carNew);
            this.decksService.saveCollection(this.collection);
          });
        })

        sidebaordDeck.forEach((item, index) => {
          this.searchCardService.get_card_by_exact_name(item[1]).subscribe((data) => {
            console.log(data);
            let carNew;
            if (data['object'] === 'list'){
              carNew = new Card(data['data'][0].name, data['data'][0].set,
                data['data'][0].image_uris.art_crop, +item[0], data['data'][0].type_line,
                data['data'][0].mana_cost, data['data'][0].image_uris.png);
            }else{
              carNew = new Card(data['name'], data['set'],
                data['image_uris'].art_crop, +item[0], data['type_line'],
                data['mana_cost'], data['image_uris'].png);
            }
            this.collection.addCard(carNew);
            this.decksService.saveCollection(this.collection);
          });
        })

      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
