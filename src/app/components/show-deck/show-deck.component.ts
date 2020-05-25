import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecksService} from '../../services/decks/decks.service';
import {Deck} from '../../models/deck.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddCardComponent} from '../../dialog/add-card/add-card.component';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SearchCardService} from "../../services/search-card.service";
import {Card} from "../../models/card.model";
import {Collection} from "../../models/collection.model";
import {SpinnerComponent} from "../spinner/spinner.component";

declare var $: any;


@Component({
  selector: 'app-show-deck',
  templateUrl: './show-deck.component.html',
  styleUrls: ['./show-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ShowDeckComponent implements OnInit {

  deck: Deck = new Deck('new-deck');
  importCardsList: any;
  importCardListError = [];

  collections: Collection[] = [];
  collectionsWishList: Collection[] = [];
  selectedColletion: Collection;
  tableView: boolean = false;
  IsWait: boolean = true;

  constructor(private actRoute: ActivatedRoute, private decksService: DecksService,
              private cdRef: ChangeDetectorRef, public dialog: MatDialog,
              private modalService: NgbModal,
              private searchCardService: SearchCardService) {
    this.decksService.getMyCollections(false).subscribe(data => {
      data['data'].forEach(item => {
        if (item.wishList == true){
          this.collectionsWishList.push(item);
        } else {
          this.collections.push(item)
        }
      })

    });
  }

  ngOnInit(): void {
    const idDeck = this.actRoute.snapshot.paramMap.get('id');

    this.decksService.getDeck(idDeck).subscribe((data: Object[]) => {
      const {planeswalkers, enchantments, spells, _id, creatures, lands, name, artifacts, sideboard, mayboard} = data['data'];
      this.deck.name = name;
      this.deck.creatures = creatures;
      this.deck.artifacts = artifacts;
      this.deck.enchantments = enchantments;
      this.deck.planeswalkers = planeswalkers;
      this.deck.spells = spells;
      this.deck.lands = lands;
      this.deck.sideboard = sideboard;
      this.deck.mayboard = mayboard;
      this.deck.findPrices(this.searchCardService);
      this.deck.id = _id;
      this.deck.findCardsCollections(this.decksService)
      this.deck.findCardsCollections(this.decksService, true)
    });
  }


  addCard(toDeck= '', sideboard=false) {
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '600px',
      data: {
        deck: this.deck,
        saveToDB: true,
        sideboard: sideboard,
        todeck: toDeck
      }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data) => {
      this.decksService.saveDeck(this.deck);
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  async importCards(content) {

    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(async (result) => {
      let dialogRef: MatDialogRef<SpinnerComponent> = this.dialog.open(SpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });
      if (result === 'Import'){
        let cardDeck = []
        let sidebaordDeck = []
        let sideboard= false

        var splitted = this.importCardsList.split("\n");
        splitted.forEach((item, index) => {

          if (item[0] == undefined){
            sideboard = true;
            return;
          }
          if (sideboard){
            sidebaordDeck.push(item)
          } else {
            cardDeck.push(item)
          }
        });

        for (const item of cardDeck) {
          let index = cardDeck.indexOf(item);
          let quantity = item[0]
          let name = item.substring(2,item.indexOf("(")-1)
          let set = item.substring(item.indexOf("(")+1, item.indexOf(")")).toLowerCase()
          let code_number = item.substring(item.indexOf(") ")+2, item.length)

          await this.searchCardService.get_card_by_exact_name(name, set, code_number).toPromise().then( async (data) => {
            let carNew;
            if (data['object'] === 'list'){
              carNew = new Card(data['data'][0].name, data['data'][0].set,
                data['data'][0].image_uris.art_crop, +item[0], data['data'][0].type_line,
                data['data'][0].mana_cost, data['data'][0].image_uris.png, data['data'][0].rarity);
              carNew.set_number = code_number
              carNew['price'] = data['data'][0]['prices']['eur']
            }else{
              carNew = new Card(data['name'], data['set'],
                data['image_uris'].art_crop, +item[0], data['type_line'],
                data['mana_cost'], data['image_uris'].png, data['rarity']);
              carNew.set_number = code_number
              carNew['price'] =data['prices']['eur']
            }
            this.deck.addCardToDeck(carNew);
            await this.decksService.saveDeck(this.deck);
          },
            (err) => {
              this.importCardListError.push(`Unable to import ${item}`)
            });

        }

        for (const item of sidebaordDeck) {
          let index = sidebaordDeck.indexOf(item);
          let quantity = item[0]
          let name = item.substring(2,item.indexOf("("))
          let set = item.substring(item.indexOf("(")+1, item.indexOf(")")).toLowerCase()
          let code_number = item.substring(item.indexOf(") ")+2, item.length)
          await this.searchCardService.get_card_by_exact_name(name, set, code_number).toPromise().then( async data => {
            let carNew;
            if (data['object'] === 'list'){
              carNew = new Card(data['data'][0].name, data['data'][0].set,
                data['data'][0].image_uris.art_crop, +item[0], data['data'][0].type_line,
                data['data'][0].mana_cost, data['data'][0].image_uris.png, data['data'][0].rarity, code_number);
              carNew['price'] = data['data'][0]['prices']['eur']

            }else{
              carNew = new Card(data['name'], data['set'],
                data['image_uris'].art_crop, +item[0], data['type_line'],
                data['mana_cost'], data['image_uris'].png, data['rarity'], code_number);
              carNew['price'] =data['prices']['eur']

            }
            this.deck.addCardToDeck(carNew, true);
            await this.decksService.saveDeck(this.deck);
          },
            (err) => {
              this.importCardListError.push(`Unable to import ${item}`)
            });
        }

      }

      dialogRef.close()
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showImage($event: MouseEvent) {
    (document.querySelector('.app-alerts') as HTMLElement).style.top = '150px';

  }

  @Input()
  set ready(isReady: boolean) {
    if (isReady){
      $(".preview").hover(function(){
        $(this).find('img').show();
      }, function(){
        $(this).find('img').hide();
      });
    }
  }

  showTable(b: boolean) {
    this.tableView = b
  }

  tableChange($card, sideboard = false, toDeck='') {
    if(toDeck == 'mayboard'){
      this.deck.addCardToDeck($card, false, true);
      this.decksService.saveDeck(this.deck);
      return;
    }
    if (this.deck) {
      this.deck.addCardToDeck($card, sideboard);
      this.decksService.saveDeck(this.deck);
    }
  }

  addCardsCollection(card, quantitycollection, wishList = false){
    if (quantitycollection != undefined && typeof quantitycollection != 'string'){
      let dialogRef: MatDialogRef<SpinnerComponent> = this.dialog.open(SpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });

      card['quantityCol'] = quantitycollection
      this.decksService.addCardToDefaultCollection(card, wishList).subscribe(value => {
        if (value == true || '_id' in value){
          if (wishList){
            dialogRef.close();
          } else {
            card.inCollection = true
            card.quantityCollectionWishList = quantitycollection;
            dialogRef.close();
          }
        } else {
          dialogRef.close();
        }
      })
    }

  }

  addToCollection(content){
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'save'){
        console.log(result)
      }
    });
  }

  exportDeck() {
    let content = ''
    this.deck.creatures.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    this.deck.planeswalkers.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    this.deck.spells.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    this.deck.artifacts.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    this.deck.enchantments.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    this.deck.lands.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    content += '\n'
    this.deck.sideboard.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    const blob = new Blob([content], { type: 'text/plain' });
    const url= window.URL.createObjectURL(blob);

    window.open(url);

  }
}
