import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {User} from '../../models/user.model';
import {catchError, map} from 'rxjs/operators';
import {Deck} from '../../models/deck.model';

import { environment } from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {Card} from '../../models/card.model';


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
    return this.http.post(api, deck).subscribe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.authService.handleError)
    );
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
}
