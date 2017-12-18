import { Component, OnInit } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { HttpModule } from '@angular/http';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { OrderModule } from 'ngx-order-pipe';

import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './feed/feed.component';

const appRoutes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path: 'user',
    component: UserComponent
},
  {
    path: 'user/:name',
    component: UserComponent
},
{
  path: 'user/:name/:limit',
  component: UserComponent
},
{
  path: 'feed',
  component: FeedComponent
},
{
  path: 'feed/:name',
  component: FeedComponent
}
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    FeedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OrderModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
