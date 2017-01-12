import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
// import {  NativeStorage } from 'ionic-native';
import * as consts from './Consts';

@Injectable()
export class Access{

    constructor(@Inject(Http) public http: Http){

    }

    // window.localStorage.setItem(host , expiry.toString());
}