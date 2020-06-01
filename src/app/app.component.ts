import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'store-magic-collection';

  constructor(public authService: AuthService,public  router: Router) { }

  logout() {
    this.authService.doLogout();
  }
}
