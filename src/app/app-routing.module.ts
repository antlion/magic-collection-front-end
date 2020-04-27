import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './components/signin/signin.component';
import {SignupComponent} from './components/signup/signup.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {AuthGuard} from './services/auth.guard';
import {MyDeckComponent} from './components/my-deck/my-deck.component';
import {ShowDeckComponent} from './components/show-deck/show-deck.component';
import {MyCollectionsComponent} from './components/collections/my-collections/my-collections.component';
import {CollectionComponent} from './components/collections/collection/collection.component';


const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'my-decks', component: MyDeckComponent, canActivate: [AuthGuard] },
  { path: 'my-decks/:id', component: ShowDeckComponent, canActivate: [AuthGuard] },
  { path: 'my-collections', component: MyCollectionsComponent, canActivate: [AuthGuard] },
  { path: 'my-collection/:id', component: CollectionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
