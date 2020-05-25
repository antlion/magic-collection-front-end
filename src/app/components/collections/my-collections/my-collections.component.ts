import {Component, OnInit, TemplateRef} from '@angular/core';
import {AddDeckComponent} from '../../../add-deck/add-deck.component';
import {Deck} from '../../../models/deck.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddCollectionComponent} from '../add-collection/add-collection.component';
import {Collection} from '../../../models/collection.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DecksService} from '../../../services/decks/decks.service';
import {AlertService} from "../../../services/alert.service";
import {catchError, map} from "rxjs/operators";
import {SearchCardService} from "../../../services/search-card.service";
import {Card} from "../../../models/card.model";
import {SpinnerComponent} from "../../spinner/spinner.component";

@Component({
  selector: 'app-my-collections',
  templateUrl: './my-collections.component.html',
  styleUrls: ['./my-collections.component.scss']
})
export class MyCollectionsComponent implements OnInit {

  collection = new Collection('');
  collections = []
  sets = []
  importCardListError: any[];
  importCardsList: any;
  private modalRef: NgbModalRef;
  filteredList = [];

  constructor(public dialog: MatDialog,
              public deckSerivce: DecksService,public searchCardService: SearchCardService, private modalService: NgbModal, private alertService:AlertService) {
    deckSerivce.getMyCollections().subscribe(data => {
      this.collections = data['data'];
    })

    searchCardService.getSetList().subscribe(data => {
      this.sets = data['data']

      this.sets = this.sets.filter(function (set) {
        return (set.set_type == 'core' ||
          set.set_type == 'expansion') &&
          new Date(set['released_at']) <= new Date()

      });
    })

  }

  ngOnInit(): void {
  }

  addNewCollection(content){

    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
       if (result === 'save'){
         this.deckSerivce.saveNewCollection(this.collection).
           subscribe((data: any[]) => {
             this.collection['_id'] = data["result"]._id
             this.collections.push(this.collection)
           });
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

  deleteCollection(collection: Collection) {
    this.deckSerivce.deleteCollection(collection).subscribe(event => {
      this.alertService.success('Deleted!')

      this.collections.forEach( (item, index) => {
        if(item['_id'] === event['data']._id)  this.collections.splice(index,1);
      });
    })
  }

  setEdition(value: any) {
    this.collection.edition = value.value;
  }

  importCards(content) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  async importCardCode() {

    let dialogRef: MatDialogRef<SpinnerComponent> = this.dialog.open(SpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.importCardListError = []

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
      let name = item.substring(2,item.indexOf("("))
      let set = item.substring(item.indexOf("(")+1, item.indexOf(")")).toLowerCase()
      let code_number = item.substring(item.indexOf(") ")+2, item.length)
      await this.searchCardService.get_card_by_exact_name(name, set, code_number).toPromise().then(
        async (data) => {
          let carNew;
          if (data['object'] === 'list'){
            carNew = new Card(data['data'][0].name, data['data'][0].set,
              data['data'][0].image_uris.art_crop, +item[0], data['data'][0].type_line,
              data['data'][0].mana_cost, data['data'][0].image_uris.png, data['data'][0].rarity);
            carNew.set_number = data['data'][0].collector_number
            carNew['price'] =  data['data'][0]['prices']['eur']

          }else{
            carNew = new Card(data['name'], data['set'],
              data['image_uris'].art_crop, +item[0], data['type_line'],
              data['mana_cost'], data['image_uris'].png, data['rarity']);
            carNew.set_number = data['collector_number']
            carNew['price'] =  data['prices']['eur']

          }

          let result =  await this.deckSerivce.addCardoToCollectionSet(carNew).toPromise().then(data => {
            this.deckSerivce.getMyCollections().subscribe(data => {
              this.collections = data['data'];
            })
          });

          // this.decksService.saveCollection(this.collection);
          // this.collectionTable.renderRows()

        },
        (err) => {
          this.importCardListError.push(`Unable to import ${item}`)
        });
    }

    dialogRef.close();
    this.modalRef.close()
  }

  searchCard(value: any) {
    this.deckSerivce.searchInAllCollection(value).subscribe(data => {
      // @ts-ignore
      this.filteredList = data
    })
  }
}
