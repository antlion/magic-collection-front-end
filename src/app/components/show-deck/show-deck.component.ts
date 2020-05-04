import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecksService} from '../../services/decks/decks.service';
import {Deck} from '../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCardComponent} from '../../dialog/add-card/add-card.component';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SearchCardService} from "../../services/search-card.service";
import {Card} from "../../models/card.model";
import {Collection} from "../../models/collection.model";

@Component({
  selector: 'app-show-deck',
  templateUrl: './show-deck.component.html',
  styleUrls: ['./show-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ShowDeckComponent implements OnInit {

  deck: Deck = new Deck('new-deck');
  importCardsList: any;

  collections: Collection[];

  constructor(private actRoute: ActivatedRoute, private decksService: DecksService,
              private cdRef: ChangeDetectorRef, public dialog: MatDialog,
              private modalService: NgbModal,
              private searchCardService: SearchCardService) {
    this.decksService.getMyCollections(false).subscribe(data => {
      this.collections = data['data'];
    });
  }

  ngOnInit(): void {
    const idDeck = this.actRoute.snapshot.paramMap.get('id');

    this.decksService.getDeck(idDeck).subscribe((data: Object[]) => {
      const {planeswalkers, enchantments, spells, _id, creatures, lands, name, artifacts, sideboard} = data['data'];
      this.deck.name = name;
      this.deck.creatures = creatures;
      this.deck.artifacts = artifacts;
      this.deck.enchantments = enchantments;
      this.deck.planeswalkers = planeswalkers;
      this.deck.spells = spells;
      this.deck.lands = lands;
      this.deck.sideboard = sideboard;
      this.deck.id = _id;
      this.deck.findCardsCollections(this.decksService)
    });
  }


  addCard() {
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '600px',
      data: {
        deck: this.deck,
        saveToDB: true,
        sideboard: true
      }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data) => {
      this.decksService.saveDeck(this.deck);
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
            this.deck.addCardToDeck(carNew);
            this.decksService.saveDeck(this.deck);
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
            this.deck.addCardToDeck(carNew, true);
            this.decksService.saveDeck(this.deck);
          });
        })

      }
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
