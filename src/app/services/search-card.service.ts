import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchCardService {

  private SCRY_FALL_SERVER_URL = "https://api.scryfall.com/";

  constructor(private httpClient: HttpClient) { }

  public get_card_by_name(card_name:string){
    return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/search?q="+card_name);
  }

  public get_card_by_exact_name(card_name:string){
    return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/named?exact="+card_name);
  }

  findCardPrice(name: string) {
    return this.httpClient.get(this.SCRY_FALL_SERVER_URL+"cards/named?exact="+name);
  }
}
