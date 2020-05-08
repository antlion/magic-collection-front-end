import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import {RouterModule, Routes} from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { SearchCardComponent } from './search-card/search-card.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import { IncrementInputComponent } from './increment-input/increment-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MyDeckComponent } from './components/my-deck/my-deck.component';
import { AddDeckComponent } from './add-deck/add-deck.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";



import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthInterceptor} from './services/authconfig.interceptor';
import {AuthGuard} from './services/auth.guard';
import {AlertComponent} from './components/alert/alert.component';
import { ShowDeckComponent } from './components/show-deck/show-deck.component';
import { AddCardComponent } from './dialog/add-card/add-card.component';
import { CardComponent } from './components/card/card.component';
import {CountCardsPipe, CountCardsPrice} from './pipes/count-cards.pipe';
import { MyCollectionsComponent } from './components/collections/my-collections/my-collections.component';
import { CollectionComponent } from './components/collections/collection/collection.component';
import { AddCollectionComponent } from './components/collections/add-collection/add-collection.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatMenuModule} from "@angular/material/menu";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableCardComponent } from './components/show-deck/table-card/table-card.component';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full'},
//   { path: 'home', component: HomeComponent},
//   { path: 'search', component: SearchCardComponent },
//   { path: 'my-decks', component: MyDeckComponent}
// ];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchCardComponent,
    IncrementInputComponent,
    MyDeckComponent,
    AddDeckComponent,
    SigninComponent,
    SignupComponent,
    UserProfileComponent,
    AlertComponent,
    ShowDeckComponent,
    AddCardComponent,
    CardComponent,
    CountCardsPipe,
    MyCollectionsComponent,
    CollectionComponent,
    AddCollectionComponent,
    CountCardsPrice,
    TableCardComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        FlexLayoutModule,
        MatListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatDialogModule,
        SocialLoginModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        NgbModule,
        MatMenuModule,
        FontAwesomeModule
    ],
  providers: [MatDialog,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }


