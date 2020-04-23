import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Deck} from '../../models/deck.model';

import {DecksService} from '../../services/decks/decks.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  providers: [DecksService]
})
export class AddCardComponent implements OnInit {

  onAdd: EventEmitter<any> =  new EventEmitter<any>();
  saveToDb = false;

  constructor(public dialogRef: MatDialogRef<AddCardComponent>, @Inject(MAT_DIALOG_DATA) public data, private decksService: DecksService) {
    this.saveToDb = data.saveToDB;

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
