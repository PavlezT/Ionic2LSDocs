
import { Injectable , Inject } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as consts from './Consts';

@Injectable()
export class User{

   Id : number;
   email : string;
   user : any;

   itemPropsLoaded : Promise<any>;

    constructor(@Inject(Http) public http: Http ){
      this.email = 'e@e';
      this.user = {};
      this.user.Title = 'Bob'; 
    }

    private getProps() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/CurrentUser`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            this.user = res.json().d;
            this.email = this.user.Email; 
            this.Id = this.user.Id;
            return this.user;
         })
         .catch( error => {
           console.error('<User> Loading Props error!',error);
           return this.getProps();
         })
   }

   public init(){
     return this.itemPropsLoaded = this.getProps();
   }

   public getUserProps() : Promise<any> {
      return this.itemPropsLoaded;
   }

   public getId(): number {
      return this.Id;
   }

   public getEmail() : string {
     return this.email;
   }

   public getUserName() : string {
     return this.user.Title;
   }

}
