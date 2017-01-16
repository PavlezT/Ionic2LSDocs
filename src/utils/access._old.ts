import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
import * as consts from './Consts';

@Injectable()
export class Access{

    digest : any;
    access_token : string;
    access_expiry : string;
   // refresh_token : string;
    itemId : number;

    constructor(@Inject(Http) public http: Http){
        this.itemId = 1;
       
        // if( !window.localStorage.getItem('refresh_expiry') || (new Date(window.localStorage.getItem('refresh_expiry'))) <= new Date())
        //     this.getRefreshToken();
        // else if( (new Date(window.localStorage.getItem('acces_expiry'))) <= new Date() )
        //     this.getAccessToken();
        // else {
        //     this.access_token = window.localStorage.getItem('access_token');
        //     this.access_expiry = window.localStorage.getItem('access_expiry');
        //   //  this.refresh_token = window.localStorage.getItem('refresh_token');
        //     this.getDigest();
        // }
        
        this.getAccessToken();
    }

    getDigest() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/contextinfo`;

     let headers = new Headers({'Authorization':`Bearer ${this.access_token}`,'Accept':"application/json; odata=verbose",'Content-Type': 'application/x-www-form-urlencoded'});
     let options = new RequestOptions({ headers: headers });

     return this.http.post(listGet,{},options).toPromise()
        .then(res=>{
            this.digest = res.json().d.GetContextWebInformation;
            console.log('digest',this.digest);
            return this.digest;
        })
        .catch( err =>{
            console.log('<Access> getDigest error',err);
            if(err.status == '500'){
              //  this.getAccessToken().then(()=>this.getDigest());
            }
            return {FormDigestValue:''};    
        })
    } 

    getToken() : Promise<string> {
        return ((new Date(this.access_expiry)) <= (new Date())) ? this.refreshAccessToken().then(()=>{return this.access_token}) : Promise.resolve(this.access_token);
        // if((new Date(this.access_expiry)) <= (new Date())){
        //     return this.refreshAccessToken().then(()=>{return this.access_token});
        // }
        // return Promise.resolve(this.access_token);
    } 

    getAccessToken() : Promise<any>{
        // let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMobile')/Items`;

        // let headers = new Headers({'Accept': 'application/json;odata=verbose'});
        // let options = new RequestOptions({ headers: headers });

        // return this.http.get(url,options).toPromise()
        //     .then(repsonse => {
        //         let res = repsonse.json().d.results[0];
        //         this.itemId = res.Id;
        //         this.access_token = res.access_token;
        //         this.access_expiry = res.acces_expiry;

        //         if((new Date(res.access_expiry)) <= (new Date())){
        //             return this.refreshAccessToken();
        //         }
                
