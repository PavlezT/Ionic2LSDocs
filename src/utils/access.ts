import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
import * as consts from './Consts';

@Injectable()
export class Access{

    private digest : string;
    private digest_expiry : string;
    private access_token : string;
    private access_expiry : string;

    constructor(@Inject(Http) public http: Http){        
        
    }

    public _init() : void {
        this.getAccessToken().then(()=>{
            this.getDigest();
        })
    }

    private getDigest() : Promise<any> {
        let listGet = `${consts.siteUrl}/_api/contextinfo`;

        let headers = new Headers({'Authorization':`Bearer ${this.access_token}`,'Accept':"application/json; odata=verbose",'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(listGet,{},options).toPromise()
            .then(response=>{
                let res = response.json().d.GetContextWebInformation
                this.digest = res.FormDigestValue;
                this.digest_expiry = (new Date(Date.now() + res.FormDigestTimeoutSeconds*1000)).toJSON();
            })
            .catch( err =>{
                console.log('<Access> getDigest error',err);
                if(err.status == '500'){
                    return this.getAccessToken().then(()=>{ return this.getDigest()});
                }
                return {FormDigestValue:''};    
            })
    } 

    private getAccessToken() : Promise<any>{
        let url = `https://accounts.accesscontrol.windows.net/${consts.site_realm}/tokens/OAuth/2`;

        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ headers: headers });

        let data = `grant_type=client_credentials&
            client_id=${consts.client_id}@${consts.site_realm}&
            client_secret=${encodeURIComponent(consts.secret)}&
            resource=${consts.resource}/${consts.siteUrl.substring('https://'.length,consts.siteUrl.indexOf('/sites'))}@${consts.site_realm}`   

        return this.http.post(url,data,options).toPromise()
            .then(response=> {
                let res = response.json();
                this.access_token = res.access_token;
                this.access_expiry = (new Date(Date.now() + res.expires_in*1000)).toJSON();
            })
            .catch(err=> {
                console.log('<Access> getAccessToken error',err);
            })
    }

    public getToken() : Promise<string> {
        return ((new Date(this.access_expiry)) <= (new Date())) ? this.getAccessToken().then(()=>{return this.access_token}) : Promise.resolve(this.access_token);
    } 

    public getDigestValue() : Promise<string> {
        return ((new Date(this.digest_expiry)) <= (new Date())) ? this.getDigest().then(()=>{return this.digest}) : Promise.resolve(this.digest);
    } 
}