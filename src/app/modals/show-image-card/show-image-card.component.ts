import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-show-image-card',
  templateUrl: './show-image-card.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [".modal {z-index: 100000000;}"]
})
export class ShowImageCardComponent implements OnInit {
  @Input() card: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.card);

  }

}