        //         window.localStorage.setItem('access_token',res.access_token);
        //         window.localStorage.setItem('access_expiry',this.access_expiry);
        //     })
        //     .catch(err =>{
        //         console.log('<Access> getAccessToken error',err);
        //     })
        let url = `https://accounts.accesscontrol.windows.net/${consts.site_realm}/tokens/OAuth/2`;

        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ headers: headers });

        let data = `grant_type=client_credentials&
            client_id=${consts.client_id}@${consts.site_realm}&
            client_secret=${encodeURIComponent(consts.secret)}&
            resource=${consts.resource}/${consts.siteUrl.substring('https://'.length,consts.siteUrl.indexOf('/sites'))}@${consts.site_realm}`   

        return this.http.post(url,data,options).toPromise()
            .then(res=>{
                console.log('access tokens',res.json())
                this.access_token = res.json().access_token;
            })
            .catch(err=>{
                console.log('error',err);
            })
    }

    refreshAccessToken() : Promise<any>{
        let url = `https://accounts.accesscontrol.windows.net/${consts.site_realm}/tokens/OAuth/2`;

        let data = {
            grant_type : consts.grant_type_refresh,
            client_id : consts.client_id+'@'+consts.site_realm,
            client_secret : consts.secret,
          //  refresh_token : this.refresh_token,
            redirect_uri : consts.redirected_uri,
            resource : consts.resource +'/'+ consts.siteUrl.substring('https://'.length,consts.siteUrl.indexOf('/sites')) +'@'+ consts.site_realm
        }

        let headers = new Headers({'Accept': 'application/json;odata=verbose',"Content-Type": "application/x-www-form-urlencoded"});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url,data,options).toPromise()
            .then(response =>{
                let res = response.json();
                this.access_token = res.access_token;
                this.access_expiry = (new Date(Date.now() + res.expires_in*1000)).toJSON();

                window.localStorage.setItem('access_token',res.access_token);
                window.localStorage.setItem('access_expiry',this.access_expiry);
            })
            .then(()=> {
                return this.getDigest();
            })
            .then(()=>{
                let urlList = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMobile')/Items(${this.itemId})`;

                let body = {
                     __metadata : {
                        type : 'SP.Data.LSMobileListItem'
                     },
                     access_token : this.access_token,
                     access_expiry : this.access_expiry
                  }
                let headers = new Headers({"Authorization":`Bearer ${this.access_token}`,"X-RequestDigest": this.digest.FormDigestValue, "X-HTTP-Method":"MERGE","IF-MATCH": "*",'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
                let options = new RequestOptions({ headers: headers });

                return this.http.post(urlList,JSON.stringify(body),options).toPromise()
                    .catch(err=>{
                        console.log(err);
                        throw new Error('Can`t post to LSMobile');
                    });

            })
            .catch(err=>{
                console.log('<Access> refreshAccessToken error',err);
                if(err.error)
                    return this.getRefreshToken();
            });
    }

    getRefreshToken() : Promise<any>{
        let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMobile')/Items`;

        let headers = new Headers({'Accept': 'application/json;odata=verbose'});
        let options = new RequestOptions({ headers: headers });

        return this.http.get(url,options).toPromise()
            .then(repsonse => {
                let res = repsonse.json().d.results[0];

                if((new Date(res.refresh_expiry)) <= (new Date())){
                    this.getRedirectPage();
                    console.log('// Show "Service is unable.Try Later"');
                    return; //error to  return
                }
            //    this.refresh_token = res.refresh_token;
                window.localStorage.setItem('refresh_token',res.refresh_token);
                window.localStorage.setItem('refresh_expiry',res.refresh_expiry);

                if((new Date(res.access_expiry)) <= (new Date())){
                    this.refreshAccessToken();
                    return;
                }
                this.access_token = res.access_token;
                this.access_expiry = res.access_expiry;
                window.localStorage.setItem('access_token',res.access_token);
                window.localStorage.setItem('access_expiry',res.access_expiry);
            })
            .catch(err =>{console.log('<Access> getRefreshToken error',err);})
    }

    getRedirectPage(){//may use to start CSOM code
        let url = `https://lsdocs30.sharepoint.com/sites/LSDocs/_layouts/15/appredirect.aspx?client_id=${consts.client_id}&redirect_uri=${consts.redirected_uri}`;

        return this.http.get(url).toPromise()
            .then(res =>{
                console.log('response redirect page',res);
            })
            .catch(error=>{
                console.log('error redirect page',error);
            })
    }

    refreshApp(){
        let url = `${consts.siteUrl}/_layouts/15/oauthauthorize.aspx?client_id=${consts.client_id}&scope=Web.Read&response_type=code&redirect_uri=${consts.redirected_uri}`;
        return this.http.get(url+'&mobile=0').toPromise()
          .then(res=>{
            let page = res.text();
            let page1 = page.substring(page.indexOf(`id="__REQUESTDIGEST" value="`)+ `id="__REQUESTDIGEST" value="`.length,page.length);
            let page2 = page.substring(page.indexOf(`id="__VIEWSTATE" value="`)+`id="__VIEWSTATE" value="`.length,page.length);
            let page3 = page.substring(page.indexOf(`id="__EVENTVALIDATION" value="`)+`id="__EVENTVALIDATION" value="`.length,page.length);
            let __EVENTTARGET = `ctl00%24PlaceHolderMain%24BtnAllow`;
            let __REQUESTDIGEST = page1.substring(0,page1.indexOf('" />')).replace(/ /g,'+');
            let __VIEWSTATE = encodeURIComponent(page2.substring(0,page2.indexOf('" />')).replace(/ /g,'+'));
            let __EVENTVALIDATION = encodeURIComponent(page3.substring(0,page3.indexOf('" />')).replace(/ /g,'+'));
            return `__EVENTTARGET=${__EVENTTARGET}&__REQUESTDIGEST=${__REQUESTDIGEST}&__VIEWSTATE=${__VIEWSTATE}&__EVENTVALIDATION=${__EVENTVALIDATION}`;
          })
          .then(data=>{
              let headers = new Headers({'Accept':'text/html,application/xhtml+xml,application/xml;',"Content-type":"application/x-www-form-urlencoded"});
              let options = new RequestOptions({ headers: headers });
              return this.http.post(url,data,options).toPromise()
          })
          .then(data=>{
            console.log('after post data',data);
            //this.code = data.json().code;
          })
          .catch(err=>{
            console.log('<Access> Code getter error',err);
          })
    }
}
 //  let listGet = `${consts.siteUrl}/Documents/lsi.listscollection.js`;

    //  let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    //  let options = new RequestOptions({ headers: headers ,withCredentials: true});

    //  return this.http.get(listGet,options).toPromise()
    //  .then(res => {
    //     console.log('res data',res);
    //     //console.log('json data',res.json());
    //     let b = res.text();
    //     b = b.replace(/\'/g,`"`).replace(/;/g,'');
    //     console.log('b',b);
    //     let c = JSON.parse(b.substring(b.indexOf('LSi.ListsCollection = ')+'LSi.ListsCollection = '.length,b.length));
    //     console.log('c',c);
    //  })