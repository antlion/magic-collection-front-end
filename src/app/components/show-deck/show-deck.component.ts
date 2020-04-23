import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecksService} from '../../services/decks/decks.service';
import {Deck} from '../../models/deck.model';
import {AddDeckComponent} from '../../add-deck/add-deck.component';
import {MatDialog} from '@angular/material/dialog';
import {AddCardComponent} from '../../dialog/add-card/add-card.component';
import {Subject} from 'rxjs';
import {Card} from '../../models/card.model';
import {valueReferenceToExpression} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-show-deck',
  templateUrl: './show-deck.component.html',
  styleUrls: ['./show-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ShowDeckComponent implements OnInit {

  deck: Deck = new Deck('new-deck');

  constructor(private actRoute: ActivatedRoute, private decksService: DecksService,
              private cdRef: ChangeDetectorRef, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    const idDeck = this.actRoute.snapshot.paramMap.get('id');

    this.decksService.getDeck(idDeck).subscribe((data: any[]) => {
      console.log(133)
      this.deck.name = data['data']['name']
      this.deck.creatures = data['data']['creatures'];
      this.deck.artifacts = data['data']['artifacts'];
      this.deck.enchantments = data['data']['enchantments'];
      this.deck.planeswalkers = data['data']['planeswalkers'];
      this.deck.spells = data['data']['spells'];
      this.deck.lands = data['data']['lands'];
      this.deck.id = data['data']['_id']

    });

    // this.part$.subscribe(eventw => {
    //   this.deck = eventw;
    //   this.deck = this.deck
    //   this.cdRef.detectChanges();
    //
    //
    // });
  }


  addCard() {
    const dialogRef = this.dialog.open(AddCardComponent, {
      data: {
        deck: this.deck,
        saveToDB: true
      }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data) => {
      this.decksService.saveDeck(this.deck);
    });

    dialogRef.afterClosed().subscribe(result => {
      // add deck
      // this.decksService.addDeck(result);
/*
      this.deck = this.deck
*/
    });
  }
}
