import { Component , Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';

@Component({
  selector: 'LSActive',
  templateUrl: 'LSActive.html'
})
export class LSActive {

  items : Array<any>;

  constructor(public navCtrl: NavController,@Inject(Http) public http: Http, @Inject(User) public user : User) {
     this.user.getUserProps()
      .then(() => {
        return this.getActiveTasks()
      })
      .then( tasks => {
        console.dir(tasks);
        this.items = (JSON.parse(tasks._body)).d.results;
      })
      .catch( error => {
        console.error('<LSActive> Fail loading ',error);
        this.items = [];
      })
  }

  getActiveTasks() : Promise<any>{
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'In Progress')&$orderby=TaskDueDate asc&$top=1000`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    let options = new RequestOptions({ headers: headers ,withCredentials: true});

    return this.http.get(listGet,options).toPromise();
  }

}

