import { Injectable , Inject } from '@angular/core';
import { Platform,Events } from 'ionic-angular';
import { User } from './user';

import * as transru from '../assets/i18n/ru';
import * as transus from '../assets/i18n/us';
import * as transua from '../assets/i18n/ua';

@Injectable()
export class Localization {

    localization : string ;
    dictionary : any;

    constructor(@Inject(User) public user : User,public events: Events ,public plat : Platform){ 
        this.localization = 'ru';
        this.loadDictionary();
        events.subscribe('user:loaded',()=>{
            this.user.getUserProps().then(()=>{
                console.log('fired user locale:',this.user.locale)
                this.localization = this.user.locale;
                this.loadDictionary();
            })
        });
        this.plat.ready().then(()=>{
            this.user.getUserProps().then(()=>{
                console.log('fired user locale:',this.user.locale)
                this.localization = this.user.locale;
                this.loadDictionary();
            })
        })
        
    }

    private loadDictionary() : void {
        switch(this.localization){
            case 'ru':
                this.dictionary = transru;
                break;
            case 'ua':
                this.dictionary = transua;
                break;
            case 'us':
                this.dictionary = transus;
                break;
            default :
                this.dictionary = transru;
        }
    }

}