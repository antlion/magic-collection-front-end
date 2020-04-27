import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DecksService} from '../../services/decks/decks.service';
import {Deck} from '../../models/deck.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCardComponent} from '../../dialog/add-card/add-card.component';

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

    this.decksService.getDeck(idDeck).subscribe((data: Object[]) => {
      console.log(133);
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
}
