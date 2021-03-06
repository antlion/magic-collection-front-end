import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DecksService} from '../../../services/decks/decks.service';
import {Collection} from '../../../models/collection.model';
import {ActivatedRoute} from '@angular/router';
import {AddCardComponent} from '../../../dialog/add-card/add-card.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Card} from "../../../models/card.model";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {SearchCardService} from "../../../services/search-card.service";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ShowImageCardComponent} from "../../../modals/show-image-card/show-image-card.component";
import {SpinnerComponent} from "../../spinner/spinner.component";

declare var $;



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  dataTable: any;
  collection: Collection;
  importCardsList: any;
  filteredCard;
  showTable: boolean = true;
  importCardListError = [];
  @ViewChild('collectionTable', { static: true }) collectionTable: MatTable<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  displayedColumns: string[] = ['name', 'quantity', 'type', 'edition', 'price'];
  dataSource;
  constructor(private decksService: DecksService, private actRoute: ActivatedRoute,
              private modalService: NgbModal,
              private searchCardService: SearchCardService,
              private dialog: MatDialog) {
    const idDeck = this.actRoute.snapshot.paramMap.get('id');

    this.decksService.getCollection(idDeck).subscribe((data: any[]) => {
      this.collection = new Collection( data['data']['name'],data['data']['wishList'], data['data']['cardList'],data['data']['_id'] );
      this.collection['_id'] = data['data']['_id'];
      this.collection.findPrices(this.searchCardService);
      this.dataSource = new MatTableDataSource(this.collection.cardList)
      this.dataSource.sort = this.sort;

    });
  }

  ngOnInit(): void {
    this.dataTable = $("example");
    //$('#example').DataTable();
    //this.dataTable.DataTable();
  }

  addCardsCollection(card, quantitycollection){
    card['quantityCol'] = quantitycollection
    if(quantitycollection == 0){
      this.collection.cardList.forEach((item, index) => {
        if (item.name === card.name){
          this.collection.cardList.splice(index,1)
          this.decksService.deleteCardFromCollection(item, this.collection.id).subscribe((data) => {
            console.log(data)
            this.collectionTable.renderRows()
            this.dataSource.filter = "".trim().toLowerCase();

          })
          return;
        }
      })
    } else {
      this.decksService.modifyCardCollection(card, this.collection.id).subscribe((data) => {
        console.log(data)
        this.collectionTable.renderRows()
        this.dataSource.filter = "".trim().toLowerCase();

      })

    }
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      this.collectionTable.renderRows()
      this.dataSource.filter = "".trim().toLowerCase();

    });

    dialogRef.afterClosed().subscribe(result => {
      this.collectionTable.renderRows()
    });
  }

  async importCards(content) {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(async (result) => {
      let dialogRef: MatDialogRef<SpinnerComponent> = this.dialog.open(SpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });
      if (result === 'Import'){
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
            this.collection.addCard(carNew, this.decksService, true);
            this.dataSource.filter = "".trim().toLowerCase();

              // this.decksService.saveCollection(this.collection);
            // this.collectionTable.renderRows()

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

  searchCard($event: Event) {
    if ($event.target['value'].length >= 3) {
      this.decksService.searchInCollection(this.collection, $event.target['value'])
        .subscribe((data: Object[]) => {
        if (data.length == 0){
          this.filteredCard = []
        } else {
          this.filteredCard =data[0]['cardList']
        }
      });
    } else {
      this.filteredCard = null;
    }

  }

  exportCollection() {
    let content = ''
    this.collection.cardList.forEach(item => {
      content += item.quantity + " " + item.name + "\n"
    })
    const blob = new Blob([content], { type: 'text/plain' });
    const url= window.URL.createObjectURL(blob);

    window.open(url);
  }

  showImageCard( card) {
    const modalRef = this.modalService.open(ShowImageCardComponent, {ariaLabelledBy: 'modal-basic-title'})

    modalRef.componentInstance.card = card;

  }
}
