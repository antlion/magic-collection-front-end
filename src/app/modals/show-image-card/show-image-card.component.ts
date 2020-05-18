import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-show-image-card',
  templateUrl: './show-image-card.component.html',
  styleUrls: ['./show-image-card.component.scss']
})
export class ShowImageCardComponent implements OnInit {
  @Input() card: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.card);

  }

}
