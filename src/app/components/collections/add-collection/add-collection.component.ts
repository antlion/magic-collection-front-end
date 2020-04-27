import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Collection} from '../../../models/collection.model';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddCollectionComponent>, @Inject(MAT_DIALOG_DATA) public collection: Collection) {
    this.collection = new Collection('aaaa');
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
