import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserResponse  {
  items:any[]
}

@Component({
  selector: 'app-user',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  rForm: FormGroup;
  name:string;
  followees:any[];
  feed = [];
  executionTime:number;

  constructor(private route: ActivatedRoute, private router: Router, private fb:FormBuilder, private http: HttpClient) {
    this.rForm = fb.group({
      'name': [null, Validators.required]
        })
  }
  goToUser(value):void{
    this.router.navigate(['/feed/',value.name]);
    console.log(value.name)
   }
  ngOnInit() {
    this.name = this.route.snapshot.params.name;
    console.log(this.name);
    let startFrom = new Date().getTime();
    this.http.get<UserResponse>('https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api/myapi/v1/getfollower/'+this.name+'?fields=items%2Fparent').subscribe(data => {
      console.log(data.items);
      this.followees = data.items;
      console.log(this.followees);
      for (let i = 0; i < this.followees.length; i++) {
      this.http.get<UserResponse>('https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api/myapi/v1/tweets/'+this.followees[i].parent+'?limit=100').subscribe(data => {
        this.executionTime = new Date().getTime() - startFrom;
        console.log(this.executionTime);
        console.log(data.items);
        this.feed = this.feed.concat(data.items);
        console.log(this.feed);
      });
    }
    });
  }

}
