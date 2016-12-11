
import { Injectable , Inject } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as consts from './Consts';

@Injectable()
export class SelectedItem {

   item : any;
   listGUID : string;

   itemPropsLoaded : Promise<any>;
   itemDocsLoaded : Promise<any>;

    constructor(@Inject(Http) public http: Http ){
      this.item = {title:'none',guid:'000'};
      this.listGUID = "000";
    }

    private getAllProps() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.listGUID}')/Items(${this.item.Id})/FieldValuesAsText`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            this.item = res.json().d;
            return this.item;
         })
    }

    private getAllDocs() : Promise<any> {
      let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.listGUID}')/Items(${this.item.Id})/Folder/Files`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose'});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            return res.json().d.results;
         })
         .catch(error => {
            console.error('<SelectedItem> Loading Docs error!',error);
            return [];
         })
   }

    public set(item : Object , listGUID : string){
      this.item = item;
      this.listGUID = listGUID;
      this.itemPropsLoaded = this.getAllProps();
      this.itemDocsLoaded = this.getAllDocs();
    }

    public getItemProps() : Promise<any> {
      return this.itemPropsLoaded;
   }

   public getItemDocs() : Promise<any> {
      return this.itemDocsLoaded;
   }

   public getId(): number {
      return this.item.Id;
   }

   public getListGUID() : string {
      return this.listGUID;
   }

}
