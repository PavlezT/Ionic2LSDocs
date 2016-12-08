
// var url = "https://lizardsoftdev.sharepoint.com/sites/LaxaContracts/Contracts/Forms/AllContracts.aspx";
// var urlForREST = "https://lizardsoftdev.sharepoint.com/sites/LaxaContracts/_api/Web/Lists?$select=title"

// getAuth(url,{username:'vladislav.pavlenko@dev.lizard.net.ua',password:'FordBoss302'})
//          .then(function(response){
//              console.dir(response);
//              return sendGET(urlForREST);
//            })
//         //   sendGET(urlForREST)
//         .then(function(data){
//               // console.dir(data);
//                    $('body > div.app')[0].innerHTML = data.d.results.reduce(function(sum,item,count){
//                        return sum+'<br><span>'+item.Title+'</span>';
//                    },'')
// })
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
import { File , Device } from 'ionic-native';
import * as consts from './Consts';

declare var cordova:any;

@Injectable()
export class Auth {
   url:string;
   options: {username:string,password:string};
   http: Http;

   constructor(@Inject(Http) http: Http){
      this.http = http;
   }

   public init(url:string, options:{username:string,password:string}){
      this.url = url;
      this.options = options;
      this.options.username = this.options.username
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
      this.options.password = this.options.password
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
   }
   checkAuthAlready(){
      return false;
   }

   getAuth(): any{
      let self = this;

      if(self.checkAuthAlready()){
         return Promise.resolve({
            header:{
               'cokkie':'asdasd'
            }
         })
      }

      return self.getTokenWithOnline()
            .then( (res : string) => {
               if(res.includes('<S:Fault>') || res.startsWith('Error')){
                   let reason = res.substring(res.indexOf('<S:Detail>'),res.indexOf('</S:Detail>'));
                   reason = reason.substring(reason.indexOf('<psf:text>') + '<psf:text>'.length,reason.indexOf('</psf:text>'));
                   throw new Error(`Fail in loggin!\n ${reason}`);
               } else {
                   let token = res.substring(res.indexOf('<wsse:BinarySecurityToken Id="Compact0">') + '<wsse:BinarySecurityToken Id="Compact0">'.length,res.indexOf('</wsse:BinarySecurityToken>'));
                   let expires = res.substring(res.indexOf('<wst:Lifetime>'),res.indexOf('</wst:Lifetime>'));
                   expires = expires.substring(expires.indexOf('<wsu:Expires>') + '<wsu:Expires>'.length,expires.indexOf('</wsu:Expires>'));
                   return {
                       token : token,//res.find('BinarySecurityToken').text(),
                       expires : expires//res.find('Lifetime').find('Expires').text()
                   };
               }
            })
            .then( tokenResponse => self.postToken(tokenResponse))
            .then( response => {
               console.dir(response);
               return true;
               //console.log(response.text());
               // var diffSeconds = data[0];
               // var fedAuth, rtFa;
               // for (var i = 0; i < response.headers['set-cookie'].length; i++) {
               //     var headerCookie = response.headers['set-cookie'][i];
               //     if (headerCookie.indexOf(consts.FedAuth) !== -1) {
               //         fedAuth = cookie.parse(headerCookie)[consts.FedAuth];
               //     }
               //     if (headerCookie.indexOf(consts.RtFa) !== -1) {
               //         rtFa = cookie.parse(headerCookie)[consts.RtFa];
               //     }
               // }
               // debugger;
               // var authCookie = 'FedAuth=' + fedAuth + '; rtFa=' + rtFa;
               // OnlineUserCredentials.CookieCache.set(cacheKey, authCookie, diffSeconds);
               // return {
               //     headers: {
               //         'Cookie': authCookie
               //     }
               // };
            })
            .catch(error => {
               console.dir(error);
            })
     }

    public getTokenWithOnline(): Promise<any> {
        let self = this;
        let host = self.url.substring(0,self.url.indexOf('/sites/'));
        let spFormsEndPoint =  host + "/" + consts.FormsPath;//'https:' + "//" +

        return self.readFile(consts.Online_saml_path ,consts.Online_saml)
               .then( (text:string) => {
                  let samlBody = text.replace('<%= username %>',self.options.username).replace('<%= password %>',self.options.password).replace('<%= endpoint %>',spFormsEndPoint);
                  let url = (Device.device.uuid) ? (consts.MSOnlineSts) : ('/api?'+consts.MSOnlineSts);

                  let headers = new Headers({'Content-Type': 'application/soap+xml; charset=utf-8'});
                  let options = new RequestOptions({ headers: headers });

                  return self.http.post(url,samlBody,options)
                     .toPromise()
               })
               .then( response => {
                  return response.text()
               })
               .catch( error => {
                  //return `Error:${error.text()}`;
                  throw new Error(`Error in posting XML to loginmicrosoft:\n${JSON.stringify(error)}`);
               })
    }

    public readFile(path,filename):Promise <any>{
      if(Device.device.uuid)//this is device
         return File.readAsText(cordova.file.applicationDirectory + path,filename);
      else if(filename.includes('online_saml.tmpl')){
         console.log('In browser reading file');
         return Promise.resolve(`<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
           <s:Header>
             <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>
             <a:ReplyTo>
               <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>
             </a:ReplyTo>
             <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To>
             <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
               <o:UsernameToken>
                 <o:Username><%= username %></o:Username>
                 <o:Password><%= password %></o:Password>
               </o:UsernameToken>
             </o:Security>
           </s:Header>
           <s:Body>
             <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust">
               <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
                 <a:EndpointReference>
                   <a:Address><%= endpoint %></a:Address>
                 </a:EndpointReference>
               </wsp:AppliesTo>
               <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
               <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
               <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>
             </t:RequestSecurityToken>
           </s:Body>
         </s:Envelope>
         `)
      }
    }

    public postToken(tokenResponse):Promise <any>{
       let self = this;
       let host = self.url.substring(0,self.url.indexOf('/sites/'));
       let spFormsEndPoint = (Device.device.uuid) ? ( host + "/" + consts.FormsPath) : ('/api?'+ host + "/" + consts.FormsPath);
       let now = new Date().getTime();
       let expires = new Date(tokenResponse.expires).getTime();
       let diff = (expires - now) / 1000;
       let diffSeconds = parseInt(diff.toString(), 10);

       let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
       let options = new RequestOptions({ headers: headers });

       return self.http.post(spFormsEndPoint,tokenResponse.token,options)
          .toPromise();
   }

}
