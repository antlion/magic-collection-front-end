import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {User} from '../../models/user.model';
import {catchError, map} from 'rxjs/operators';
import {Deck} from '../../models/deck.model';

@Injectable({
  providedIn: 'root'
})
export class DecksService {

  endpoint = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMyDecks(){
    const currentUser: User = this.authService.getCurrentUser() as User;
    const localToken = this.authService.getDecodedAccessToken();
    console.log(localToken);
    const api = `${this.endpoint}/my-decks/${localToken.userId}`;
    return this.http.get(api);
  }

  addDeck(deck: Deck){
    const localToken = this.authService.getDecodedAccessToken();
    const api = `${this.endpoint}/my-decks/${localToken.userId}/add`;
    return this.http.post(api, deck).subscribe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.authService.handleError)
    );
  }
}
