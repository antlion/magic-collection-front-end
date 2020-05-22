import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Collection} from "../models/collection.model";

@Injectable({
  providedIn: 'root'
})
export class SearchCardService {

  private SCRY_FALL_SERVER_URL = "https://api.scryfall.com/";

  constructor(private httpClient: HttpClient) { }

  public get_card_by_name(card_name:string){
    return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/search?q="+card_name+"&unique=prints");
  }

  public get_card_by_exact_name(card_name:string, set, set_number){
    return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/"+set+"/"+set_number);
  }

  findCardPrice(name: string, edition = undefined) {
    if (edition) {
      return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/named?exact="+name+"&set="+edition);
    } else {
      return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/named?exact="+name);
    }
  }

  getSetList() {
      return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"sets?type=expansion&lang=en");
    }

}
