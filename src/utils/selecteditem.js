
import { Injectable ,Http } from '@angular/core';
import { Component ,Inject} from '@angular/core';
import * as consts from './Consts';

@Injectable()
export class SelectedItem {
    items:Array<any>;
    http: any;
    constructor(public http: Http){
        this.http = http;
    }

    public init(){

    }

}