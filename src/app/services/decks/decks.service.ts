import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {User} from '../../models/user.model';
import {catchError, map} from 'rxjs/operators';
import {Deck} from '../../models/deck.model';

import { environment } from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {Card} from '../../models/card.model';
import {Collection} from '../../models/collection.model';


@Injectable({
  providedIn: 'root'
})
export class DecksService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMyDecks(){
    const currentUser: User = this.authService.getCurrentUser() as User;
    const localToken = this.authService.getDecodedAccessToken();
    console.log(localToken);
    const api = `${environment.endpoint}/my-decks/${localToken.userId}`;
    return this.http.get(api);
  }

  addDeck(deck: Deck){
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-decks/${localToken.userId}/add`;
    return this.http.post(api, deck);
  }

  getDeck(idDeck: string) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-decks/${localToken.userId}/${idDeck}`;
    return this.http.get(api);
  }


  saveDeck(deck: Deck) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-decks/${localToken.userId}/patch`;
    return this.http.post(api, deck).subscribe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.authService.handleError)
    );
  }

  saveNewCollection(collection: Collection) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/add`;
    return this.http.post(api, collection).subscribe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.authService.handleError)
    );
  }

  getMyCollections(withCard:boolean = true){
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/all/${withCard}`;
    return this.http.get(api);
  }

  getCollection(id){
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/${id}`;
    return this.http.get(api);
  }

  saveCollection(collection: Collection) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/patch`;
    return this.http.post(api, collection).subscribe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.authService.handleError)
    );
  }

  deleteDeck(myDeck) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-decks/${localToken.userId}/${myDeck._id}/delete`;
    return this.http.get(api);
  }

  getCardByName(name: any) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/search/${name}`;
    return this.http.get(api);

  }

  addCardToDefaultCollection(card: Card) {
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${environment.endpoint}/my-collection/${localToken.userId}/default`;
    return this.http.post(api, card);
  }
}
