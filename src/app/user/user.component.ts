import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserResponse  {
  items:any[]
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  rForm: FormGroup;
  name:string;
  limit:string;
  result:any[];
  executionTime:number;
  constructor(private route: ActivatedRoute, private router: Router, private fb:FormBuilder, private http: HttpClient) {
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'limit': [null, Validators.required]
        })
  }
  goToUser(value):void{
    this.router.navigate(['/user/',value.name,value.limit]);
   }
  ngOnInit() {
    this.name = this.route.snapshot.params.name;
    if(this.route.snapshot.params.limit == null){
      this.limit = "100";
    }
    else{
      this.limit = this.route.snapshot.params.limit;
    }
    console.log(this.name);
    let startFrom = new Date().getTime();
    this.http.get<UserResponse>('https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api/myapi/v1/tweets/'+this.name+'?limit='+this.limit).subscribe(data => {
      console.log(data.items),
      this.executionTime = new Date().getTime() - startFrom,
      console.log(this.executionTime),
      this.result = data.items;
    });
  }

}
