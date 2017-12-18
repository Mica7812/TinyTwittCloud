import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Tweet } from './models/tweet';

@Injectable()
export class TweetService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http:Http) {}

      getTweets():Observable<Tweet>{
        return this.http.get('https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api/myapi/v1/tweets/Mica')
                        .map((response:Response) => <Tweet> response.json())
                        .catch(this.handleError);
      }

      private handleError(response: Response): Observable<any> {
          let errorMessage = `${response.status} - ${response.statusText}`;
          return Observable.throw(errorMessage);
      }
}
