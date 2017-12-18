import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Http, Response } from '@angular/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Tweet } from './models/tweet';

import { TweetService } from './tweet.service';

import { UUID } from 'angular2-uuid';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TweetService]
})
export class HomeComponent {

  /* FORM */
  rForm: FormGroup;
  post:any;
  body:string;
  name:string;

  title = "TinyTwitt";
  myData:any[];
  tweets: Tweet;
  nextPage: string;
  executionTime = [];


  constructor(private http:HttpClient, private fb:FormBuilder, private tweetService: TweetService){
      this.rForm = fb.group({
        'name': [null, Validators.required],
        'body': [null, Validators.compose([Validators.required, Validators.maxLength(140)])]
      })
  }

  addTweet(tweet):void{
    let uuid = UUID.UUID();
    this.body = tweet.body;
    this.name = tweet.name;

    let startFrom = new Date().getTime();
    let url = "https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api/myapi/v1/tweet/";
     this.http.post(url+this.name,
       {
         body:this.body,
         id:uuid
       }).subscribe(res => {
       console.log(res),
       this.executionTime.push(new Date().getTime() - startFrom);
       console.log(this.executionTime);
     });

   }
}
