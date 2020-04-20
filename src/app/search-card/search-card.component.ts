import { Component, OnInit } from '@angular/core';
import {SearchCardService} from "../services/search-card.service";

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss']
})
export class SearchCardComponent implements OnInit {

  cardList: any = []
  _value: number = 0;
  _step: number = 1;
  _min: number = 0;
  _max: number = Infinity;
  _wrap: boolean = false;
  color: string = 'default';

  constructor(private searchCardService: SearchCardService) { }

  ngOnInit(): void {

  }

  onSearchChange(card_name: any) {
    this.searchCardService.get_card_by_name(card_name).subscribe((data)=>{
      console.log(data)
      if (data["object"] == 'list'){
        this.cardList = data["data"];
      }else{
        this.cardList = [data];
      }
      console.log(this.cardList.image_uris['small'])
    })
  }
}
