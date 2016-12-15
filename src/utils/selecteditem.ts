
import { Injectable , Inject } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as consts from './Consts';

@Injectable()
export class SelectedItem {

   item : any;
   listGUID : string;

   itemPropsLoaded : Promise<any>;
   itemDocsLoaded : Promise<any>;
   itemHistoryLoaded : Promise<any>;
   itemRoutesLoaded : Promise<any>;

    constructor(@Inject(Http) public http: Http ){
      this.item = {title:'none',guid:'000'};
      this.listGUID = "000";
    }

    private getProps() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.listGUID}')/Items(${this.item.Id})/FieldValuesAsText`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            this.item = res.json().d;
            return this.item;
         })
         .catch( error =>{
           console.error('<SelectedItem> Loading Props error!',error);
           return {'Ошибка':'Загрузка данных неуспешна'};
         })
    }

    private getDocs() : Promise<any> {
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

    private getHistory() : Promise<any>{
      let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '${this.item.Id}') and (Title eq '${this.listGUID}') and (ItemName eq 'Task')`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose'});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            return res.json().d.results;
         })
         .catch(error => {
            console.error('<SelectedItem> Loading History error!',error);
            return [];
         })
    }

    private getRoutes() : Promise<any> {
                                     //  _api/Web/Lists/GetByTitle('RoutesForDocs')/items?$filter=(sysListId eq 'da50a3c2-3138-4a85-9b2d-7c0c813c3a6c') and (sysTypeId eq '8cb170f9-87bd-4bab-9c3e-b26702590d6d')
      let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('RoutesForCurentDoc')/items?$select=sysListId,sysTypeId,ID,ManualState,StatePermission,EditState,StateNumber,StateName,StartDate,StateType,EndDate,ExecutJobTitle,StateEstimate,StateExecutore,StateStatus,ExecutorType,StateExecutore/Title,StateExecutore/Name&$expand=StateExecutore/Title,StateExecutore/Name&$filter=(sysListId eq '${this.listGUID}') and (sysIDItem eq '${this.item.Id}')&$orderby=StateNumber asc`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose'});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(listGet,options)
         .toPromise()
         .then( res => {
            return res.json().d.results;
         })
         .catch(error => {
            console.error('<SelectedItem> Loading Routes error!',error);
            return [];
         })
    }

    public set(item : Object , listGUID : string){
      this.item = item;
      this.listGUID = listGUID;
      this.itemPropsLoaded = this.getProps();
      this.itemDocsLoaded = this.getDocs();
      this.itemHistoryLoaded = this.getHistory();
      this.itemRoutesLoaded = this.getRoutes();
    }

    public getItemProps() : Promise<any> {
      return this.itemPropsLoaded;
   }

   public getItemDocs() : Promise<any> {
      return this.itemDocsLoaded;
   }

   public getItemHistory() : Promise<any> {
      return this.itemHistoryLoaded;
   }

   public getItemRoutes() : Promise<any> {
      return this.itemRoutesLoaded;
   }

   public getId(): number {
      return this.item.Id;
   }

   public getListGUID() : string {
      return this.listGUID;
   }

}
