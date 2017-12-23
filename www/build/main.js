webpackJsonp([0],{

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Access; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__consts__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var Access = (function () {
    function Access(http) {
        this.http = http;
        this.error_counter = 0;
    }
    Access.prototype._init = function () {
        var _this = this;
        (window.localStorage.getItem('OnPremise') ? Promise.resolve() : this.getSiteRealm().then(function () { return _this.getAccessToken(); })).then(function () {
            _this.getDigest();
        });
        //this.getAccessTokenOnPremise().then(token=>{console.log('token',token)});
    };
    Access.prototype.getDigest = function () {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_3__consts__["k" /* siteUrl */] + "/_api/contextinfo";
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'Authorization': (window.localStorage.getItem('OnPremise') ? "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) : "Bearer " + this.access_token), 'Accept': "application/json; odata=verbose", 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(listGet, {}, options).timeout(__WEBPACK_IMPORTED_MODULE_3__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_3__consts__["h" /* retryCount */]).toPromise()
            .then(function (response) {
            var res = response.json().d.GetContextWebInformation;
            _this.digest = res.FormDigestValue;
            _this.digest_expiry = (new Date(Date.now() + res.FormDigestTimeoutSeconds * 1000)).toJSON();
        })
            .catch(function (err) {
            console.log('<Access> getDigest error', err);
            if (err.status == '500' && !window.localStorage.getItem('OnPremise') && _this.error_counter < 4) {
                _this.error_counter++;
                return _this.getAccessToken().then(function () { return _this.getDigest(); });
            }
            return { FormDigestValue: '' };
        });
    };
    Access.prototype.getAccessToken = function () {
        var _this = this;
        var url = "https://accounts.accesscontrol.windows.net/" + this.site_realm + "/tokens/OAuth/2";
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        var data = "grant_type=client_credentials&\n            client_id=" + __WEBPACK_IMPORTED_MODULE_3__consts__["f" /* client_id */] + "@" + this.site_realm + "&\n            client_secret=" + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_3__consts__["i" /* secret */]) + "&\n            resource=" + __WEBPACK_IMPORTED_MODULE_3__consts__["g" /* resource */] + "/" + __WEBPACK_IMPORTED_MODULE_3__consts__["k" /* siteUrl */].substring('https://'.length, __WEBPACK_IMPORTED_MODULE_3__consts__["k" /* siteUrl */].indexOf('/sites')) + "@" + this.site_realm;
        return this.http.post(url, data, options).timeout(__WEBPACK_IMPORTED_MODULE_3__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_3__consts__["h" /* retryCount */]).toPromise()
            .then(function (response) {
            var res = response.json();
            _this.access_token = res.access_token;
            _this.access_expiry = (new Date(Date.now() + res.expires_in * 1000)).toJSON();
        })
            .catch(function (err) {
            console.log('<Access> getAccessToken error', err);
        });
    };
    Access.prototype.getSiteRealm = function () {
        var _this = this;
        var domen = __WEBPACK_IMPORTED_MODULE_3__consts__["k" /* siteUrl */].substring('https://'.length, __WEBPACK_IMPORTED_MODULE_3__consts__["k" /* siteUrl */].indexOf('.sharepoint.'));
        var urlAuth = "https://login.microsoftonline.com/" + domen + ".onmicrosoft.com/.well-known/openid-configuration";
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose' });
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(urlAuth, options).timeout(__WEBPACK_IMPORTED_MODULE_3__consts__["l" /* timeoutDelay */] + 1000).retry(__WEBPACK_IMPORTED_MODULE_3__consts__["h" /* retryCount */] + 2).toPromise()
            .then(function (data) {
            var text = data.json().issuer;
            _this.site_realm = text.substring("https://sts.windows.net/".length, text.length - 1);
        })
            .catch(function (error) { console.error('<Access> getSiteRealm error:', error); });
    };
    Access.prototype.getToken = function () {
        var _this = this;
        return ((new Date(this.access_expiry)) <= (new Date(Date.now()))) && !window.localStorage.getItem('OnPremise') ? this.getAccessToken().then(function () { return _this.access_token; }) : Promise.resolve(window.localStorage.getItem('OnPremise') ? __WEBPACK_IMPORTED_MODULE_3__consts__["e" /* access_tokenOnPremise */] : this.access_token);
    };
    Access.prototype.getDigestValue = function () {
        var _this = this;
        return ((new Date(this.digest_expiry)) <= (new Date(Date.now()))) ? this.getDigest().then(function () { return _this.digest; }) : Promise.resolve(this.digest);
    };
    return Access;
}());
Access = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["A" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */]])
], Access);

//# sourceMappingURL=access.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Item; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tabs_InfoTab_InfoTab__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Tabs_Documents_Documents__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Tabs_History_History__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Tabs_Route_Route__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
 //, Inject






var Item = (function () {
    function Item(navCtrl, navParams, menuCtrl, events, platform, viewCtrl, loc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menuCtrl = menuCtrl;
        this.events = events;
        this.platform = platform;
        this.viewCtrl = viewCtrl;
        this.loc = loc;
        this.title = navParams.data.item.Title || '---';
        this.id = navParams.data.item.Id;
        this.listGUID = navParams.data.listGUID;
        this.ContentTypeId = navParams.data.item.ContentTypeId || '0x0';
        this.infoTab = __WEBPACK_IMPORTED_MODULE_2__Tabs_InfoTab_InfoTab__["a" /* InfoTab */];
        this.documents = __WEBPACK_IMPORTED_MODULE_3__Tabs_Documents_Documents__["a" /* Documents */];
        this.history = __WEBPACK_IMPORTED_MODULE_4__Tabs_History_History__["a" /* History */];
        this.routes = __WEBPACK_IMPORTED_MODULE_5__Tabs_Route_Route__["a" /* Route */];
        events.subscribe('itemslide:change', function (tab) {
            _this.tabRef.select(tab[0]);
        });
        events.subscribe('itemsmenu:open', function () {
            menuCtrl.open();
        });
    }
    Item.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.dismiss(); return false; }, 100);
    };
    Item.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return Item;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('myTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Tabs */])
], Item.prototype, "tabRef", void 0);
Item = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'item',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Item.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      <ion-slides>\n         <ion-slide>\n            <h2>{{id}} {{title}}</h2>\n         </ion-slide>\n      </ion-slides>\n   </ion-title>\n    <!--<ion-buttons end>\n      <button ion-button icon-only color="royal">\n        <ion-icon name="md-create"></ion-icon>\n      </button>\n    </ion-buttons>-->\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-tabs #myTabs class="tabs-icon-text"  >\n    <!--itemid="{{id}}" listGUID="{{listGUID}}"-->\n    <ion-tab tabIcon="alert" tabTitle="{{loc.dic.GeneralInformation}}"  [root]="infoTab"></ion-tab>\n    <ion-tab tabIcon="copy" tabTitle="{{loc.dic.Documents}}"  [root]="documents"></ion-tab>\n    <ion-tab tabIcon="clock" tabTitle="{{loc.dic.History}}" [root]="history"></ion-tab>\n    <ion-tab tabIcon="list" tabTitle="{{loc.dic.LSMobileRoute}}"  [root]="routes"></ion-tab>\n  </ion-tabs>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Item.html"*/
    }),
    __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */]])
], Item);

//# sourceMappingURL=Item.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArraySortPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ArraySortPipe = (function () {
    function ArraySortPipe() {
    }
    ArraySortPipe.prototype.transform = function (array, args) {
        if (typeof args[0] === "undefined" || !array) {
            return array;
        }
        var direction = args[0];
        var column = args.slice(1);
        array.sort(function (a, b) {
            var left = Number(new Date(a[column]));
            var right = Number(new Date(b[column]));
            return (direction === "-") ? right - left : left - right;
        });
        return array;
    };
    return ArraySortPipe;
}());
ArraySortPipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Pipe */])({
        name: "arraySort"
    })
], ArraySortPipe);

//# sourceMappingURL=arraySort.js.map

/***/ }),

/***/ 128:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 128;

/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Localization; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__assets_i18n_ru__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__assets_i18n_ru___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__assets_i18n_ru__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__assets_i18n_us__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__assets_i18n_us___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__assets_i18n_us__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__assets_i18n_ua__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__assets_i18n_ua___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__assets_i18n_ua__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var Localization = (function () {
    function Localization(user, events, plat) {
        var _this = this;
        this.user = user;
        this.events = events;
        this.plat = plat;
        this.localization = 'ru';
        this.loadDictionary();
        events.subscribe('user:loaded', function () {
            _this.localization = _this.transformLocale(_this.user.locale);
            _this.loadDictionary();
        });
        this.plat.ready().then(function () {
            _this.user.getUserProps().then(function () {
                _this.localization = _this.transformLocale(_this.user.locale);
                _this.loadDictionary();
            });
        });
    }
    Localization.prototype.loadDictionary = function () {
        switch (this.localization) {
            case 'ru':
                this.dic = __WEBPACK_IMPORTED_MODULE_3__assets_i18n_ru__;
                break;
            case 'uk':
                this.dic = __WEBPACK_IMPORTED_MODULE_5__assets_i18n_ua__;
                break;
            case 'en-gb':
                this.dic = __WEBPACK_IMPORTED_MODULE_4__assets_i18n_us__;
                break;
            default:
                this.dic = __WEBPACK_IMPORTED_MODULE_3__assets_i18n_ru__;
        }
    };
    Localization.prototype.transformLocale = function (locale) {
        switch (locale) {
            case 'us':
                return 'en-gb';
            case 'ua':
                return 'uk';
            default:
                return locale;
        }
    };
    return Localization;
}());
Localization = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__user__["a" /* User */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */]])
], Localization);

//# sourceMappingURL=localization.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return timeoutDelay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return retryCount; });
/* unused harmony export swipeDelay */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MSOnlineSts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FormsPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Online_saml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Online_saml_path; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return client_id; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return secret; });
/* unused harmony export redirect_uri */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return resource; });
/* unused harmony export OnPremise_keyPath */
/* unused harmony export Key */
/* unused harmony export shaThumbprint */
/* unused harmony export isser_id */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return access_tokenOnPremise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return siteUrl; });
/* harmony export (immutable) */ __webpack_exports__["j"] = setUrl;
//NOT CHANGE LOWER
//NOT CHANGE LOWER
var timeoutDelay = 3500;
var retryCount = 4;
var swipeDelay = 300;
var MSOnlineSts = 'https://login.microsoftonline.com/extSTS.srf';
var FormsPath = '_forms/default.aspx?wa=wsignin1.0';
var Online_saml = 'online_saml.tmpl';
var Online_saml_path = 'www/assets/templates/';
var client_id = '6cb98da8-34b6-41cc-8730-e7453078376c';
var secret = '6yaXSnbZT7YAohlhZxZFHHW2rA+lpxzJOlfsmg0iBb0=';
var redirect_uri = 'https://lsdocs.azurewebsites.net';
var resource = '00000003-0000-0ff1-ce00-000000000000';
//On Premise
var OnPremise_keyPath = 'www/assets/templates/';
var Key = 'spaddin.key';
var shaThumbprint = '3FNtei0NfX9PyzHRxwXeKntomcY';
var isser_id = '9e9e46c4-6329-4990-a0b8-13b87b3ba56a';
var access_tokenOnPremise = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IjNGTnRlaTBOZlg5UHl6SFJ4d1hlS250b21jWSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbHNkb2NzLmV4dDUubGl6YXJkLm5ldC51YUAxYTgxMWIyMi04YjJlLTQ1M2MtODE5MS0wYmJjMDM3MWRlOGEiLCJpc3MiOiI5ZTllNDZjNC02MzI5LTQ5OTAtYTBiOC0xM2I4N2IzYmE1NmFAMWE4MTFiMjItOGIyZS00NTNjLTgxOTEtMGJiYzAzNzFkZThhIiwibmFtZWlkIjoiMDQyYTNjYjQtYzE0MC00NDU1LWFiMmYtZTQ2ZjE0OTMxMWRjQDFhODExYjIyLThiMmUtNDUzYy04MTkxLTBiYmMwMzcxZGU4YSIsIm5iZiI6IjExNzI0OTA4NzYiLCJleHAiOiIxODAzMjEwODc2IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOnRydWUsImlhdCI6MTQ4Nzg1MDg3Nn0.UXt30oEuAFKx4oLE7IQ7ZrWF15NtcsCUS9NEJljjidDYBGWWwfomL7fAJVa9JwGUuu7r8_V2fb2uTfkAgAa1WGP4JSJS6lkUPqzrx1oTnHLhfPbwWwVJzFOnEEKT2URpLc1oox1AeENPE7JE0mBVOpFJ6G34rlwAU_HRdTx7jZVM20axPP5PkqO3nDuV8ZpZXOUb7-qAiQ9e8s0VdIzsTO5FKS6gQ4gKwQJYYaaOz2Uotc_I6hvTqhT3xfTe1frRxq29T2C3CPUcE7Hb2N_dun9xYdXV3wZvzp-nRtIBOgTwk6CSYAa8FUnukH8WhzO-WrBtWg_qjJccKd5rg7pBYtxL233e4npslJrcQ7cH5YOvgihq9iSfuPWi6uggzmi0p__fyy2BbYKVWKByAe-E3ocWeIA1sz2JDHe5a1MCJxajwrN2xx4xi4MqI3iUh3upPhGtaXmbAx0M41cG04qHND0Hr18d45BhqhHWAq5T6ALfsb2C3mVZz4cRtRNz53Yok0DEqu6_aMPjDmKaz3nGGJCmuvZJUCTvAZq_Ka_crVi_n2X10LTNH0CBjW_Jr7PZnKTGiDlftl8wPPT7BHpJ91XPLg24yZccTs_5JPNnppw0kibg-a6hutKcGjvD4qgD59FOpGEIcrhfT_lCXpVUPc1HuBUSxpij0Ty6RIW_WeI';
//update for special site
var siteUrl; //= 'https://qalizard.sharepoint.com/sites/LSDocs';//'https://lizardsoftcom.sharepoint.com/sites/ls-net';
// export const site_realm = '5dab8cdb-5d81-439b-93dd-0dec67231dc2';//'c65ff4dd-5d90-4eee-a7b3-febe4438d60f';
// export const OnPremise = false;
//= 'https://qalizard.sharepoint.com/sites/LSDocs';//'https://lizardsoftcom.sharepoint.com/sites/ls-net';
function setUrl(url) {
    siteUrl = url.trim();
}
// export const AdfsOnlineRealm = 'urn:federation:MicrosoftOnline';
// export const OnlineUserRealmEndpoint = 'https://login.microsoftonline.com/GetUserRealm.srf';
//isserId lsdocs 26bab6fd-6d83-4f7b-8a9c-54195697d012
//# sourceMappingURL=consts.js.map

/***/ }),

/***/ 168:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 168;

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Auth; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_storage__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__consts__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var Auth = (function () {
    function Auth(http, file, device, nativeStorage) {
        this.file = file;
        this.device = device;
        this.nativeStorage = nativeStorage;
        this.http = http;
    }
    Auth.prototype.init = function (url, options) {
        this.url = url;
        this.options = options;
        window.localStorage.setItem('OnPremise', (url.indexOf('.sharepoint.com/') == -1 ? 'true' : ''));
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
    };
    Auth.prototype.saveUserCredentials = function () {
        if (window.localStorage.getItem('OnPremise')) {
            window.localStorage.setItem('username', this.options.username);
            window.localStorage.setItem('password', this.options.password);
        }
        this.nativeStorage.setItem('user', { username: this.options.username, password: this.options.password })
            .then(
        //()=>{
        // Promise.all([this.secureStorage.set('username', 'ddd'),
        //             this.secureStorage.set('password','pppp')])//this.options.password
        //  .then(
        function (data) { return console.log('<Auth> User credentials data saved'); }, function (error) { console.error('<Auth> Error setting credentials in storage', error); }
        //throw new Error('<Auth> Saving user credentials data:'+ error.message)}
        //   );
        //   }
        );
    };
    Auth.prototype.checkAuthActive = function (host) {
        host = host.substring(0, host.indexOf('/sites/'));
        var now = new Date();
        var expiredOn = new Date(window.localStorage.getItem(host));
        if (!expiredOn || now > expiredOn) {
            window.localStorage.removeItem(host);
            return false;
        }
        return true;
    };
    Auth.prototype.checkAuthAlready = function () {
        var host = window.localStorage.getItem('siteUrl');
        if (!host)
            return false;
        __WEBPACK_IMPORTED_MODULE_6__consts__["j" /* setUrl */](host);
        host = host.substring(0, host.indexOf('/sites/'));
        var expiry = window.localStorage.getItem(host);
        if (expiry)
            return true;
        return false;
    };
    Auth.prototype.setCookieExpiry = function (host, expiry) {
        window.localStorage.setItem(host, expiry.toString());
        this.saveUserCredentials();
    };
    Auth.prototype.getAuth = function () {
        var _this = this;
        var self = this;
        var host = self.url.substring(0, self.url.indexOf('/sites/'));
        return (!window.localStorage.getItem('OnPremise') ? this.getTokenWithOnline().then(function (res) { return _this.XmlParse(res); })
            .then(function (tokenResponse) {
            return self.postToken(tokenResponse);
        })
            : this.checkOnPremise())
            .then(function (response) {
            var diffSeconds = response[0];
            var now = new Date();
            now.setSeconds(now.getSeconds() + diffSeconds);
            var authPage = (response[1] && response[1].text) ? response[1].text() : " ";
            if (authPage.includes('Correlation ID:') || authPage.includes('<div id="errordisplay-mainDiv">'))
                throw new Error("Error in login user in sharepoint:" + authPage.slice(authPage.indexOf('id="errordisplay-IssueTypeValue">') + 'id="errordisplay-IssueTypeValue">'.length, authPage.lastIndexOf('</span>')));
            self.setCookieExpiry(host, now);
            return true;
        })
            .catch(function (error) {
            throw new Error(error.message || error);
        });
    };
    Auth.prototype.checkOnPremise = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_6__consts__["k" /* siteUrl */]).toPromise()
            .then(function () { return [60 * 60 * 24 * 365, {}]; })
            .catch(function (err) {
            console.log('<Auth> error checking onPremise:', err);
            throw new Error('Url is invalid or site is unreachable.');
        });
    };
    Auth.prototype.XmlParse = function (res) {
        if (res.includes('<S:Fault>') || res.startsWith('Error')) {
            var reason = res.substring(res.indexOf('<S:Detail>'), res.indexOf('</S:Detail>'));
            reason = reason.substring(reason.indexOf('<psf:text>') + '<psf:text>'.length, reason.indexOf('</psf:text>'));
            console.error("<Auth> Fail in loggin: " + reason);
            throw new Error("Fail in loggin!\n The email or password you entered is incorrect."); //${reason}
        }
        else {
            var token = res.substring(res.indexOf('<wsse:BinarySecurityToken Id="Compact0">') + '<wsse:BinarySecurityToken Id="Compact0">'.length, res.indexOf('</wsse:BinarySecurityToken>'));
            var expires = res.substring(res.indexOf('<wst:Lifetime>'), res.indexOf('</wst:Lifetime>'));
            expires = expires.substring(expires.indexOf('<wsu:Expires>') + '<wsu:Expires>'.length, expires.indexOf('</wsu:Expires>'));
            return {
                token: token,
                expires: expires
            };
        }
    };
    Auth.prototype.getTokenWithOnline = function () {
        var self = this;
        var host = self.url.substring(0, self.url.indexOf('/sites/'));
        var spFormsEndPoint = host + "/" + __WEBPACK_IMPORTED_MODULE_6__consts__["a" /* FormsPath */];
        if (!host.includes('https://'))
            return Promise.reject("The URL should support the HTTPS protocol.");
        return self.readFile(__WEBPACK_IMPORTED_MODULE_6__consts__["d" /* Online_saml_path */], __WEBPACK_IMPORTED_MODULE_6__consts__["c" /* Online_saml */])
            .then(function (text) {
            var samlBody = text.replace('<%= username %>', self.options.username).replace('<%= password %>', self.options.password).replace('<%= endpoint %>', spFormsEndPoint);
            var url = __WEBPACK_IMPORTED_MODULE_6__consts__["b" /* MSOnlineSts */];
            var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'Content-Type': 'application/soap+xml; charset=utf-8' });
            var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
            return self.http.post(url, samlBody, options).timeout(__WEBPACK_IMPORTED_MODULE_6__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__consts__["h" /* retryCount */])
                .toPromise();
        })
            .then(function (response) {
            return response.text();
        })
            .catch(function (error) {
            throw new Error("Error while connecting \"loginmicrosoft\""); //`Error in posting XML to loginmicrosoft:\n${JSON.stringify(error)}`);
        });
    };
    Auth.prototype.readFile = function (path, filename) {
        if (this.device.uuid)
            return this.file.readAsText(cordova.file.applicationDirectory + path, filename).catch(function (error) { throw new Error('Read SAML file error!'); });
        else if (filename.includes('online_saml.tmpl')) {
            console.log('In browser reading file');
            return Promise.resolve("<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">\n           <s:Header>\n             <a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>\n             <a:ReplyTo>\n               <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>\n             </a:ReplyTo>\n             <a:To s:mustUnderstand=\"1\">https://login.microsoftonline.com/extSTS.srf</a:To>\n             <o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n               <o:UsernameToken>\n                 <o:Username><%= username %></o:Username>\n                 <o:Password><%= password %></o:Password>\n               </o:UsernameToken>\n             </o:Security>\n           </s:Header>\n           <s:Body>\n             <t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\">\n               <wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\">\n                 <a:EndpointReference>\n                   <a:Address><%= endpoint %></a:Address>\n                 </a:EndpointReference>\n               </wsp:AppliesTo>\n               <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>\n               <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>\n               <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>\n             </t:RequestSecurityToken>\n           </s:Body>\n         </s:Envelope>\n         ");
        }
    };
    Auth.prototype.postToken = function (tokenResponse) {
        var self = this;
        var host = self.url.substring(0, self.url.indexOf('/sites/'));
        var spFormsEndPoint = host + "/" + __WEBPACK_IMPORTED_MODULE_6__consts__["a" /* FormsPath */];
        var now = new Date().getTime();
        var expires = new Date(tokenResponse.expires).getTime();
        var diff = (expires - now) / 1000;
        var diffSeconds = parseInt(diff.toString(), 10);
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return Promise.all([diffSeconds, self.http.post(spFormsEndPoint, tokenResponse.token, options).timeout(__WEBPACK_IMPORTED_MODULE_6__consts__["l" /* timeoutDelay */] + 10000).retry(__WEBPACK_IMPORTED_MODULE_6__consts__["h" /* retryCount */] + 3)
                .toPromise()]);
    };
    return Auth;
}());
Auth = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["A" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__["a" /* Device */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_storage__["a" /* NativeStorage */]])
], Auth);

//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyTasks; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_badge__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_loader__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_localization__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Tabs_LSNew_LSNew__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Tabs_LSActive_LSActive__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Tabs_LSLate_LSLate__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__Tabs_LSEnded_LSEnded__ = __webpack_require__(344);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var MyTasks = (function () {
    function MyTasks(menuCtrl, navCtrl, platform, navParams, loc, loaderctrl, http, events, user, badge) {
        var _this = this;
        this.menuCtrl = menuCtrl;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.navParams = navParams;
        this.loc = loc;
        this.loaderctrl = loaderctrl;
        this.http = http;
        this.events = events;
        this.user = user;
        this.badge = badge;
        //this.Title = navParams.data.title || this.loc.dic.MyRoom;
        this.tabNew = __WEBPACK_IMPORTED_MODULE_8__Tabs_LSNew_LSNew__["a" /* LSNew */];
        this.tabActive = __WEBPACK_IMPORTED_MODULE_9__Tabs_LSActive_LSActive__["a" /* LSActive */];
        this.tabLate = __WEBPACK_IMPORTED_MODULE_10__Tabs_LSLate_LSLate__["a" /* LSLate */];
        this.tabEnded = __WEBPACK_IMPORTED_MODULE_11__Tabs_LSEnded_LSEnded__["a" /* LSEnded */];
        this.resetCounts();
        platform.ready().then(function () {
            events.subscribe('user:loaded', function () {
                _this.resetCounts();
                _this.setTasksCount();
            });
            events.subscribe('task:checked', function () {
                _this.resetCounts();
                _this.setTasksCount();
            });
            _this.setTasksCount();
            events.subscribe('slide:change', function (tab) {
                _this.tabRef.select(tab[0]);
            });
            events.subscribe('menu:open', function () {
                menuCtrl.open();
            });
        });
        this.chatParams = { 'd': 'bb' };
    }
    MyTasks.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.platform.exitApp(); return false; }, 100);
    };
    MyTasks.prototype.setTasksCount = function () {
        var _this = this;
        this.loaderctrl.presentLoading();
        return this.user.getUserProps()
            .then(function (status) {
            if (status)
                return _this.getTasksCount();
            return [[], []];
        })
            .then(function (res) {
            res[1].map(function (item) {
                if (item.OData__Status == 'Not Started')
                    _this.counts.new++;
                if (item.OData__Status == 'In Progress')
                    _this.counts.active++;
                if (item.OData__Status != 'Done' && (new Date(item.TaskDueDate)) < (new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())))
                    _this.counts.late++;
            });
            res[0].map(function (item) {
                if (item.CountTasks)
                    _this.counts.done += item.CountTasks;
            });
        })
            .then(function () {
            _this.loaderctrl.stopLoading();
            cordova.plugins.notification.badge.requestPermission(function (text) { });
            _this.counts.new > 0 ? _this.badge.set(_this.counts.new) : _this.badge.clear();
        })
            .catch(function (error) {
            console.log('<MyTasks> setting Count Tasks error', error);
            _this.loaderctrl.stopLoading();
            _this.counts = {};
        });
    };
    MyTasks.prototype.getTasksCount = function () {
        var getUrl = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=AssignetToEmail,TaskDueDate,OData__Status&$filter=(AssignetToEmail eq '" + this.user.getEmail() + "')&$top=1000";
        var listGet = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSUsersHistory')/items?$select=UserName/EMail,CountTasks&$expand=UserName/EMail&$filter=UserName/EMail eq '" + this.user.getEmail() + "'&$top=1000";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return Promise.all([this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["h" /* retryCount */]).toPromise(), this.http.get(getUrl, options).timeout(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["h" /* retryCount */]).toPromise()])
            .then(function (res) {
            res[0] = res[0].json().d.results;
            res[1] = res[1].json().d.results;
            return res;
        })
            .catch(function (error) {
            console.error('<MyTasks> Loading Counts Tasks error!', error);
            return [[], []];
        });
    };
    MyTasks.prototype.resetCounts = function () {
        this.counts = {
            new: 0,
            active: 0,
            late: 0,
            done: 0
        };
    };
    return MyTasks;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('myTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Tabs */])
], MyTasks.prototype, "tabRef", void 0);
MyTasks = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'MyTasks',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/MyTasks.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{loc.dic.MyRoom}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n   <ion-tabs #myTabs tabsPlacement="top" >\n      <!-- //tabBadge="3" -->\n       <ion-tab tabTitle="{{loc.dic.StateInMyRoom1}}" tabIcon="medical" tabBadge="{{this.counts.new}}" tabBadgeStyle="new" [root]="tabNew"  [rootParams]="chatParams"></ion-tab>\n       <ion-tab tabTitle="{{loc.dic.StateInMyRoom2}}" tabIcon="play"   tabBadge="{{this.counts.active}}"  tabBadgeStyle="primary" [root]="tabActive"></ion-tab>\n       <ion-tab tabTitle="{{loc.dic.StateInMyRoom3}}" tabIcon="warning" tabBadge="{{this.counts.late}}"  tabBadgeStyle="danger" [root]="tabLate" ></ion-tab>\n       <ion-tab tabTitle="{{loc.dic.StateInMyRoom4}}" tabIcon="checkmark" tabBadge="{{this.counts.done}}"  tabBadgeStyle="background" [root]="tabEnded" ></ion-tab>\n     </ion-tabs>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/MyTasks.html"*/
    }),
    __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__utils_loader__["a" /* Loader */])),
    __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])), __param(8, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_5__utils_loader__["a" /* Loader */],
        __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_4__utils_user__["a" /* User */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_badge__["a" /* Badge */]])
], MyTasks);

//# sourceMappingURL=MyTasks.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LSNew; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_locale_ru__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_locale_ru___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment_locale_ru__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment_locale_en_gb__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment_locale_en_gb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment_locale_en_gb__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__TaskItem_TaskItem__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var LSNew = (function () {
    function LSNew(platform, images, modalCtrl, events, loc, http, user) {
        var _this = this;
        this.platform = platform;
        this.images = images;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.loc = loc;
        this.http = http;
        this.user = user;
        this.platform.ready().then(function () {
            _this.siteUrl = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */];
            events.subscribe('user:loaded', function () {
                _this.loadTasks();
            });
            events.subscribe('task:towork', function () {
                console.log('<LSNew> task:towork');
                _this.loadTasks();
            });
            events.subscribe('task:doneTask', function (item) {
                console.log('<LSNew> task:doneTask', item);
                _this.loadTasks();
            });
            _this.loadTasks();
        });
    }
    //    ionViewDidLoad(){
    //         let self = this;
    //         // this.slider.onTransitionEnd = function(swiper){
    //         //     if(swiper.swipeDirection == 'next'){
    //         //        self.events.publish('slide:change',1);
    //         //     } else {
    //         //       // self.events.publish('menu:open');
    //         //     }
    //         // }
    //         this.slider.ionDrag.delay(100).subscribe(
    //            data=>{
    //                if(data.swipeDirection == "prev")
    //                     self.events.publish('menu:open');
    //                else if (data.swipeDirection == "next")
    //                     self.events.publish('slide:change',1);
    //             },
    //            error=>{console.log('ion drag error',error)},
    //            ()=>{console.log('ion complete ionDrag',)}
    //        )
    //    }
    LSNew.prototype.loadTasks = function () {
        var _this = this;
        return this.user.getUserProps()
            .then(function (status) {
            __WEBPACK_IMPORTED_MODULE_3_moment__["locale"](_this.loc.localization);
            if (status)
                return _this.getNewTasks();
            return { _body: JSON.stringify({ d: { results: [] } }) };
        })
            .then(function (tasks) {
            _this.items = (JSON.parse(tasks._body)).d.results;
            _this.items.map(function (item, i, arr) {
                item.StartDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.StartDate).format("dd, DD MMMM");
                item.TaskDueDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.TaskDueDate).format("dd, DD MMMM");
                return item;
            });
        })
            .catch(function (error) {
            console.log('<LSNew> Fail loading ', error);
            _this.items = [];
        });
    };
    LSNew.prototype.getNewTasks = function (loadNew) {
        var lastId = this.items && loadNew ? this.items[this.items.length - 1].ID : false;
        var listGet = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/items?" + (loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID=' + lastId + '&' : '') + "$select=sysIDItem,ContentTypeId,AssignetToEmail,StateID,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '" + this.user.getEmail() + "') and (OData__Status eq 'Not Started')&$orderby=TaskDueDate%20asc&$top=1000";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["h" /* retryCount */]).toPromise();
    };
    LSNew.prototype.itemTapped = function (event, item) {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_9__TaskItem_TaskItem__["a" /* TaskItem */], {
            item: item
        });
        modal.present();
    };
    LSNew.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        console.log('do infinite scroll');
        this.getNewTasks(true)
            .then(function (tasks) {
            var newItems = (JSON.parse(tasks._body)).d.results;
            newItems.map(function (item, i, arr) {
                item.StartDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.StartDate).format("dd, DD MMMM");
                item.TaskDueDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.TaskDueDate).format("dd, DD MMMM");
                _this.items.push(item);
            });
            infiniteScroll.complete();
        });
    };
    LSNew.prototype.doRefresh = function (refresher) {
        this.events.publish('task:checked');
        this.loadTasks()
            .then(function () {
            refresher.complete();
        });
    };
    return LSNew;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], LSNew.prototype, "slider", void 0);
LSNew = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'LSNew',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSNew/LSNew.html"*/'\n<ion-content >\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content>\n    </ion-refresher-content>\n  </ion-refresher>\n  <!-- <ion-slides #mySlider>\n    <ion-slide>\n      <ion-scroll> -->\n        <ion-list >\n          <!--(swipe)="swiped($event)"-->\n          <button ion-item  *ngFor="let item of items" (click)="itemTapped($event, item)">\n            <ion-avatar item-left>\n              <img src="{{images.getImage(item.TaskAuthore.EMail || \'undefined\')}}" >\n            </ion-avatar>\n            <div>\n              <h2>{{item.Title}}</h2>\n              <div class="description" >\n                <div class="descriptontext">{{item.TaskDueDate_view}}</div>\n              </div>\n            </div>\n            <div item-right>\n              <ion-icon name="pricetag"></ion-icon>\n              <div class="showId" >ID #{{item.sysIDItem}}</div>\n            </div>\n          </button>\n          <h1 ion-item *ngIf="items && items.length == 0">{{loc.dic.mobile.Empty }}</h1>\n          <h1 ion-item *ngIf="!items">{{loc.dic.mobile.Downloading}}</h1>\n        </ion-list>\n        <!-- <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n          <ion-infinite-scroll-content\n            loadingText="Loading more data...">\n          </ion-infinite-scroll-content>\n        </ion-infinite-scroll> -->\n      <!-- </ion-scroll>\n    </ion-slide>\n  </ion-slides> -->\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSNew/LSNew.html"*/
    }),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__utils_images__["a" /* Images */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_11__utils_localization__["a" /* Localization */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_10__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_11__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_8__utils_user__["a" /* User */]])
], LSNew);

//# sourceMappingURL=LSNew.js.map

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_retry__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_retry___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_retry__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_timeout__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_timeout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_timeout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__consts__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var User = (function () {
    function User(http) {
        this.http = http;
        this.email = 'e@e';
        this.locale = 'ru';
        this.user = {};
        this.user.Title = 'Bob';
        this.itemPropsLoaded = Promise.resolve();
    }
    User.prototype.getProps = function () {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_5__consts__["k" /* siteUrl */] + "/_api/Web/CurrentUser";
        var localeGet = __WEBPACK_IMPORTED_MODULE_5__consts__["k" /* siteUrl */] + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties/UserProfileProperties";
        //authorization for OnPremise 'username:password' to base64
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return Promise.all([this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_5__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_5__consts__["h" /* retryCount */]).toPromise(), this.http.get(localeGet, options).timeout(__WEBPACK_IMPORTED_MODULE_5__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_5__consts__["h" /* retryCount */]).toPromise()])
            .then(function (res) {
            _this.user = res[0].json().d;
            _this.email = _this.user.Email;
            _this.Id = _this.user.Id;
            res[1].json().d.UserProfileProperties.results.some(function (item) {
                if (item.Key == ('SPS-MUILanguages')) {
                    _this.locale = item.Value.substring(item.Value.indexOf('-') + 1, item.Value.length).toLowerCase();
                    return true;
                }
            });
            return _this.user;
        })
            .catch(function (error) {
            console.error('<User> Loading Props error!', error);
            throw new Object(error);
        });
    };
    User.prototype.init = function () {
        return this.itemPropsLoaded = this.getProps();
    };
    User.prototype.getUserProps = function () {
        return this.itemPropsLoaded;
    };
    User.prototype.getId = function () {
        return this.Id;
    };
    User.prototype.getEmail = function () {
        return this.email === 'e@e' ? '' : this.email;
    };
    User.prototype.getUserName = function () {
        return this.user.Title;
    };
    return User;
}());
User = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]])
], User);

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoTab; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var InfoTab = (function () {
    function InfoTab(navCtrl, navParams, events, loc, selectedItem) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.loc = loc;
        this.selectedItem = selectedItem;
        this.id = selectedItem.getId();
        this.listGUID = selectedItem.getListGUID();
        this.Except = {
            'FileLeafRef': true,
            'Title': true,
            'FolderChildCount': true,
            'ItemChildCount': true,
            'TaxCatchAll': true,
            'TaxCatchAllLabel': true,
            '_dlc_DocIdPersistId': true,
            '_dlc_DocIdUrl': true,
            '_dlc_DocId': true,
            'LSiIdeaMetaCategory_0': true,
            'OrderType_0': true,
            'IntDocType_0': true,
            'Source_0': true,
            'RequestType_0': true,
            'ContractType_0': true,
            'AgreementRoute_1': true
        };
        Promise.all([selectedItem.getItemFileds(), selectedItem.getItemProps()])
            .then(function (res) { return _this.getItemProps(res[0], res[1]); });
    }
    InfoTab.prototype.ionViewDidLoad = function () {
        // let self = this;
        //     this.slider.ionDrag.delay(100).subscribe(
        //        data=>{
        //            if(data.swipeDirection == "prev")
        //                 self.events.publish('itemsmenu:open');
        //            else if (data.swipeDirection == "next")
        //                 self.events.publish('itemslide:change',1);
        //         },
        //        error=>{console.log('ion drag error',error)},
        //        ()=>{console.log('ion complete ionDrag',)}
        //    )
    };
    InfoTab.prototype.getItemProps = function (ItemFields, itemProps) {
        var _this = this;
        this.itemKeys = ItemFields.filter(function (key, i, arr) {
            if (itemProps[key.StaticName] && !key.StaticName.includes('_') && !key.Group.toLowerCase().includes('hidden') && !_this.Except[key.StaticName] && !_this.Except[key.Title])
                return key;
        });
        this.itemProps = itemProps;
    };
    return InfoTab;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], InfoTab.prototype, "slider", void 0);
InfoTab = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'infotab',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/InfoTab/InfoTab.html"*/'<ion-content margin-bottom style="z-index: -1">\n    <ion-slides #mySlider>\n        <ion-slide>\n            <ion-scroll>\n                <ion-list  no-lines margin-bottom style="z-index: -1">\n                    <ion-item *ngFor="let key of itemKeys" >\n                        <div margin-right>\n                        <h2>{{key.Title}}</h2>\n                        <h3>{{itemProps[key.StaticName]}}</h3>\n                        </div>\n                    </ion-item>\n                    <ion-item *ngIf="itemKeys && itemKeys.length == 0">\n                    <h2>{{loc.dic.mobile.Empty}}</h2>\n                    </ion-item>\n                    <ion-item *ngIf="!itemKeys">\n                    <h2>{{loc.dic.mobile.Downloading}}</h2>\n                    </ion-item>\n                </ion-list>\n            </ion-scroll>\n        </ion-slide>\n  </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/InfoTab/InfoTab.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_3__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */]])
], InfoTab);

//# sourceMappingURL=InfoTab.js.map

/***/ }),

/***/ 337:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Documents; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_localization__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_loader__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_mime_types__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_mime_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_mime_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_transliteration_crh__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_transliteration_crh___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_transliteration_crh__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_opener__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_transfer__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_device__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_file_path__ = __webpack_require__(339);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};













var Documents = (function () {
    function Documents(navCtrl, navParams, filePath, loaderctrl, device, events, loc, selectedItem, toastCtrl, transfer, file, fileOpener) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.filePath = filePath;
        this.loaderctrl = loaderctrl;
        this.device = device;
        this.events = events;
        this.loc = loc;
        this.selectedItem = selectedItem;
        this.toastCtrl = toastCtrl;
        this.transfer = transfer;
        this.file = file;
        this.fileOpener = fileOpener;
        try {
            this.fileTransfer = this.transfer.create();
        }
        catch (e) {
            console.error('<Documents> FileTransfer create error:', e);
        }
        ;
        selectedItem.getItemDocs().then(function (docs) { return _this.getDocuments(docs); });
    }
    Documents.prototype.ionViewDidLoad = function () {
        // let self = this;
        //   this.slider.ionSlideDrag.delay(consts.swipeDelay).subscribe(
        //      data=>{
        //          if(data.swipeDirection == "prev")
        //               self.events.publish('itemslide:change',0);
        //          else if (data.swipeDirection == "next")
        //               self.events.publish('itemslide:change',2);
        //       },
        //      error=>{console.log('ion drag error',error)},
        //      ()=>{console.log('ion complete ionDrag',)}
        //  )
    };
    Documents.prototype.getDocuments = function (docs) {
        this.Docs = docs.map(function (item, i, arr) {
            item.TimeCreated = (new Date(item.TimeCreated)).toLocaleString();
            item.icon = item.Name.substring(item.Name.lastIndexOf('.') + 1, item.Name.length);
            return item;
        });
    };
    Documents.prototype.docClicked = function (doc) {
        var _this = this;
        var nativeURL = (cordova.file.documentsDirectory || cordova.file.externalDataDirectory || cordova.file.cacheDirectory);
        this.loaderctrl.presentLoading();
        doc.localName = this.getLocalName(doc.Name);
        this.file.checkFile(nativeURL, doc.localName).then(function (data) { _this.opendDocs(nativeURL + doc.localName, doc.localName); }, function (error) { _this.downloadDoc(nativeURL, doc); });
    };
    Documents.prototype.downloadDoc = function (nativeURL, doc) {
        var _this = this;
        var url = __WEBPACK_IMPORTED_MODULE_3__utils_consts__["k" /* siteUrl */] + "/_layouts/15/download.aspx?" + (doc.UniqueId ? ('UniqueId=' + doc.UniqueId) : ('SourceUrl=' + encodeURI(doc.ServerRelativeUrl)));
        this.fileTransfer && this.fileTransfer.download(url, nativeURL + doc.localName, true, { headers: { 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) } })
            .then(function (data) {
            _this.opendDocs(data.nativeURL, doc.localName);
        })
            .catch(function (err) {
            console.log('<Documents> file transfer error', err);
            _this.loaderctrl.stopLoading();
            _this.showToast('Can`t download or save this file');
        });
    };
    Documents.prototype.opendDocs = function (nativeURL, docName) {
        var _this = this;
        (this.device.platform == "Android" ? this.filePath.resolveNativePath(nativeURL) : Promise.resolve(''))
            .then(function (filePath) {
            return _this.fileOpener.open(decodeURIComponent(nativeURL), (__WEBPACK_IMPORTED_MODULE_6_mime_types__["lookup"](decodeURIComponent(docName)) || 'application/msword'));
        })
            .then(function (data) { _this.loaderctrl.stopLoading(); })
            .catch(function (err) {
            _this.loaderctrl.stopLoading();
            console.log('<Documents> cant open file:', nativeURL);
            _this.showToast('Can`t open this file');
        });
    };
    Documents.prototype.getLocalName = function (name) {
        var newName = __WEBPACK_IMPORTED_MODULE_7_transliteration_crh__["crh"].fromCyrillic(name.toLowerCase().replace(/ы/g, 'u').replace(/ї/g, 'i').replace(/я/g, 'ya').replace(/ч/g, 'ch').replace(/ь/g, '').replace(/ъ/g, '').replace(/ш/g, 'sch').replace(/щ/g, 'sch').replace(/ю/g, 'u').replace(/є/g, 'e'));
        newName = newName.toLowerCase().replace(/ /g, '_');
        return decodeURI(newName);
    };
    Documents.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: (typeof message == 'string') ? message : message.toString().substring(0, (message.toString().indexOf('&#x') || message.toString().length)),
            position: 'bottom',
            showCloseButton: true,
            duration: 9000
        });
        toast.present();
    };
    return Documents;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], Documents.prototype, "slider", void 0);
Documents = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'documents',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/Documents/Documents.html"*/'<ion-content style="z-index: -1">\n    <ion-slides #mySlider>\n        <ion-slide>\n            <ion-scroll>\n                    <ion-list  no-lines style="z-index: -1">\n                        <ion-item (click)="docClicked(document)" *ngFor="let document of Docs" >\n                            <div item-left>\n                            <div margin-right class="file-icon file-icon-lg " [attr.data-type]="document.icon"></div>\n                            </div>\n                            <h2>{{document.Name}}</h2>\n                            <p>{{loc.dic.Created}}: {{document.TimeCreated}}</p>\n                        </ion-item>\n                        <ion-item *ngIf="Docs && Docs.length == 0">\n                        <h2>{{loc.dic.mobile.Empty}}</h2>\n                        </ion-item>\n                        <ion-item *ngIf="!Docs">\n                        <h2>{{loc.dic.mobile.Downloading}}</h2>\n                        </ion-item>\n                    </ion-list>\n                </ion-scroll>\n        </ion-slide>\n    </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/Documents/Documents.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__utils_loader__["a" /* Loader */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__utils_localization__["a" /* Localization */])),
    __param(7, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_file_path__["a" /* FilePath */],
        __WEBPACK_IMPORTED_MODULE_5__utils_loader__["a" /* Loader */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_device__["a" /* Device */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_4__utils_localization__["a" /* Localization */],
        __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_transfer__["a" /* Transfer */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__["a" /* File */],
        __WEBPACK_IMPORTED_MODULE_9__ionic_native_file_opener__["a" /* FileOpener */]])
], Documents);

//# sourceMappingURL=Documents.js.map

/***/ }),

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return History; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_arraySort__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




// import * as consts from '../../../../../utils/consts';

var History = (function () {
    function History(navCtrl, navParams, events, loc, selectedItem) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.loc = loc;
        this.selectedItem = selectedItem;
        selectedItem.getItemHistory()
            .then(function (history) { return _this.getHistory(history); });
    }
    History.prototype.ionViewDidLoad = function () {
        // let self = this;
        //   this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
        //      data=>{
        //          if(data.swipeDirection == "prev")
        //               self.events.publish('itemslide:change',1);
        //          else if (data.swipeDirection == "next")
        //               self.events.publish('itemslide:change',3);
        //       },
        //      error=>{console.log('ion drag error',error)},
        //      ()=>{console.log('ion complete ionDrag',)}
        //  )
    };
    History.prototype.getHistory = function (history) {
        this.history = history[0] || {};
        if (this.history && this.history.propertyIsEnumerable('TaskHistory')) {
            this.taskHistory = JSON.parse(this.history.TaskHistory).map(function (task) {
                task.EvanteDate = task.EvanteDate.substring(0, 10).split('.').reverse().join('-') + task.EvanteDate.substring(10, task.EvanteDate.length);
                return task;
            });
        }
    };
    return History;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], History.prototype, "slider", void 0);
History = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'history',
        providers: [__WEBPACK_IMPORTED_MODULE_3__utils_arraySort__["a" /* ArraySortPipe */]],template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/History/History.html"*/'<ion-content style="z-index: -1">\n    <ion-slides #mySlider>\n        <ion-slide>\n            <ion-scroll>\n                <ion-list  no-lines style="z-index: -1">\n                    <ion-item class="task" *ngFor="let task of taskHistory | arraySort:\'-EvanteDate\'" >\n                        <!--<div item-left><div class="marker"></div></div>-->\n                        <h3>\n                            <div class="marker"></div>\n                            <span>{{task.Event}}</span> <span>{{task.TaskTitle}}</span> {{loc.dic.Alert38}}\n                            <span class="user">{{task.NameExecutor}}</span> {{loc.dic.Alert39}} <span class="user">{{task.NameAuthore}}</span>\n                            <span> {{loc.dic.Alert40}} </span>\n                            <span>{{task.DueDate}}</span>\n                        </h3>\n                        <p>{{task.EvanteDate}}</p>\n                    </ion-item>\n                    <ion-item *ngIf="history && !taskHistory">\n                    <h2>{{loc.dic.mobile.Empty}}</h2>\n                    </ion-item>\n                    <ion-item *ngIf="!history">\n                    <h2>{{loc.dic.mobile.Downloading}}</h2>\n                    </ion-item>\n                </ion-list>\n            </ion-scroll>\n        </ion-slide>\n  </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/History/History.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_4__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */]])
], History);

//# sourceMappingURL=History.js.map

/***/ }),

/***/ 341:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Route; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_localization__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_locale_uk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_locale_uk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment_locale_uk__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




// import * as consts from '../../../../../utils/consts';


var Route = (function () {
    function Route(navCtrl, navParams, events, loc, selectedItem) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.loc = loc;
        this.selectedItem = selectedItem;
        __WEBPACK_IMPORTED_MODULE_4_moment__["locale"](this.loc.localization);
        selectedItem.getItemRoutes()
            .then(function (routes) { return _this.getRoutes(routes); });
    }
    Route.prototype.ionViewDidLoad = function () {
        // let self = this;
        //   this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
        //      data=>{
        //          if(data.swipeDirection == "prev")
        //               self.events.publish('itemslide:change',2);
        //       },
        //      error=>{console.log('ion drag error',error)},
        //      ()=>{console.log('ion complete ionDrag')}
        //  )
    };
    Route.prototype.getRoutes = function (routes) {
        var _this = this;
        this.routesList = routes.map(function (item) {
            item.StartDate = item.StartDate ? __WEBPACK_IMPORTED_MODULE_4_moment__(item.StartDate).format("DD.MM.YYYY [" + _this.loc.dic.Alert42 + "] HH:mm") : null;
            item.EndDate = item.EndDate ? __WEBPACK_IMPORTED_MODULE_4_moment__(item.EndDate).format("DD.MM.YYYY [" + _this.loc.dic.Alert42 + "] HH:mm") : null;
            return item;
        });
    };
    return Route;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], Route.prototype, "slider", void 0);
Route = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'route',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/Route/Route.html"*/'<ion-content style="z-index: -1">\n    <ion-slides #mySlider>\n        <ion-slide>\n            <ion-scroll>\n                <ion-list style="z-index: -1">\n                    <ion-item *ngFor="let route of routesList" class="route_item" [attr.started]="route.StateStatus == \'InProgress\' ? true : false" >\n                        <div>\n                            <div class="state_id">{{route.StateNumber}}</div>\n                            <div class="state_name" [attr.done]="route.StateStatus == \'Completed\' ? true : false" [innerHTML]="route.StateName"></div> \n                        </div>\n                        <div>\n                            <ion-icon name="ios-contacts-outline"></ion-icon>\n                             <div class="left" >{{loc.dic.HistoryTaskExecutor}}:</div>\n                            <div class="right" >{{route.ExecutorType == \'DocAuthore\'? loc.dic.PermAuthorDoc : (route.StateExecutore.results ? route.StateExecutore.results[0].Title : loc.dic.TypeExecute1)}}</div>\n                        </div>\n                        <div>\n                            <ion-icon name="ios-timer-outline"></ion-icon>\n                            <div class="left" >{{loc.dic.HistoryTaskDuet}}:</div>\n                            <div class="right">{{route.StateEstimate}} {{route.StateEstimate == 1? loc.dic.DayPod1: (route.StateEstimate > 4? loc.dic.DayPod3 : loc.dic.DayPod2 ) }}</div>\n                        </div>\n                        <div *ngIf="route.StartDate">\n                            <ion-icon name="play"></ion-icon>\n                            <div class="left" >{{loc.dic.HistoryTaskStart}}:</div>\n                            <div class="right" >{{route.StartDate}}</div>\n                        </div>\n                        <div *ngIf="route.EndDate">\n                            <ion-icon name="square"></ion-icon>\n                            <div class="left" >{{loc.dic.TaskStatus3}}:</div>\n                            <div class="right" >{{route.EndDate}}</div>\n                        </div>\n                    </ion-item>\n                    <ion-item *ngIf="routesList && routesList.length == 0">\n                    <h2>{{loc.dic.mobile.Empty}}</h2>\n                    </ion-item>\n                    <ion-item *ngIf="!routesList">\n                    <h2>{{loc.dic.mobile.Downloading}}</h2>\n                    </ion-item>\n                </ion-list>\n            </ion-scroll>\n         </ion-slide>\n    </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Item/Tabs/Route/Route.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_3__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_2__utils_selecteditem__["a" /* SelectedItem */]])
], Route);

//# sourceMappingURL=Route.js.map

/***/ }),

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LSActive; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var LSActive = (function () {
    function LSActive(navCtrl, modalCtrl, events, loc, images, user, http) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.loc = loc;
        this.images = images;
        this.user = user;
        this.http = http;
        this.siteUrl = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */];
        events.subscribe('task:towork', function () {
            console.log('<LSActive> task:towork');
            _this.loadTasks();
        });
        events.subscribe('task:doneTask', function (item) {
            console.log('<LSActive> task:doneTask', item);
            _this.loadTasks();
        });
        events.subscribe('user:loaded', function () {
            _this.loadTasks();
        });
        this.loadTasks();
    }
    // ionViewDidLoad(){
    //     let self = this;
    //     this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
    //          data=>{
    //              if(data.swipeDirection == "prev")
    //                   self.events.publish('slide:change',0);
    //               else
    //                   self.events.publish('slide:change',2);
    //           },
    //          error=>{console.log('ion drag error',error)}
    //     );
    // }
    LSActive.prototype.loadTasks = function () {
        var _this = this;
        return this.user.getUserProps()
            .then(function () {
            __WEBPACK_IMPORTED_MODULE_3_moment__["locale"](_this.loc.localization);
            return _this.getActiveTasks();
        })
            .then(function (tasks) {
            _this.items = (JSON.parse(tasks._body)).d.results;
            _this.items.map(function (item, i, arr) {
                item.StartDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.StartDate).format("dd, DD MMMM");
                item.TaskDueDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.TaskDueDate).format("dd, DD MMMM");
                return item;
            });
        })
            .catch(function (error) {
            console.error('<LSActive> Fail loading ', error);
            _this.items = [];
        });
    };
    LSActive.prototype.getActiveTasks = function (loadNew) {
        var lastId = this.items && loadNew ? this.items[this.items.length - 1].ID : false;
        var listGet = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/items?" + (loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID=' + lastId + '&' : '') + "$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,StateID,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '" + this.user.getEmail() + "') and (OData__Status eq 'In Progress')&$orderby=TaskDueDate%20asc&$top=1000";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers, withCredentials: true });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["h" /* retryCount */]).toPromise();
    };
    LSActive.prototype.itemTapped = function (event, item) {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__["a" /* TaskItem */], {
            item: item
        });
        modal.present();
    };
    LSActive.prototype.doRefresh = function (refresher) {
        this.events.publish('task:checked');
        this.loadTasks()
            .then(function () {
            refresher.complete();
        });
    };
    return LSActive;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], LSActive.prototype, "slider", void 0);
LSActive = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'LSActive',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSActive/LSActive.html"*/'\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content>\n    </ion-refresher-content>\n  </ion-refresher>\n  <!-- <ion-slides #mySlider>\n    <ion-slide>\n      <ion-scroll> -->\n        <ion-list >\n          <button ion-item  *ngFor="let item of items" (click)="itemTapped($event, item)">\n            <ion-avatar item-left>\n              <img src="{{images.getImage(item.TaskAuthore.EMail || \'undefined\')}}" >\n              <!-- {{siteUrl}}//_layouts/15/userphoto.aspx?size=S&accountname={{item.TaskAuthore.EMail || \'undefined\'}}"> -->\n            </ion-avatar>\n            <ion-label>\n              <h2>{{item.Title}}</h2>\n              <div class="description" >\n                <div class="descriptontext">{{item.TaskDueDate_view}}</div>\n              </div>\n            </ion-label>\n            <div item-right>\n              <ion-icon name="pricetag"></ion-icon>\n              <div class="showId" >ID #{{item.sysIDItem}}</div>\n            </div>\n          </button>\n          <h1 ion-item *ngIf="items && items.length == 0">{{loc.dic.mobile.Empty}}</h1>\n          <h1 ion-item *ngIf="!items">{{loc.dic.mobile.Downloading}}</h1>\n        </ion-list>\n      <!-- </ion-scroll>\n    </ion-slide>\n  </ion-slides> -->\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSActive/LSActive.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
], LSActive);

//# sourceMappingURL=LSActive.js.map

/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LSLate; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var LSLate = (function () {
    function LSLate(navCtrl, modalCtrl, images, events, loc, http, user) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.images = images;
        this.events = events;
        this.loc = loc;
        this.http = http;
        this.user = user;
        this.siteUrl = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */];
        events.subscribe('task:doneTask', function () {
            _this.loadTasks();
        });
        events.subscribe('task:towork', function () {
            _this.loadTasks();
        });
        events.subscribe('user:loaded', function () {
            _this.loadTasks();
        });
        this.loadTasks();
    }
    //    ionViewDidLoad(){
    //         let self = this;
    //         this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
    //            data=>{
    //                if(data.swipeDirection == "prev")
    //                     self.events.publish('slide:change',1);
    //                 else
    //                     self.events.publish('slide:change',3);
    //             },
    //            error=>{console.log('ion drag error',error)}
    //         )
    //    }
    LSLate.prototype.loadTasks = function () {
        var _this = this;
        return this.user.getUserProps()
            .then(function () {
            __WEBPACK_IMPORTED_MODULE_3_moment__["locale"](_this.loc.localization);
            return _this.getNewTasks();
        })
            .then(function (tasks) {
            _this.items = (JSON.parse(tasks._body)).d.results;
            _this.items.map(function (item, i, arr) {
                item.StartDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.StartDate).format("dd, DD MMMM");
                item.TaskDueDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__(item.TaskDueDate).format("dd, DD MMMM");
                return item;
            });
        })
            .catch(function (error) {
            console.error('<LSLate> Fail loading ', error);
            _this.items = [];
        });
    };
    LSLate.prototype.getNewTasks = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,StateID,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '" + this.user.getEmail() + "') and (OData__Status ne 'Done') and (TaskDueDate lt datetime'" + (new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())).toJSON() + "')&$orderby=TaskDueDate%20asc&$top=1000";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers, withCredentials: true });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["h" /* retryCount */]).toPromise();
    };
    LSLate.prototype.itemTapped = function (event, item) {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__["a" /* TaskItem */], {
            item: item
        });
        modal.present();
    };
    LSLate.prototype.doRefresh = function (refresher) {
        this.events.publish('task:checked');
        this.loadTasks()
            .then(function () {
            refresher.complete();
        });
    };
    return LSLate;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], LSLate.prototype, "slider", void 0);
LSLate = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'LSLate',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSLate/LSLate.html"*/'\n<ion-content >\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content>\n    </ion-refresher-content>\n  </ion-refresher>\n  <!-- <ion-slides #mySlider>\n    <ion-slide>\n      <ion-scroll> -->\n        <ion-list #Image>\n            <button ion-item  *ngFor="let item of items" (click)="itemTapped($event, item)">\n                <ion-avatar item-left>\n                  <img #Image{{item.Id}} src="{{images.getImage(item.TaskAuthore.EMail)}}">\n                  <!-- {{siteUrl}}//_layouts/15/userphoto.aspx?size=S&accountname={{item.TaskAuthore.EMail}}"> -->\n                </ion-avatar>\n                <ion-label>\n                  <h2>{{item.Title}}</h2>\n                  <div class="description" >\n                    <div class="descriptontext">{{item.TaskDueDate_view}}</div>\n                  </div>\n                  </ion-label>\n                  <div item-right>\n                    <ion-icon name="pricetag"></ion-icon>\n                    <div class="showId" >ID #{{item.sysIDItem}}</div>\n                  </div>\n            </button>\n            <h1 ion-item *ngIf="items && items.length == 0">{{loc.dic.mobile.Empty}}</h1>\n            <h1 ion-item *ngIf="!items">{{loc.dic.mobile.Downloading}}</h1>\n        </ion-list>\n      <!-- </ion-scroll>\n    </ion-slide>\n  </ion-slides> -->\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSLate/LSLate.html"*/
    }),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */]])
], LSLate);

//# sourceMappingURL=LSLate.js.map

/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LSEnded; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_locale_uk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_locale_uk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var LSEnded = (function () {
    function LSEnded(navCtrl, modalCtrl, events, loc, images, http, user) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.loc = loc;
        this.images = images;
        this.http = http;
        this.user = user;
        this.siteUrl = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */];
        events.subscribe('task:doneTask', function () {
            _this.loadTasks();
        });
        events.subscribe('user:loaded', function () {
            _this.loadTasks();
        });
        this.loadTasks();
    }
    //  ionViewDidLoad(){
    //     let self = this;
    //     this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
    //       data=>{
    //              if(data.swipeDirection == "prev")
    //                   self.events.publish('slide:change',2);
    //           },
    //       error=>{console.log('ion drag error',error)}
    //     )
    //  }
    LSEnded.prototype.loadTasks = function () {
        var _this = this;
        return this.user.getUserProps()
            .then(function () {
            __WEBPACK_IMPORTED_MODULE_3_moment__["locale"](_this.loc.localization);
            return _this.getEndedTasks();
        })
            .then(function (tasks) {
            tasks = tasks.json().d.results; //JSON.parse(tasks._body)
            _this.items = [];
            tasks.map(function (task, i) {
                task = JSON.parse(task.UserHistory || '[]');
                task.filter(function (item, i, arr) {
                    if (!!item.TaskType) {
                        item.StartDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](item.StartDate.split(' ')[0].split('.').reverse().join('-')).format("dd, DD MMMM");
                        item.DueDate_view = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](item.DueDate.split('.').reverse().join('-')).format("dd, DD MMMM");
                        _this.items.push(item);
                    }
                });
            });
            _this.items.sort(function (a, b) {
                var a1 = a.DueDateSort, b1 = b.DueDateSort;
                if (a1 === b1)
                    return -1;
                return a1 > b1 ? 1 : -1;
            });
        })
            .catch(function (error) {
            console.error('<LSEnded> Fail loading ', error);
            _this.items = [];
        });
    };
    LSEnded.prototype.getEndedTasks = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_5__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSUsersHistory')/items?$select=UserName/EMail,CountTasks,UserHistory&$expand=UserName/EMail&$filter=UserName/EMail eq '" + this.user.getEmail() + "'";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers, withCredentials: true });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_5__utils_consts__["h" /* retryCount */]).toPromise();
    };
    LSEnded.prototype.itemTapped = function (event, item) {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__TaskItem_TaskItem__["a" /* TaskItem */], {
            item: item
        });
        modal.present();
    };
    LSEnded.prototype.doRefresh = function (refresher) {
        this.events.publish('task:checked');
        this.loadTasks()
            .then(function () {
            refresher.complete();
        });
    };
    return LSEnded;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('mySlider'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
], LSEnded.prototype, "slider", void 0);
LSEnded = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'LSEnded',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSEnded/LSEnded.html"*/'\n<ion-content >\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n      <ion-refresher-content>\n      </ion-refresher-content>\n    </ion-refresher>\n  <!-- <ion-slides #mySlider>\n    <ion-slide>\n      <ion-scroll> -->\n        <ion-list>\n            <button ion-item  *ngFor="let item of items" (click)="itemTapped($event, item)">\n            <ion-avatar item-left>\n              <img src="{{images.getImage(item.AthoreEmail)}}">\n              <!-- {{siteUrl}}//_layouts/15/userphoto.aspx?size=S&accountname={{item.AthoreEmail}}"> -->\n            </ion-avatar>\n            <ion-label>\n              <h2>{{item.TaskTitle}}</h2>\n              <div class="description" >\n                  <div class="descriptontext">{{item.DueDate_view}}</div>\n              </div>\n            </ion-label>\n            <div item-right>\n              <ion-icon name="pricetag"></ion-icon>\n              <div class="showId">ID #{{item.sysIDItem || item.ItemId}}</div>\n            </div>\n          </button>\n          <h1 ion-item *ngIf="items && items.length == 0">{{loc.dic.mobile.Empty}}</h1>\n          <h1 ion-item *ngIf="!items">{{loc.dic.mobile.Downloading}}</h1>\n        </ion-list>\n      <!-- </ion-scroll>\n    </ion-slide>\n  </ion-slides> -->\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/Tabs/LSEnded/LSEnded.html"*/
    }),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_9__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_8__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_6__utils_user__["a" /* User */]])
], LSEnded);

//# sourceMappingURL=LSEnded.js.map

/***/ }),

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Contracts; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Item_Item__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var Contracts = (function () {
    function Contracts(navCtrl, navParams, zone, menuCtrl, http, loc, selectedItem) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.zone = zone;
        this.menuCtrl = menuCtrl;
        this.http = http;
        this.loc = loc;
        this.selectedItem = selectedItem;
        this.listTitle = navParams.data.title;
        this.guid = navParams.data.guid;
        this.getItems();
    }
    Contracts.prototype.itemTapped = function (event, item) {
        this.selectedItem.set(item, this.guid);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__Item_Item__["a" /* Item */], {
            item: item,
            listGUID: this.guid
        });
    };
    Contracts.prototype.getItems = function (loadNew, search) {
        var _this = this;
        var lastId = this.items && loadNew ? this.items[this.items.length - 1].Id : false;
        var listGet = __WEBPACK_IMPORTED_MODULE_4__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists('" + this.guid + "')/Items?" + (lastId ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID=' + lastId + '&' : '') + "$select=Id,Title,ContentTypeId,Created,Modified&$top=25&$orderby=Id desc" + (search ? "&$filter=substringof('" + search + "',Title)" : '');
        var headers = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_3__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_4__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_4__utils_consts__["h" /* retryCount */]).toPromise()
            .then(function (res) {
            if (!loadNew)
                _this.items = [];
            res.json().d.results.map(function (item) {
                item.Created = item.Created ? (new Date(item.Created).toLocaleString()) : null;
                item.Modified = item.Modified ? (new Date(item.Modified).toLocaleString()) : null;
                item.Title && _this.items.push(item);
            });
        })
            .catch(function (error) {
            console.error("<Contracts> Error in getItems from " + _this.listTitle, error);
            _this.items = [];
        });
    };
    Contracts.prototype.searchItem = function (event) {
        this.getItems(false, event.target.value);
    };
    Contracts.prototype.doInfinite = function (infiniteScroll) {
        this.getItems(true)
            .then(function () {
            infiniteScroll.complete();
        });
    };
    Contracts.prototype.swiped = function (event) {
        if (event.direction == 4)
            this.menuCtrl.open();
    };
    return Contracts;
}());
Contracts = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'contracts',template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Contracts.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{listTitle}}</ion-title>\n    <!--<ion-buttons end>\n      <button ion-button icon-only color="royal">\n        <ion-icon name="ios-add-circle-outline"></ion-icon>\n      </button>\n    </ion-buttons>-->\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content (swipe)="swiped($event)">\n   <ion-searchbar (ionInput)="searchItem($event)"></ion-searchbar>\n  <ion-list >\n    <button ion-item  *ngFor="let item of items" (click)="itemTapped($event, item)">\n      <h2>#{{item.Id}}  {{item.Title}}</h2>\n      <div class="description" >\n       <div class="descriptontext">{{loc.dic.Created}}:</div><span class="creator" >{{item.Created}}</span>\n       <br>\n       <div class="descriptontext">{{loc.dic.PermRoleEdit}}: </div><span class="creator" >{{item.Modified}}</span>\n     </div>\n    </button>\n    <h1 ion-item *ngIf="items && items.length == 0">{{loc.dic.mobile.Empty}}</h1>\n    <h1 ion-item *ngIf="!items">{{loc.dic.mobile.Downloading}}</h1>\n  </ion-list>\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n    <ion-infinite-scroll-content\n      loadingText="{{loc.dic.mobile.Downloading}}">\n      <!--loadingSpinner="bubbles"-->\n    </ion-infinite-scroll-content>\n  </ion-infinite-scroll>\n</ion-content>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/Contracts/Contracts.html"*/
    }),
    __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* Http */])), __param(5, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */])), __param(6, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__utils_selecteditem__["a" /* SelectedItem */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* NgZone */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* MenuController */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_6__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_5__utils_selecteditem__["a" /* SelectedItem */]])
], Contracts);

//# sourceMappingURL=Contracts.js.map

/***/ }),

/***/ 346:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);



Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_19" /* enableProdMode */])();
Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_MyTasks_MyTasks__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_Contracts_Contracts__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_Contracts_Item_Item__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_Contracts_Item_Tabs_InfoTab_InfoTab__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_Contracts_Item_Tabs_Documents_Documents__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_Contracts_Item_Tabs_History_History__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_Contracts_Item_Tabs_Route_Route__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils_auth__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_access__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__utils_loader__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__utils_arraySort__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__utils_localization__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_MyTasks_Tabs_LSNew_LSNew__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_MyTasks_Tabs_LSActive_LSActive__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_MyTasks_Tabs_LSLate_LSLate__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_MyTasks_Tabs_LSEnded_LSEnded__ = __webpack_require__(344);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_MyTasks_TaskItem_TaskItem__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_network__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_native_storage__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_device__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ionic_native_transfer__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_file_opener__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_file_path__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_badge__ = __webpack_require__(218);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

























//import { SuperTabsModule } from 'ionic2-super-tabs';










var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["K" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_MyTasks_MyTasks__["a" /* MyTasks */],
            __WEBPACK_IMPORTED_MODULE_6__pages_Contracts_Contracts__["a" /* Contracts */],
            __WEBPACK_IMPORTED_MODULE_7__pages_Contracts_Item_Item__["a" /* Item */], __WEBPACK_IMPORTED_MODULE_24__pages_MyTasks_TaskItem_TaskItem__["a" /* TaskItem */],
            __WEBPACK_IMPORTED_MODULE_8__pages_Contracts_Item_Tabs_InfoTab_InfoTab__["a" /* InfoTab */], __WEBPACK_IMPORTED_MODULE_9__pages_Contracts_Item_Tabs_Documents_Documents__["a" /* Documents */], __WEBPACK_IMPORTED_MODULE_10__pages_Contracts_Item_Tabs_History_History__["a" /* History */], __WEBPACK_IMPORTED_MODULE_11__pages_Contracts_Item_Tabs_Route_Route__["a" /* Route */], __WEBPACK_IMPORTED_MODULE_17__utils_arraySort__["a" /* ArraySortPipe */],
            __WEBPACK_IMPORTED_MODULE_20__pages_MyTasks_Tabs_LSNew_LSNew__["a" /* LSNew */], __WEBPACK_IMPORTED_MODULE_21__pages_MyTasks_Tabs_LSActive_LSActive__["a" /* LSActive */], __WEBPACK_IMPORTED_MODULE_22__pages_MyTasks_Tabs_LSLate_LSLate__["a" /* LSLate */], __WEBPACK_IMPORTED_MODULE_23__pages_MyTasks_Tabs_LSEnded_LSEnded__["a" /* LSEnded */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                links: []
            })
            //,SuperTabsModule.forRoot()
            // ,TranslateModule.forRoot()
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_MyTasks_MyTasks__["a" /* MyTasks */],
            __WEBPACK_IMPORTED_MODULE_6__pages_Contracts_Contracts__["a" /* Contracts */],
            __WEBPACK_IMPORTED_MODULE_7__pages_Contracts_Item_Item__["a" /* Item */], __WEBPACK_IMPORTED_MODULE_24__pages_MyTasks_TaskItem_TaskItem__["a" /* TaskItem */],
            __WEBPACK_IMPORTED_MODULE_8__pages_Contracts_Item_Tabs_InfoTab_InfoTab__["a" /* InfoTab */], __WEBPACK_IMPORTED_MODULE_9__pages_Contracts_Item_Tabs_Documents_Documents__["a" /* Documents */], __WEBPACK_IMPORTED_MODULE_10__pages_Contracts_Item_Tabs_History_History__["a" /* History */], __WEBPACK_IMPORTED_MODULE_11__pages_Contracts_Item_Tabs_Route_Route__["a" /* Route */],
            __WEBPACK_IMPORTED_MODULE_20__pages_MyTasks_Tabs_LSNew_LSNew__["a" /* LSNew */], __WEBPACK_IMPORTED_MODULE_21__pages_MyTasks_Tabs_LSActive_LSActive__["a" /* LSActive */], __WEBPACK_IMPORTED_MODULE_22__pages_MyTasks_Tabs_LSLate_LSLate__["a" /* LSLate */], __WEBPACK_IMPORTED_MODULE_23__pages_MyTasks_Tabs_LSEnded_LSEnded__["a" /* LSEnded */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_32__ionic_native_file_opener__["a" /* FileOpener */], __WEBPACK_IMPORTED_MODULE_33__ionic_native_file_path__["a" /* FilePath */], __WEBPACK_IMPORTED_MODULE_34__ionic_native_badge__["a" /* Badge */],
            __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_27__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_28__ionic_native_native_storage__["a" /* NativeStorage */], __WEBPACK_IMPORTED_MODULE_29__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_30__ionic_native_device__["a" /* Device */], __WEBPACK_IMPORTED_MODULE_31__ionic_native_transfer__["a" /* Transfer */],
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
            { provide: __WEBPACK_IMPORTED_MODULE_12__utils_auth__["a" /* Auth */], useClass: __WEBPACK_IMPORTED_MODULE_12__utils_auth__["a" /* Auth */] },
            { provide: __WEBPACK_IMPORTED_MODULE_13__utils_access__["a" /* Access */], useClass: __WEBPACK_IMPORTED_MODULE_13__utils_access__["a" /* Access */] },
            { provide: __WEBPACK_IMPORTED_MODULE_14__utils_selecteditem__["a" /* SelectedItem */], useClass: __WEBPACK_IMPORTED_MODULE_14__utils_selecteditem__["a" /* SelectedItem */] },
            { provide: __WEBPACK_IMPORTED_MODULE_18__utils_user__["a" /* User */], useClass: __WEBPACK_IMPORTED_MODULE_18__utils_user__["a" /* User */] },
            { provide: __WEBPACK_IMPORTED_MODULE_15__utils_loader__["a" /* Loader */], useClass: __WEBPACK_IMPORTED_MODULE_15__utils_loader__["a" /* Loader */] },
            { provide: __WEBPACK_IMPORTED_MODULE_16__utils_images__["a" /* Images */], useClass: __WEBPACK_IMPORTED_MODULE_16__utils_images__["a" /* Images */] },
            { provide: __WEBPACK_IMPORTED_MODULE_19__utils_localization__["a" /* Localization */], useClass: __WEBPACK_IMPORTED_MODULE_19__utils_localization__["a" /* Localization */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Images; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_transfer__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_native_storage__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__consts__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Images = (function () {
    function Images(file, nativeStorage, transfer) {
        this.file = file;
        this.nativeStorage = nativeStorage;
        this.transfer = transfer;
        this.images = {};
    }
    Images.prototype._init = function () {
        var _this = this;
        try {
            this.fileTransfer = this.transfer.create();
        }
        catch (e) {
            console.log('<Iamges> FileTransfer _initing error', e);
        }
        ;
        this.imagesLoad().then(function (res) {
            var first = null; //res[Object.keys(res)[0]];
            if (first) {
                _this.file.checkFile(first.substring(0, first.lastIndexOf("/") + 1), first.substring(first.lastIndexOf("/") + 1, first.length)).then(function (data) { _this.images = res; }, function (error) { _this.images = {}; });
            }
            else {
                _this.images = {};
            }
        });
    };
    Images.prototype.imagesLoad = function () {
        return this.nativeStorage.getItem('images').catch(function (err) { console.log('<Images> imagesLoad error', err); return {}; });
    };
    Images.prototype.saveImage = function () {
        return this.nativeStorage.setItem('images', this.images).catch(function (err) { console.log('<Images> error saving images', err); });
    };
    Images.prototype.loadImage = function (key) {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_4__consts__["k" /* siteUrl */] + "/_layouts/15/userphoto.aspx?size=S&accountname=" + key + "&mobile=0";
        var endpointURI = cordova && cordova.file && cordova.file.dataDirectory ? cordova.file.dataDirectory : 'file:///android_asset/';
        try {
            this.images[key] = !window.localStorage.getItem('OnPremise') ? (cordova.file.applicationDirectory + 'www/assets/icon/favicon.ico') : listGet;
        }
        catch (e) {
            console.error('<Images> loadImage: this.image[key]= ', e);
            this.images[key] = listGet;
        }
        this.fileTransfer && this.fileTransfer.download(listGet, endpointURI + key + '.png', true, { headers: { 'Content-Type': "image/png", 'Accept': "image/webp", 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) } })
            .then(function (data) {
            console.log('<Image> file transfer success', data);
            _this.images[key] = data.nativeURL;
            _this.saveImage();
        })
            .catch(function (err) {
            console.error('<Images> file transfer error', err);
        });
        return this.images[key];
    };
    Images.prototype.getImage = function (key) {
        return this.images[key] || this.loadImage(key);
    };
    return Images;
}());
Images = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["A" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_native_storage__["a" /* NativeStorage */], __WEBPACK_IMPORTED_MODULE_0__ionic_native_transfer__["a" /* Transfer */]])
], Images);

//# sourceMappingURL=images.js.map

/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectedItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var SelectedItem = (function () {
    function SelectedItem(http, loc) {
        this.http = http;
        this.loc = loc;
        this.item = { title: 'none', Id: '000' };
        this.listGUID = "000";
    }
    SelectedItem.prototype.getProps = function () {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_2__consts__["k" /* siteUrl */] + "/_api/Web/Lists('" + this.listGUID + "')/Items(" + this.item.Id + ")/FieldValuesAsText";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_2__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_2__consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            _this.item = res.json().d;
            return _this.item;
        })
            .catch(function (error) {
            console.error('<SelectedItem> Loading Props error!', error);
            return { 'Error': _this.loc.dic.Alert100 };
        });
    };
    SelectedItem.prototype.getContentTypeFields = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_2__consts__["k" /* siteUrl */] + "/_api/Web/Lists('" + this.listGUID + "')/ContentTypes('" + this.item.ContentTypeId + "')/Fields?$select=StaticName,Group,Title&$filter$filter=(Hidden nq 'true') and (Group nq 'Hidden')";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_2__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_2__consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            return res.json().d.results;
        })
            .catch(function (error) {
            console.error('<SelectedItem> Loading ContentTypeFields error!', error);
            return [];
        });
    };
    SelectedItem.prototype.getDocs = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_2__consts__["k" /* siteUrl */] + "/_api/Web/Lists('" + this.listGUID + "')/Items(" + this.item.Id + ")/Folder/Files";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_2__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_2__consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            return res.json().d.results;
        })
            .catch(function (error) {
            console.log('<SelectedItem> Loading Docs error!', error);
            return [];
        });
    };
    SelectedItem.prototype.getHistory = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_2__consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '" + this.item.Id + "') and (Title eq '" + this.listGUID + "') and (ItemName eq 'Task')";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_2__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_2__consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            return res.json().d.results;
        })
            .catch(function (error) {
            console.error('<SelectedItem> Loading History error!', error);
            return [];
        });
    };
    SelectedItem.prototype.getRoutes = function () {
        var listGet = __WEBPACK_IMPORTED_MODULE_2__consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('RoutesForCurentDoc')/items?$select=sysListId,sysTypeId,ID,ManualState,StatePermission,EditState,StateNumber,StateName,StartDate,StateType,EndDate,ExecutJobTitle,StateEstimate,StateExecutore,StateStatus,ExecutorType,StateExecutore/Title,StateExecutore/Name&$expand=StateExecutore/Title,StateExecutore/Name&$filter=(sysListId eq '" + this.listGUID + "') and (sysIDItem eq '" + this.item.Id + "')&$orderby=StateNumber asc";
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_2__consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_2__consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            return res.json().d.results;
        })
            .catch(function (error) {
            console.error('<SelectedItem> Loading Routes error!', error);
            return [];
        });
    };
    SelectedItem.prototype.set = function (item, listGUID) {
        this.item = item;
        this.listGUID = listGUID;
        this.itemFieldsLoaded = this.getContentTypeFields();
        this.itemPropsLoaded = this.getProps();
        this.itemDocsLoaded = this.getDocs();
        this.itemHistoryLoaded = this.getHistory();
        this.itemRoutesLoaded = this.getRoutes();
    };
    SelectedItem.prototype.getItemFileds = function () {
        return this.itemFieldsLoaded;
    };
    SelectedItem.prototype.getItemProps = function () {
        return this.itemPropsLoaded;
    };
    SelectedItem.prototype.getItemDocs = function () {
        return this.itemDocsLoaded;
    };
    SelectedItem.prototype.getItemHistory = function () {
        return this.itemHistoryLoaded;
    };
    SelectedItem.prototype.getItemRoutes = function () {
        return this.itemRoutesLoaded;
    };
    SelectedItem.prototype.getId = function () {
        return this.item.Id;
    };
    SelectedItem.prototype.getListGUID = function () {
        return this.listGUID;
    };
    return SelectedItem;
}());
SelectedItem = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__localization__["a" /* Localization */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_3__localization__["a" /* Localization */]])
], SelectedItem);

//# sourceMappingURL=selecteditem.js.map

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_localization__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_auth__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_access__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils_loader__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_MyTasks_MyTasks__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_Contracts_Contracts__ = __webpack_require__(345);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
 //NgZone,















var MyApp = (function () {
    // private zone:NgZone,
    function MyApp(platform, alertCtrl, loc, loaderctrl, images, toastCtrl, auth, access, http, events, user, statusBar, nativeStorage, splashScreen, network) {
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.loc = loc;
        this.loaderctrl = loaderctrl;
        this.images = images;
        this.toastCtrl = toastCtrl;
        this.auth = auth;
        this.access = access;
        this.http = http;
        this.events = events;
        this.user = user;
        this.statusBar = statusBar;
        this.nativeStorage = nativeStorage;
        this.splashScreen = splashScreen;
        this.network = network;
        // secureStorage: SecureStorage;
        this.siteUrl = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */];
        this.onPremise = window.localStorage.getItem('OnPremise');
        this.rootPage = __WEBPACK_IMPORTED_MODULE_14__pages_MyTasks_MyTasks__["a" /* MyTasks */];
        this.initializeApp();
        this.errorCounter = 0;
        this.pages = [
            { title: this.loc.dic.MyRoom, icon: "home", component: __WEBPACK_IMPORTED_MODULE_14__pages_MyTasks_MyTasks__["a" /* MyTasks */], listGUID: 'none' }
        ];
    }
    MyApp.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.platform.exitApp(); return false; }, 100);
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.loaderctrl.presentLoading();
            _this.statusBar.styleDefault();
            // this.statusBar.overlaysWebView(false);
            _this.splashScreen.hide();
            _this.ionViewDidEnter();
            _this.checkNetwork().then(function () {
                _this.loaderctrl.stopLoading();
                if (!(_this.auth.checkAuthAlready())) {
                    _this.showPrompt();
                }
                else if (!(_this.auth.checkAuthActive(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */]))) {
                    _this.reLogin();
                }
                else {
                    _this.startApp();
                }
            })
                .catch(function (reason) {
                _this.showToast(reason);
            });
        });
    };
    MyApp.prototype.checkNetwork = function () {
        if (this.network.type != 'none') {
            return Promise.resolve();
        }
        return Promise.reject('There is no internet connection');
    };
    MyApp.prototype.startApp = function () {
        var _this = this;
        this.loaderctrl.presentLoading();
        return Promise.all([this.getLists(), this.user.init()])
            .then(function (res) {
            _this.events.publish('user:loaded');
            _this.access._init();
            _this.images._init();
            _this.pages.length = 0;
            _this.pages.push({ title: _this.loc.dic.MyRoom, icon: "home", component: __WEBPACK_IMPORTED_MODULE_14__pages_MyTasks_MyTasks__["a" /* MyTasks */], listGUID: 'none' });
            res[0].map(function (list, i, mass) {
                if (!list)
                    return;
                list.then(function (item) {
                    _this.pages.push({ title: item.Title, icon: "folder", component: __WEBPACK_IMPORTED_MODULE_15__pages_Contracts_Contracts__["a" /* Contracts */], listGUID: item.Id });
                });
            });
            _this.loaderctrl.stopLoading();
        })
            .catch(function (error) {
            console.log("<App> Error in making Burger Menu", error);
            if (_this.errorCounter <= 1 && error.status == '403') {
                _this.errorCounter++;
                _this.loaderctrl.stopLoading();
                _this.reLogin();
            }
            else if ((_this.errorCounter <= 1 && error.status == '401')
                || (_this.errorCounter > 1 && error.status == '403')
                || (error.status == '404')
                || (error.status == '406')) {
                _this.errorCounter++;
                _this.showPrompt();
                _this.loaderctrl.stopLoading();
                _this.showToast('Check your credentials');
            }
            else {
                _this.errorCounter = 0;
                _this.loaderctrl.stopLoading();
                _this.showPrompt();
                _this.showToast('Can`t load entrance data');
            }
        });
    };
    MyApp.prototype.getLogin = function (userName, userPassword, url) {
        var _this = this;
        this.loaderctrl.presentLoading();
        url && __WEBPACK_IMPORTED_MODULE_7__utils_consts__["j" /* setUrl */](url);
        window.localStorage.setItem('tempuserEmail', userName);
        this.auth.init(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */], { username: userName, password: userPassword }); //'oleg.dub@lsdocs30.onmicrosoft.com'  'Ljrevtyn0'
        return this.auth.getAuth().then(function (result) {
            _this.loaderctrl.stopLoading();
            url && window.localStorage.setItem('siteUrl', url);
            return _this.startApp();
        }, function (errorMessage) {
            _this.showPrompt();
            _this.showToast(errorMessage.message ? errorMessage.message : errorMessage);
            _this.loaderctrl.stopLoading();
            return true;
        });
    };
    MyApp.prototype.reLogin = function (manual) {
        var _this = this;
        //this.secureStorage = new SecureStorage();
        // Promise.all([this.secureStorage.get('username'),this.secureStorage.get('password')])
        this.loaderctrl.presentLoading();
        if (manual) {
            this.nativeStorage.remove('user');
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */].substring(0, __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */].indexOf('/sites/')));
        }
        (manual ? Promise.reject('relogin user') : this.nativeStorage.getItem('user'))
            .then(function (user) {
            _this.loaderctrl.stopLoading();
            _this.getLogin(user.username, user.password);
        }, function (error) {
            !manual && console.error('#Native storage: ', error);
            _this.loaderctrl.stopLoading();
            !manual && _this.showToast("Can't load user credentials");
            _this.showPrompt();
        });
    };
    MyApp.prototype.getLists = function () {
        var _this = this;
        var url = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID";
        var headers = new __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_6__angular_http__["d" /* RequestOptions */]({ headers: headers, withCredentials: true });
        return this.http.get(url, options).timeout(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["l" /* timeoutDelay */] + 2000).toPromise() //.retry(consts.retryCount)
            .then(function (response) {
            return response.json().d.results.map(function (item) {
                return (item.ListGUID && !item.ListTitle) ? _this.getListProps(item.ListGUID) : null;
            });
        })
            .catch(function (error) {
            throw new Object(error);
        });
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.setRoot(page.component, { title: page.title, guid: page.listGUID });
    };
    MyApp.prototype.userTapped = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: this.loc.dic.mobile.ChangeUser + "?",
            message: this.loc.dic.mobile.ChangeUser + this.loc.dic.mobile.and + this.loc.dic.mobile.enterAnotherUser,
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: this.loc.dic.Cencel,
                    handler: function (data) {
                        prompt.dismiss();
                    }
                },
                {
                    text: this.loc.dic.Accept,
                    handler: function (data) {
                        _this.reLogin(true);
                    }
                }
            ]
        });
        prompt.present();
        prompt.onDidDismiss(function (event) { });
    };
    MyApp.prototype.showPrompt = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { return false; }, 100); // e.preventDefault();
        var prompt = this.alertCtrl.create({
            title: this.loc.dic.mobile.Login,
            message: this.loc.dic.mobile.EnterMessage,
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'Email',
                    type: 'text',
                    placeholder: 'Email',
                    value: window.localStorage.getItem('tempuserEmail') || this.user.getEmail() || ''
                },
                {
                    name: 'Password',
                    type: 'password',
                    placeholder: 'Password'
                },
                {
                    name: 'URL',
                    type: 'text',
                    label: 'URL',
                    value: __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] ? __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] : '',
                    placeholder: 'https://example.sharepoint.com/sites/exampleintranet'
                }
            ],
            buttons: [
                {
                    text: this.loc.dic.Accept,
                    handler: function (data) {
                        data.URL && _this.getLogin(data.Email, data.Password, data.URL.toLowerCase()).then(function (error) {
                            !error && _this.pages.map(function (page) {
                                page.component == _this.nav.getActive().component && _this.openPage(page);
                            }) && window.localStorage.removeItem('tempuserEmail');
                        });
                        !data.URL && _this.showToast("Fields should not be empty.") && _this.showPrompt();
                    }
                }
            ]
        });
        prompt.present();
        prompt.onDidDismiss(function (event) { });
    };
    MyApp.prototype.showToast = function (message) {
        this.toast = this.toastCtrl.create({
            message: (typeof message == 'string') ? message.substring(0, (message.indexOf('&#x') != -1 ? message.indexOf('&#x') : message.length)) : message.toString().substring(0, (message.toString().indexOf('&#x') != -1 ? message.toString().indexOf('&#x') : message.toString().length)),
            position: 'bottom',
            showCloseButton: true,
            duration: 9000
        });
        this.toast.present();
    };
    MyApp.prototype.getListProps = function (guid) {
        var listGet = __WEBPACK_IMPORTED_MODULE_7__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists(guid'" + guid + "')?$select=Title,Id,ItemCount";
        var headers = new __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_6__angular_http__["d" /* RequestOptions */]({ headers: headers }); //,withCredentials: true});
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_7__utils_consts__["h" /* retryCount */]).toPromise().then(function (res) { return res.json().d; });
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/app/app.html"*/'<ion-menu type="reveal" [content]="content">\n  <ion-header>\n    <ion-toolbar>\n   <ion-item (click)="userTapped()" class="userAvatart">\n      <ion-avatar item-left>\n         <img  #Myimg src="{{images.getImage(user.getEmail())}}">\n      </ion-avatar >\n      <ion-title>{{user.getUserName()}}</ion-title>\n   </ion-item>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content  class="menucontainer" >\n    <ion-list>\n      <button text-left ion-button full clear  menuClose  *ngFor="let p of (pages)" (click)="openPage(p)">\n        <ion-label color="light">\n           <ion-icon margin-right name="{{p.icon}}">\n          </ion-icon>{{p.title}}\n       </ion-label>\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/app/app.html"*/
    }),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_localization__["a" /* Localization */])),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_12__utils_loader__["a" /* Loader */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_13__utils_images__["a" /* Images */])),
    __param(7, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__utils_access__["a" /* Access */])), __param(8, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */])),
    __param(10, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_11__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_8__utils_localization__["a" /* Localization */],
        __WEBPACK_IMPORTED_MODULE_12__utils_loader__["a" /* Loader */], __WEBPACK_IMPORTED_MODULE_13__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_9__utils_auth__["a" /* Auth */], __WEBPACK_IMPORTED_MODULE_10__utils_access__["a" /* Access */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
        __WEBPACK_IMPORTED_MODULE_11__utils_user__["a" /* User */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__["a" /* NativeStorage */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__["a" /* Network */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 425:
/***/ (function(module, exports) {

module.exports = {"mobile":{"ChangeUser":"Сменить пользователя","and":" и ","Login":"Вход","enterAnotherUser":" войти в систему под другим пользователем.","anotherUser":"другой пользователь","EnterMessage":"Введите свой email и пароль для входа.","Wait":"Подождите...","Downloading":"Загрузка...","Empty":"Здесь пусто","OperationError":"Операция неуспешна. Произошла ошибка"},"MStep1":"Подразделения и пользователи","MStep2":"Настройка списков","MStep3":"Настройка отчетов","MStep4":"Настройка языка","MStep5":"Настройка модулей","MStep6":"Применить дизайн","MStep7":"Уведомления","MStep8":"Регистратор","MStep9":"Лицензии","Step1":"Шаг 1","Step2":"Шаг 2","Installation":"Установка","InstallInfo1":"Добро пожаловать в LS Docs!","InstallInfo2":"Мы пошагово пройдем процесс установки LS Docs. Нажмите кнопку Установить для старта...","Install":"Установить","InstallProgress":"Идет процесс установки...","InstallInfo3":"Не закрывайте эту страницу до конца процесса установки. Вы будете перенаправлены на страницу настроек по завершению процесса.","InstallInfo4":"Мы работаем над подготовкой LS Docs для вас:","InstallInfo5":"Настройка Менеджера Задач","InstallInfo6":"Вставьте URL пустой страницы, где вы хотите использовать Менеджер Задач как веб-часть","InstallInfo7":"Вставьте URL тут...","InstallInfo8":"Менеджер задач (My Tasks) является частью LS Docs, где каждый человек может управлять собственными задачами. Обычно, наши клиенты создают новую сайтовую коллекцию для системы управления документами и используют свою страницу по умолчанию 'Мои задачи' (например, 'https: // yourcompany.sharepoint.com/sites/documentcenter/home.aspx '). Вы можете изменить этот URL в будущем с помощью параметров LS Docs.","InstallInfo9":"Поздравляем!","InstallInfo10":"Вы йспешно завершили весь процесс установки. Сейчас вы можете перейти к настройке LS Docs.","InstallInfo11":"Завершить и перейти к Настройкам","LicensTitle":"Информация о лицензии","LSiteCollection":"Сайтовая коллекция","LTotalAmount":"Все лицензий","LRemainingLicenses":"Использовано лицензий","LDueDate":"Дата окончания","LActivelicenses":"Активные лицензии","LHelpRequest":"Задать вопрос","LUpdateLicens":"Обновить лицензию","TaskColorSettings":"Настройка цвета задач","AbsenceDaystart":"с","AbsenceDayend":"по","AutoRunRoute":"Автозапуск","DocTemplateOn":"Включить пустой шаблон в карточке","InstallSourse":"Установка компонентов","Reports":"Отчеты","MTitle":"Настройки приложения","SendTo":"Кому","CopyTo":"Копия","GetData":"Получить данные","ToRoute":"Отправить по маршруту","SendToRoute":"Отправлено по маршруту","ViewHistory":"Посмотреть историю","ToRoute1":"Отправить","ToRoute2":"по маршруту","AutoCloseTaskTitle":"Включить автоматическое закрытие задач по истечению срока","NotifField_AssignedTo":"Исполнитель","NotifField_ID":"Задача","NotifField_StartDate":"Дата начала","NotifField_TaskDueDate":"Срок","NotifField_TaskAuthore":"Автор задачи","NotifField_Authore":"Автор документа","NotifField_LinkToTask":"Ссылка на задачу","NotifField_TaskComment":"Комментарий","EditRoute":"Редактирование этапа","PermSettings":"Настройка разрешений","PermInState":"Во время этапа","PermEndState":"По завершению этапа","PermExecutor":"Исполнитель","PermExecutorDeputy":"Заместитель исполнителя","PermExecutorManager":"Руководитель исполнителя","PermExecutorAllManager":"Все руководители исполнителя по вертикали","PermAuthor":"Автор задачи","PermAuthorManager":"Руководитель автора задачи","PermAuthorAllManager":"Все руководители автора задачи по вертикали","PermExecutorAddTask":"Исполнители подзадач","PermUserAndGroup":"Пользователь или группа","PermRoleView":"Просмотр","PermRoleEdit":"Редактирование","PermRoleViewInfo":"Пользователи могут просматривать карточку и скачивать документы.","PermRoleEditInfo":"Пользователи могут изменять и удалять карточку и документы в ней, а также добавлять новые документы.","PermGetRoute":"Наследовать права маршрута","PermAuthorDoc":"Автор документа","PermAuthorManagerDoc":"Руководитель автора документа","PermAuthorAllManagerDoc":"Все руководители автора документа по вертикали","Del":"Удалить","NotificationSettings":"Настройка уведомлений","CreateFirstDep":"Создать первый уровень","CreateRoute":"Создать маршрут","RouteCreating":"Создание маршрута","CreateState":"Создать этап","AddResolution":"Добавить текст резолюции","GetCurentState":"Посмотреть статус","ViewPropertys":"Посмотреть свойства","EditePropertys":"Изменить свойства","RunInRoute":"Запуск по маршруту","RouteState":"Статус выполнения","StateTask":"Задача этапа","StateType":"Тип этапа","StateEstime":"Срок (дней)","MainMenu":"Главное меню","Filter":"Фильтр","StateStatus":"Состояние этапа","StateExecutor":"Исполнитель","Create":"Создать","RouteTaskName":"Формулировка задачи...","RouteStateNum":"Номер","RouteStateEstim":"Срок","UpdateStruct":"Обновить структуру","Refresh":"Обновить","SelectType":"Тип задачи","StateType1":"Подготовка","StateType2":"Согласование","StateType3":"Резолюция","StateType4":"Подписание","StateType5":"Выполнение","StateType6":"Регистрация","LSTaskGroupeButton1":"Согласовать","LSTaskGroupeButton2":"Отклонить","LSTaskGroupeButton3":"Подписать","Comitets":"Комитеты","History":"История","EventType1":"Назначена задача","EventType2":"Назначена подзадача","EventType3":"Делегирована задача","EventType4":"Завершена задача","EventType5":"Завершена подзадача","EventType6":"Остановлено выполнение маршрута","EventType7":"Принятие в работу","EventType8":"Отклонение задачи","TypeExecute1":"Пользователь или группа","TypeExecute2":"Автор документа","TypeExecute3":"Руководитель подразделения","TypeExecute4":"Руководитель автора","TypeExecute5":"Функциональная роль","Next":"Дальше","Alert1":"Для данного типа нет маршрута","Alert2":"Кому назначить...","Alert3":"Укажите заместителя...","Alert4":"Укажите должность...","Alert5":"Укажите сотрудника...","Alert6":"Укажите руководителя...","Alert7":"Необходимо заполнить поле","Alert8":"Значение должно быть больше нуля","Alert9":"Значение должно быть целым","Alert10":"Неверный формат даты","Alert11":"Тип этапа отличаеться от существующего типа на этом этапе","Alert12":"Выберите тип этапа","Alert13":"Дата не может быть меньше текущей","Alert14":"Введите комментарий ...","Alert15":"По Вашему запросу ничего не найдено ...","Alert16":"Удалить департамент?","Alert17":"Удалить пользователя?","Alert18":"Можно указать только одного пользователя","Alert19":"Выберите подразделение","Alert20":"Значение должно быть числом","Alert21":"Срок...","Alert22":"Укажите тему...","Alert23":"Выбор списков/библиотек для подключения решения","Alert24":"Выберите представление для установки","Alert25":"Выберите поле, определяющее тип документа (формата 'метаданные') и поле, определяющее условие. В следующем шаге Вы сможете построить маршруты для каждого типа документа и согласно условию","Alert26":"В этой библиотеке не найдено ни одного поля с форматом 'метаданные', поэтому создаваемый маршрут будет единственным. Если Вы хотите создавать разные маршруты для разных типов документов и задавать условия, тогда необходимо добавить в библиотеку поле типа документа с форматом 'метаданные' и повторить процесс настройки списков","Alert27":"Выберите хотя бы одно значение","Alert28":"Вы не наложили не одной резолюции","Alert29":"Введите текст резолюции...","Alert30":"Описаниие","Alert31":"В работу","Alert32":"Отклонить","Alert33":"Делегировать","Alert34":"Новая подзадача","Alert35":"Выполнить","Alert36":"Наложить резолюцию","Alert37":"Введите комментарий к выполнению задачи...","Alert38":"для","Alert39":"от","Alert40":"со сроком до","Alert41":"и с комментарием","Alert42":"в","Alert43":"Добавить","Alert44":"Нет задач","Alert45":"Тип задач","Alert46":"Тип документа","Alert47":"Мне","Alert48":"Моя группа","Alert49":"Мое подразделение","Alert50":"Другое","Alert51":"Я","Alert52":"По возрастанию","Alert53":"По убыванию","Alert54":"Выберите тип, относительного которого будет настраиваться маршрут","Alert55":"Поле типа","Alert56":"Поле условия","Alert57":"Назначена задача","Alert58":"Автоматически закрыта задача","Alert59":"Взята в работу задача","Alert60":"Завершена задача","Alert61":"Введите ссылку на отчет","Alert62":"Получено согласие по задаче","Alert63":"Вы действительно хотите удалить данный элемент?","Alert64":"телефон не указан","Alert65":"подразделение не указано","Alert66":"Получен отказ по задаче","Alert67":"делегировал задачу","Alert68":"Создана подзадача","Alert69":"Для завершения установки личного кабинета необходимо указать ссылку текущей страницы в настройках данной веб-части.","Alert70":"Поле 'Кому назначить' не заполнено корректно","Alert71":"Количество символов не должно привышать 255","Alert72":"Ваши изменения сохранены, но для их вступления в силу может потребоваться несколько минут. Не беспокойтесь, если не увидите их сразу же.","Alert73":"Языковые параметры были сохранены","Alert74":"Модуль  успешно создан","Alert75":"Модуль успешно обновлен","Alert76":"У Вас недостаточно прав на выполнение данных действий","Alert77":"Выберите поля карточки, которые будут отображатся в задаче для информации","Alert78":"Перед созданием необходимо создать модуль Контрагенты","Alert79":"из","Alert80":"Не выбрано","Aletr81":"Организационная структура","Aletr82":"Функциональная структура","Aletr83":"Создать новую группу должностей...","Aletr84":"Выберите юридическое лицо...","Aletr85":"База юридических лиц пустая, для продолжения работы необходимо указать хотя бы одно юридическое лицо в списке 'Юридические лица'...","Aletr86":"Выберите должность...","Alert87":"Элемент с таким названием уже существует","Alert88":"Доступность функциональной структуры","Alert89":"Вы действительно хотите отменить маршрут?","Alert90":"Укажите ссылку на страницу","Alert91":"Дата окончания не может быть меньше начала","Alert92":"Выберите один из вариантов...","Alert93":"Выберите права...","Alert94":"Создайте хотя бы один элемент","Alert95":"Выберите событие...","Alert96":"Используйте переменные для текста сообщения","Alert97":"Все не сохраненные данные будут потеряны","Alert98":"Нельзя делегировать задачу на себя","Alert99":"Нельзя выбирать больше 15 полей","Alert100":"Нет данных","Alert101":"У вас нет выбранной информации для отображения","Back":"Назад","NewRezolution":"Новая резолюция","MySettings":"Мои настройки","ChoiseTasksType":"выбор типа задач","EstimeKind1":"более 2 дней","EstimeKind2":"менее 2 дней","EstimeKind3":"срок исчерпан","LSWith":"из","ToolBarButtonRoute11":"Текущий","ToolBarButtonRoute12":"маршрут","ToolBarButtonRoute21":"Отправить","ToolBarButtonRoute22":"по маршруту","ToolBarButtonRoute31":"Создать","ToolBarButtonRoute32":"маршрут","Search":"Поиск","DayPod1":"день","DayPod2":"дня","DayPod3":"дней","All":"Все","DepManager":"Руководитель подразделения","RunRoute":"Запустить","StateStatus1":"Не начато","StateStatus2":"В работе","StateStatus3":"Завершено","TaskStatus1":"Не начато","TaskStatus2":"На исполнении","TaskStatus3":"Завершено","IsDelegate":"Делегировано","SelectedDoc":"Выбранный документ","Save":"Сохранить","Cencel":"Отменить","Sorting":"Сотрировка","Tasks":"Задачи","TaskResults1":"Выполнено","TaskResults2":"Делегировано","TaskResults3":"Авто завершение","TaskResults4":"Отменено","MyRoom":"Мои задачи","StateInMyRoom1":"Новые","StateInMyRoom2":"Активные","StateInMyRoom3":"Просроченные","StateInMyRoom4":"Завершенные","StateInMyRoom5":"Архив","AddTask":"Подзадачи","RelateDoc":"Связанный элемент","ByDoc":"По документу","ByTask":"По задачам","HistoryEvent":"Событие","HistoryEventDate":"Дата события","HistoryTaskName":"Название задачи","HistoryTaskAuthor":"Автор","HistoryTaskExecutor":"Назначено","HistoryTaskStart":"Дата начала","HistoryTaskDuet":"Срок","HistoryDocAuthor":"Автор документа","HistoryDocStateName":"Название этапа","DelList":"Удалить списки LSDocsOnline","TypeAddTask":"Дополнительная задача","AcceptChoise":"Применить выбор","PresentsStatus1":"Присутствует","PresentsStatus2":"Отсутствует","Presents":"Присутствие","UserDeputy":"Заместитель","AddUser":"Добавить пользователя","AddDep":"Добавить подразделение","EditDep":"Редактировать подразделение","DelDep":"Удалить подразделение","EditUser":"Редактировать сотрудника","DelUser":"Удалить сотрудника","DepUser":"Сотрудники подразделения","TypeResolutionToDo":"Выполнение резолюции","Manth0":"января","Manth1":"февраля","Manth2":"марта","Manth3":"апреля","Manth4":"мая","Manth5":"июня","Manth6":"июля","Manth7":"августа","Manth8":"сентября","Manth9":"октября","Manth10":"ноября","Manth11":"декабря","Day1":"Пн","Day2":"Вт","Day3":"Ср","Day4":"Чт","Day5":"Пт","Day6":"Сб","Day0":"Вс","licenseLetterExpired1":"Уважаемый администратор, лицензия на продукт LS Docs закончилась","licenseLetterExpired2":"Для продления просьба обратиться к команде поддержки продукта.","licenseLetterForAdmin1":"Пользователь","licenseLetterForAdmin2":"запустил документы по маршруту, не имея лицензии. Обратитесь в поддержку LS Docs для получения лицензии на этого пользователя.","licenseLetterForUser":"Вы пытаетесь отправить документ по маршруту. К сожалению, ваш аккаунт не был лицензирован. Ваши действия будут сохранены. Документы будут отправлены, когда аккаунт пройдет лицензирование. Обратитесь к администратору системы вашей компании.","LSMeetings":"Совещания","StateCommitteesInMyRoom1":"Новые","StateCommitteesInMyRoom2":"Приглашения","StateCommitteesInMyRoom3":"Назначеные","StateCommitteesInMyRoom4":"Завершенные","StateCommitteesInMyRoom5":"Архив","GeneralInformation":"Общая","Issues":"Вопросы","Documents":"Документы","Protoсol":"Протокол","TitleOfMeeting":"Название","AuthorOfMeeting":"Инициатор","Location":"Место проведения","Members":"Участники","Secretary":"Секретарь","TitmeOfMeeting":"Время проведения","DateOfMeeting":"Дата проведения","NewIssue":"Новый вопрос","Speakers":"Укажите спикеров","NewMeeting":"Новое совещание","Solution":"Решения","Task":"Задача","Note":"Заметки","WriteSolution":"Напишите принятое решение","WriteTitleTask":"Введите формулировку задачи","NotExistIssuesForMeeting":"Нет вопросов, для данного заседания","WriteSpeakers":"Укажите спикеров","WriteColleague":"Укажите сотрудника","DescriptionMeeting":"Описание","WriteSecretary":"Укажите секретаря","WriteMembers":"Укажите участников","WriteAuthor":"Укажите инициатора","WriteLocation":"Укажите место проведения","WriteDescription":"Укажите описание","WriteNote":"Напишите заметку","Approve":"Согласовать","Publish":"Опубликовать","Send":"Отправить","Download":"Скачать","TitleOfProtocol":"Протокол встречи","From":"от","TitleNewTask":"Новая задача","inArchive":"В Архив","NotExistMeetings":"Нет митингов","AppruveProtocol":"Согласовать протокол встречи","TitleStatusAppruveOfProtocol":"Статус согласования протокола","StatusMeetingNew":"Новые","StatusMeetingInvitation":"Приглашение","StatusMeetingAssigned":"Назначено","StatusMeetingEnded":"Завершено","StatusMeetingArchive":"Заархивировано","MeetingAssignedTo":"Назначить","DraftOfProtocol":"Черновик","SitesOfCommittees":"Сайты комитетов","HeadOfCommittees":"Глава комитета","SecretaryOfCommittees":"Секретарь комитета","EnterTheTitleOfCommittees":"Введите название комитета","EnterIdOfCommittees":"Введите название страницы на английском для url","NewSite":"Новый сайт","EditOfSite":"Редактирование сайта","SuggestedQuestions":"Предлагаемые вопросы","AcceptedQuestions":"Принятые вопросы","HeadPageOfCommittees":"Главная","Discussions":"Обсуждения","Favorites":"Избранное","Calendar":"Календарь","minute":"мин","EnaterNameOfHeadCommittee":"Введите имя главы комитета","EnaterNameOfSecretaryCommittee":"Введите имя секретаря комитета","Yes":"Да","No":"Нет","EnterNewIssue":"Введите текст нового вопроса","DocumnetTitle":"Документ","LinkTitle":"Ссылка","AddLinkToFavorite":"Добавление ссылки в Избранное","EnterTitleOfLink":"Введите название ссылки","EnterLink":"Введите адрес ссылки","Ok":"Ок","IssuesForMeeting":"Вопросы на заседания","Created":"Создано","AddDocToFavorite":"Добавление документов в Избранное","FilterFrom":"с","FilterTo":"по","Meeting":"Совещание","UploadNewImg":"Загрузите логотип комитета","DeleteCommittee":"Удалить сайт комитета?","DeleteMeeting":"Сохранить внесенные изменения?","ClickForCopy":"Щелкните, чтобы скопировать ссылку","LinkCopied":"Скопировано","tooltipFileNotFound":"Файл не найдено","DefaultLang":"Язык системы по умолчанию","AssignetMe":"Назначены мне","AssignedMyGroup":"Назначены моей группе","CustomLangValue":"Обновить структуру терминов","DefaultLangValue":"Получить значения по-умолчанию","ViewTaskLists":"Выбрать поля для отображения в задачах","DocInfoBlock":"Информация по документу","LSContracts":"Договоры","TitleOfContracts":"Название договора","Summ":"Сумма","LSContractCard":"Катрочка договора","Curence":"Валюта","SignedDate":"Дата подписания","Comments":"Комментарий","ContractNumber":"Номер","SubjectContract":"Предмет договора","Legality":"Срок действия","ContractType":"Тип договора","LSOrders":"Внутренние","Initiator":"Инициатор","RegDate":"Дата регистрации","RegNumber":"Регистрационный номер","Description":"Содержание","Grif":"Гриф","OrderType":"Тип документа","Subject":"Тема","LSOrderCard":"Карточка документа","LSMemo":"Служебные записки","MemoType":"Тип записки","LSMemoCard":"Карточка записки","LSIntDoc":"Входящие","Sender":"Отправитель","IntDocType":"Тип документа","SenderNumber":"Номер полученного документа","GetDocDate":"Дата полученного документа","Source":"Источник поступления","LSIntDocCard":"Карточка входящего","LSExtDoc":"Исходящие","Recipient":"Получатель","IntDocNumber":"Номер входящего документа","LSExtDocCard":"Карточка исходящего","LSOrganizations":"Контрагенты","OrganizationsTitle":"Название контрагента","INN":"ИНН","Adress":"Адрес","NewItem":"Новый элемент","Status":"Статус","Status_NotStarted":"Не начато","Status_InProgress":"В процессе","Status_Completed":"Завершено","Status_Denied":"Отклонено","EditView":"Изменить это представление","CreateView":"Создать представление","Accept":"Применить","Clean":"Очистить","FullScreen":"Полноэкранный","Binding":"Связывание","SendOnRoute_1":"Отправить","SendOnRoute_2":"по маршруту","Edit":"Изменить","Ribbon":"Лента","FirstSaveAndThenBind":"Сохраните этот елемент, после этого вам будут доступны функции связывания.","BindingFunctions":"Связь с элементами","BindingWithParent":"Связать с родительским элементом","ParentElement":"Родительский элемент","BindingWithChilds":"Связать с дочерними элементами","ChildElements":"Дочерние элементы","Bind":"Связать","SearchIn":"Поиск в: ","SearchByParameters":"Поиск по параметру: ","OpenProtocol":"Открыть протокол","Card":"Карточка","EventAll":"Все события","EventCreateTask":"Назначение задач","EventDoneTask":"Выполнение задач","EventAddTask":"События с подзадачами","EventDelegateTask":"Делегирование задач","EventAutoCloseTask":"Автозавершение задач","EventInWorkTask":"Принятие задач в работу","EventByComment":"События с комментариями","Close":"Закрыть","LSReject":"Отклонить маршрут","LSRejectRoute1":"Отклонить","LSRejectRoute2":"маршрут","LSDocDescript":"Свойства","LSDocChat":"Обсуждения","LSMobileRoute":"Маршрут","LSStartDate":"Начато","NewState":"Новый этап","ChengeSate":"Изменение этапа","ChengeSateYes":"Доступно","ChengeSateNo":"Не доступно","DescriptionSate":"Детали этапа","DelState":"Удалить этап","LSDocsLawFirmsFace":"Юридическое лицо","LSChildLink":"Дочерний элемент","LSParentLink":"Родительский элемент","NLinkMyTasks":"Мои задачи","NLinkShowMore":"Мой кабинет","NNoTasks":"задач нет","NAllTasks":"Все","NNotDoneTasks":"Невыполненные","Step3":"Шаг 3","AllModule":"Все модули","Reset":"Перезагрузить","Select":"Выбрать","Update":"Обновить","Modules":"Модули","ModulesDescript":"Выберите библиотеки, которые вы хотели бы установить в текущем семействе сайтов или обновить их после редактирования языковых пакетов","ModulesInfo":"В разделе Модули собраны библиотеки / списки с различной структурой и типами контента в системе. Модули ниже, доступны для автоматического создания и обновления.","DocumentTemplates":"Шаблоны документов","DocTempInfo":"У вас есть возможность создать отдельный шаблон для любого типа метаданных. Все созданные шаблоны будут добавлены в меню ленты и кнопку Создать на вкладке Документы. Пустой шаблон будет среди них, если вы будете активировать эту опцию.","Dashboard":"Мой кабинет","DashboardDescript":"Вставьте URL ведущую на отчет PowerBi ","DashboardInfo":"PowerBI собирает информацию об активности пользователей, использование веб-сайта или любой другой пользовательской информации. Когда вы будете вставить ссылку на PowerBI панели управления в этом разделе, мы будем показывать его в главном меню на странице Мои задачи. Вы можете изменить этот URL позже.","MyTasksUrl":"MyTasks URL","MyTasksUrlDescript":"Если вы хотите перенести или удалить персональный кабинет, то просто измените или удалите URL","MyTasksUrlInfo":"Не волнуйтесь, все данные будут сохранены, если вы перемещаете или удаляете кабинет","Yammer":"Yammer для LS Meetings","YammerDescript":"Enter Network information to use discussions in LS Meetings","YammerInfo":"Нынешняя версия работает только с Yammer","YammerNameNetwork":"Введите название Сети...","YammerIDNetwork":"Введите ID сети...","if":"если","Taskcolorinfo":"day(s) left before due date","TaskAutoCloseInfo":"Автоматическое завершение задачи будет назначать статус 'Автозавершение' для задач и подзадач после истечения срока выполнения. Это будет влиять на всю систему.","ListsSettings":"Настройки списков","RouteSettingsInfo1":"Выберите Отображение в которых будет применен LS Docs.","RouteSettingsInfo2":"Выберите метод построения маршрута (метаданные ИЛИ метаданные и условие)","RouteSettingsInfo3":"Детализируйте метод построения маршрута (метаданные ИЛИ метаданные и условие)","RecordType":"Тип документа","ConditionField":"Условие","RoutesSettings":"Настройки маршрута","InformationFields":"Информационные поля","GeneralSettings":"Общие настройки","EnableProtocol":"Вы хотите подключить составление Протокола согласования для этой библиотеки?","AboutEnableProtocol":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","AboutSelectedField":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","WhatFields":"Пожалуйста, выберете поля из библиотеки, которые вам необходимо включить в Протокол согласования.","EnableAddTasks":"Вы хотите включить информацию из под-задач в рамках данного процесса?","nameOfDocument":"Название документа","descriptionOfDocument":"Описание документа","authorOfDocument":"Автор документа","approveDate":"Согласовано","titleOfProtocolApprove":"Протокол согласования","FIO":"ФИО СОГЛАСУЮЩЕГО","DateAndTime":"ДАТА И ВРЕМЯ","StatusAppruve":"СТАТУС СОГЛАСОВАНИЯ","CommentsInPRotocol":"КОММЕНТАРИИ","NoticeSettingsTitle":"Уведомления","NoticeSettingsSign":"Вы можете выбрать как уведомлять вас о статусах Лицензии","NoticeSettignsFirst":"Уведомлять меня о сроке окончания действия подписки за 7,3,1 дней до этой даты","NoticeSettingsSecong":"Уведомлять меня о о достижении лимита пользователей (с 80% каждые 2%)","MStep10":"Протокол","Status_NotStart":"Не начато","NoInfo":"У вас нет выбранной информации для отображения","Info":"Этот раздел позволяет использовать Настраиваемый пользовательский интерфейс для текущей библиотеки вместо Sharepoint интерфейс. При активации одного или нескольких Отображений, вы запускаете этот интерфейс. Активация Контента Типа позволит вам применить Настраиваемый пользовательский интерфейс для выбранных типов.","Views":"Отображение","ContentTypes":"Контент тип","Alert102":"Вы использовали больше 80% лицензий","Languages":"Языки","DefaulLanguage":"Язык по умолчанию","DefaulLanguageInfo":"Язык по умолчанию для новых пользователей","ResetLang":"Перезагрузить Языковые настройки","ResetLangInfo":"Вернуть все Языковые настройки к их изначальным значениям","EditLang":"Редактировать Языковые настройки","EditLangInfo":"Настройки какого языка вы хотите редактировать?","SelectLang":"Выберите язык...","US":"Eng","RU":"Рус","UA":"Укр","AZ":"Az","licenseLetterExpired3":"","licenseLetterExpired4":"- Команда LS Docs","licenseLetterForAdmin3":"Обратитесь в поддержку LS Docs для получения лицензии на этого пользователя.","licenseLetterForUser1":"Вы пытаетесь отправить документ по маршруту. ","licenseLetterForUser2":"К сожалению, ваш аккаунт не был лицензирован. ","licenseLetterForUser3":"Ваши действия будут сохранены. Документы будут отправлены, когда аккаунт пройдет лицензирование. ","licenseLetterForUser4":"Обратитесь к администратору системы вашей компании.","licenseLetterTrial1":"Дорогой клиент,","licenseLetterTrial2":"Спасибо за регистрацию LS Docs Trial. Мы надеемся, что вы с удовольствием используете наш продукт.","licenseLetterTrial3":"К сожалению, ваша бесплатная пробная версия LS Docs заканчивается через","licenseLetterTrial4":"дней.","licenseLetterTrial5":"Мы хотели бы, чтобы вы стали нашим постоянным клиентом! ","licenseLetterTrial6":"Мы хотим напомнить, что когда срок действия пробной версии будет исчерпан, то система автоматически запретит использование нашего программное обеспечения. ","licenseLetterTrial7":"Если у вас есть какие-либо вопросы или пожелания, просто ответьте на это письмо, и мы обязательно свяжемся с вами. ","licenseLetterTrial8":"- Команда LS Docs","licenseLetterTrialExpired1":"Уважаемый клиент,","licenseLetterTrialExpired2":"Ваш бесплатный пробный период пользования LS Docs только что закончился :-(","licenseLetterTrialExpired3":"Мы хотели бы, чтобы вы оставались нашим клиентом, поэтому, пожалуйста, обратитесь к команде поддержки LS Docs, чтобы продлить пробную версию или купить продукт! ","licenseLetterTrialExpired4":" Если у вас есть какие-либо вопросы или пожелания, просто ответьте на это письмо, и мы обязательно свяжемся с вами.","licenseLetterTrialExpired5":"- Команда LS Docs","licenseLetterAboutPercentActive1":"Уважаемый клиент, ","licenseLetterAboutPercentActive2":"Благодарим Вас за использование LS Docs! Мы надеемся, что Вы с удовольствием пользуетесь нашим продуктом.","licenseLetterAboutPercentActive3":"Вы использовали ","licenseLetterAboutPercentActive4":"ваших лиценззий. Если вам нужно больше лицензий, просто напишите нам, и мы исправим это.","licenseLetterAboutPercentActive5":"Мы хотели бы, чтобы вы оставались нашим клиентом! ","licenseLetterAboutPercentActive6":"Если у вас есть какие-либо вопросы или пожелания, ","licenseLetterAboutPercentActive7":"просто ответьте на это письмо, и мы обязательно свяжемся с вами. ","licenseLetterAboutPercentActive8":"- Команда LS Docs","licenseLetterActive1":"Уважаемый клиент, ","licenseLetterActive2":"Благодарим Вас за использование LS Docs. Мы надеемся, что вам нравиться наш продукт.","licenseLetterActive3":"К сожалению, ваша подписка заканчивается через ","licenseLetterActive4":"дней (день).","licenseLetterActive5":"Мы хотим, чтобы вы оставались нашим клиентом, пожалуйста, обратиться к команде LS Docs, чтобы продлить подписку! ","licenseLetterActive6":"Если у вас есть какие-либо вопросы или пожелания, просто ответьте на это письмо,","licenseLetterActive7":"и мы обязательно свяжемся с вами.","licenseLetterActive8":"- Команда LS Docs","Step4":"Шаг 4","MeetingInstall":"LS Meetings","MeetingInstallDescript":"Установка LS Meetings ","MeetingInstallInfo":"Версия LS Meetings ","StatusLicense":"Статус","TitleForFieldsInProtocol":"Поля шапки Протокола","RouteSettingsInfo4":"Подключать Автозапуск по маршруту для данной библиотеки?","MStep11":"Обновления","LSOrgSettingsTitle":"Подразделения и пользователи","LSOrgStructTab":"Организационная структура","LSFunctStructTab":"Функциональная структура","LSNewfirstLEvel":"Создать первый уровень","LSOrgInfo":"Создайте необходимую вашей компании Организационную структуру","LSOrgDescript":"Описание","LSAddSubDep":"Добавить поддепартамент","LSDelSubDep":"Удалить поддепартамент","LSDepStaf":"Сотрудники департамента","LSPosition":"Должность","UserIsExist":"Такой пользователь уже существует","LSDepTitle":"Название департамента","AddDepAlert":"Укажите название подразделения","OrgAlert1":"Для удаления необходимо удалить дечерние подразделения","OrgAlert2":"Для удаления необходимо удалить пользователей данного подразделения","InfoToolTip":"Информация","Required":"Это поле является обязательным!","SystemUpdates":"Обновления системы","Version":"Версия","PreviousVersion":"Предыдущая версия","GetUpdateNow":"Получить обновление","InstallUpdateNow":"Установить обновление ","UpdateInstalled":"Обновление установлено","Complete":"завершить","LearnMore":"Узнать больше...","Alert103":"должность не указана","licenseStopWhenDo":"Данное действие нельзя выполнить, так как истек срок действия лицензии. Обратитесь к администратору системы для возобновления работы системы.","licenseExpiredWhenDo":"Данное действие нельзя выполнить, так как истек срок действия лицензии. Обратитесь к администратору системы для возобновления работы системы.","licenseWhenExpired":"Срок действия лицензии истек и функционирование системы ограничено. Обратитесь к администратору системы для возобновления полнофункциональной работы системы.","licenseWhenStop":"Срок действия лицензии истек и функционирование системы ограничено. Обратитесь к администратору системы для возобновления полнофункциональной работы системы.","TaskInfoDescript":"Description","DocFields":"Document's fields","JobGroupe":"Choose by Functional Role","FlowIsRuning":"Flow is runing","FlowIsReject":"Flow is rejecting","AutocomleteTasks":"Autocomlete tasks","AutocomleteSubTasks":"Autocomlete subtasks","LSJobGroupeStuff":"Job Groupe Stuff","LSFuncInfo":"Create a nescessary Function","LSFuncDescript":"Опис","FuncAlert1":"Необходимо добавить модуль Legal entity в разделе General Settings","FuncAletr2":"База юридических лиц пустая, для продолжения работы необходимо указать хотя бы одно юридическое лицо в списке 'Юридические лица'...","FuncAletr3":"Создать новую группу должностей...","FuncAletr4":"Для удаления необходимо удалить пользователей данной группы","FuncAletr5":"Используется недопустимый символ","NewJobGroupe":"Create the new group","DelJobGroupe":"Del Job Groupe?","licenseLetterActiveExpired1":"Уважаемый клиент,","licenseLetterActiveExpired2":"Благодарим Вас за использование LS Docs. Мы надеемся, что вам нравиться наш продукт.","licenseLetterActiveExpired3":"К несчастью, срок действия лицензии для LS Docs только что закончился :-(","licenseLetterActiveExpired4":"Мы хотели бы, чтобы вы оставались нашим клиентом, поэтому, пожалуйста, обратитесь к команде поддержки LS Docs, чтобы продлить пробную версию или купить продукт!","licenseLetterActiveExpired5":"Если у вас есть какие-либо вопросы или пожелания, просто ответьте на это письмо, и мы обязательно свяжемся с вами.","licenseLetterActiveExpired6":"- Команда LS Docs","DownloadLang":"Download language file","SelectFieldToRegDate":"Обрати поле для дати реєстрації","SelectFieldToRegNumber":"Обрати поле для реєстраційного номера","AddNewRecorderRule":"Add rule","RecorderRuleOther":"Other","RecorderRuleDefaulte":"Defaulte","RecorderRuleConstructor":"Constructor","ConstComponentName":"Name...","ChooseLib":"Choose librery...","ChooseField":"Choose current library fields...","ChooseComponent":"Choose component","CreateTime":"Create time","ModulName":"Module's name","RelateDocId":"ID","DocAuthore":"Document's author","RegDepartment":"Department","HavenotEmail":"You haven't mail. You have to contact your administrator","HavenotManager":"You haven't manager. You have to contact your administrator","Notinstructure":"You aren't in structure. You have to contact your administrator","InfoOnViewForm":"Для выполнения связывания перейдите в режим редактирования.","RecorderInfo1":"Регистрация при первом сохранении карточки документа","RecorderInfo2":"Правила присвоения номера","RecorderInfo3":"Пример","RecorderInfo4":"Первая буква из названия библиотеки документа","RecorderInfo5":"Время (текущее время, день, месяц, год)","RecorderInfo6":"Порядковй номер в рамках библиотеки","RecorderInfo7":"Первые","RecorderInfo8":"буквы из названия библиотеки документа","RecorderInfo9":"Подразделение (1 буква)","RecorderInfo10":"Фамилия (1 буква) и Имя (1 буква) автора"}

/***/ }),

/***/ 426:
/***/ (function(module, exports) {

module.exports = {"mobile":{"ChangeUser":"Change user","and":" and ","Login":"Login","enterAnotherUser":" login as another user.","anotherUser":"another user","EnterMessage":"Enter your email and password to login.","Wait":"Wait...","Downloading":"Downloading...","Empty":"Is empty","OperationError":"Operation failed. Error has occurred"},"MStep1":"User Directory","MStep2":"Lists","MStep3":"Reports","MStep4":"Edit Language Packs","MStep5":"Modules","MStep6":"Design","MStep7":"Notifications","MStep8":"Document registration tool","MStep9":"Licenses","Step1":"Step 1","Step2":"Step 2","Installation":"Installation","InstallInfo1":"Welcome to LS Docs!","InstallInfo2":"We will guide you step by step to easily install LS Docs. Click install button to start the process","Install":"Install","InstallProgress":"Installation is in progress...","InstallInfo3":"Do not close this page until Installation is completed. You will be guided to the settings in the end of this process.","InstallInfo4":"We are working to get LS Docs ready for you:","InstallInfo5":"Task Management Tool Setup","InstallInfo6":"Enter URL of a blank page where you would like to add Task Management as a web part","InstallInfo7":"Type URL here...","InstallInfo8":"Task Management Tool (My Tasks) is a part of LS Docs where each individual can manage own tasks.Typically, our customers create a new site collection for document management system and use its default page 'My Tasks' (e.g. 'https://yourcompany.sharepoint.com/sites/documentcenter/home.aspx'). You can change this URL in future through LS Docs settings. ","InstallInfo9":"Congratulations!","InstallInfo10":"You successfully completed the whole Installatioon process. Now you can configure LS Docs Settings.","InstallInfo11":"Finish and go to Settings","LicensTitle":"Information about licenses","LSiteCollection":"Site Collection","LTotalAmount":"Number of licenses","LRemainingLicenses":"Remaining Licenses","LDueDate":"License expiration date","LActivelicenses":"Active licenses","LHelpRequest":"Help Request","LUpdateLicens":"Update Licenses","InstallSourse":"Installation","AutoRunRoute":"Autorun","DocTemplateOn":"Do you want a blank template available when creating a new document if you added a template already? ","AbsenceDaystart":"from","AbsenceDayend":"to","Reports":"Reports","MTitle":"Settings","GetData":"Get Data","ToRoute":"Start Workflow","SendToRoute":"Workflow has been started","ViewHistory":"View History","ToRoute1":"Start","TaskColorSettings":"What font color do you want tasks to be if the due date is in ___ days?","NotificationSettings":"Notifications settings","SendTo":"To","CopyTo":"Copy","PermInState":"Stage in Progress","PermEndState":"Stage Completed","AutoCloseTaskTitle":"Enable auto-competion of the tasks after the due date","EventType1":"Assigned task","EventType2":"Assigned sub-task","EventType3":"Reassigned task","EventType4":"Completed task","EventType5":"Completed sub-task","EventType6":"Workflow execution stopped","EventType7":"Accept","EventType8":"Reject","PermExecutor":"Assignee","NotifField_AssignedTo":"Assignee","NotifField_ID":"Task","NotifField_StartDate":"Start date","NotifField_TaskDueDate":"Due date","NotifField_TaskAuthore":"Task author","NotifField_Authore":"Record author","NotifField_LinkToTask":"Task link","NotifField_TaskComment":"Comment","PermSettings":"Permitions settings","EditRoute":"Stage editing","PermExecutorDeputy":"Assignee's Deputy","PermExecutorManager":"Assignee's Manager","PermExecutorAllManager":"Assignee's Line Managers","PermAuthor":"Task author","PermAuthorManager":"Task Author's Manager ","PermAuthorAllManager":"Task Author's Line Managers","PermExecutorAddTask":"Subtask Assignee","PermUserAndGroup":"User or Group","PermRoleView":"View ","PermRoleEdit":"Edit","PermRoleViewInfo":"People can view and download documents.","PermRoleEditInfo":"People can edit, delete a record and edit, delete, add documents.","PermGetRoute":"Inherit workflow rights","PermAuthorDoc":"Record author","PermAuthorManagerDoc":"Record's author manager","PermAuthorAllManagerDoc":"Record's author line managers","Del":"Delete ","ToRoute2":"Workflow","CreateRoute":"Create workflow","RouteCreating":"Workflow","CreateState":"New Stage","AddResolution":"Add reassignment information","GetCurentState":"View Status","ViewPropertys":"View Properties","EditePropertys":"Edit Properties","RunInRoute":"Workflow","RouteState":"Workflow","StateTask":"Stage task","StateType":"Stage type","StateEstime":"Deadline (days)","MainMenu":"Main menu","Filter":"Filters","StateStatus":"Stage status","StateExecutor":"ASSIGNED","Create":"New","RouteTaskName":"Task description","RouteStateNum":"Order","RouteStateEstim":"Duration","UpdateStruct":"Update Structure ","Refresh":"Refresh","SelectType":"Task Type","StateType1":"Prepare","StateType2":"Approve","StateType3":"Reassign","StateType4":"Sign","StateType5":"Do","StateType6":"Register","LSTaskGroupeButton1":"Approve","LSTaskGroupeButton2":"Reject","LSTaskGroupeButton3":"Sign","Comitets":"Committees","History":"History","TypeExecute1":"User or Group","TypeExecute2":"Record Author","TypeExecute3":"Choose by Job Title","TypeExecute4":"Record Author's Manager","TypeExecute5":"Choose by Functional Role","Next":"Next","CreateFirstDep":"Add CEO","Alert1":"No workflow has been created for this type","Alert2":"Enter User name","Alert3":"Enter the Deputy name","Alert4":"Enter the Position title","Alert5":"Enter the Employee's name","Alert6":"Enter Manager's name","Alert7":"It is necessary to fill the line","Alert8":"Value must be more than zero","Alert9":"Value must be integer","Alert10":"Invalid date format","Alert11":"Stage type differs from the current stage type","Alert12":"Select stage type","Alert13":"Date cannot be less or equal to the current","Alert14":"Type the comment...","Alert15":"Nothing has been found due to search","Alert16":"Delete the department?","Alert17":"Delete the user?","Alert18":"Only one user can be selected","Alert19":"Select a department","Alert20":"Value must be a number","Alert21":"Due Date","Alert22":"Subtask description","Alert23":"Which list or library do you want to add a workflow to?","Alert24":"Select the view for implementing","Alert25":"Select a field that specified document type (data format 'metadata') and field that determines the condition. In the next step you will be able to create routes for each document type and according to the condition","Alert26":"This library hasn’t contain any 'metadata' field, thus generated rout will be the only. If you want to create different routes for different document types and adjust conditions, then is necessary to add document type field in 'metadata' format into the library and  repeat lists process adjustment","Alert27":"Select at least one value","Alert28":"You have not done any reassignment","Alert29":"Enter the reassignment text","Alert30":"Description","Alert31":"In Progress","Alert32":"Reject","Alert33":"Reassign","Alert34":"New subtask","Alert35":"Complete","Alert36":"To impose the reassignment","Alert37":"Write a comment","Alert38":"assigned to","Alert39":"by","Alert40":"and scheduled for","Alert41":"and with comment","Alert42":"at","Alert43":"Add","Alert44":"No tasks","Alert45":"TASK TYPE","Alert46":"DOCUMENT TYPE","Alert47":"Me","Alert48":"My group","Alert49":"My view","Alert50":"Others","Alert51":"Me","Alert52":"Ascending","Alert53":"Descending","Alert54":"Select the type relative to which the workflow will be adjusted","Alert55":"Record Type","Alert56":"Condition field","Alert57":"Task","Alert58":"Automatically closed task","Alert59":"Task in progress","Alert60":"Task is completed","Alert61":"Enter the like to the report","Alert62":"Task approval is received","Alert63":"Are you sure you want to delete the element?","Alert64":"the phone number is not specified","Alert65":"the department is not specified","Alert66":"Task rejection is received","Alert67":"reassigned the task","Alert68":"Subtask is created","Alert69":"To complete the installation of personal dashboard, please link the current page in web part settings","Alert70":"Field 'To whom appoint' not filled correctly","Alert71":"The number of characters should not exceed 255","Alert72":"Your changes are saved, it takes a few minutes to display the changes. Don't worry if you don't see them right away.","Alert73":"Language Pack has been saved","Alert74":"Module successfully created","Alert75":"Module successfully updated","Alert76":"You are not permitted to perform such actions","Alert77":"Which fields do you want to view in quick info in My Tasks?","Alert78":"Before the creation, you have to build Legal entities Module ","Alert79":"from","Alert80":"Not chosen","Aletr81":"Organizational Structure","Aletr82":"Functional Structure","Aletr83":"Create a new group positions ...","Aletr84":"Select a legal entity ...","Aletr85":"Legal entities list is empty. Please add at least one legal entity to use functional structure.","Aletr86":"Click on a right button to select","Alert87":"Element with the same name already exist","Alert88":"The availability of the functional structure","Alert89":"Are you sure you want to cancel the workflow?","Alert90":"Provide a link to this page","Alert91":"Due date must be later than start date","Alert92":"Select","Alert93":"Choose the rights ...","Alert94":"Create at least one element","Alert95":"Select event…","Alert96":"Use variables for the text message","Alert97":"All unsaved data will be lost ","Alert98":"You can not reassign a task to yourself","Alert99":"You can not choose more than 15 fields","Alert100":"No data","Alert101":"Please, pick the information to display here","Back":"Back","NewRezolution":"New reassignment","MySettings":"My settings","ChoiseTasksType":"SELECT","EstimeKind1":"2 or more days","EstimeKind2":"due in 2 days","EstimeKind3":"overdue","LSWith":"from","ToolBarButtonRoute11":"Current","ToolBarButtonRoute12":"workflow","ToolBarButtonRoute21":"Send","ToolBarButtonRoute22":"Start workflow","ToolBarButtonRoute31":"Create","ToolBarButtonRoute32":"workflow","DayPod1":"day","DayPod2":"days","DayPod3":"days","All":"All","DepManager":"Head of department","RunRoute":"Launch","StateStatus1":"Not started","StateStatus2":"In progress","StateStatus3":"Done","TaskStatus1":"Not started","TaskStatus2":"In progress","TaskStatus3":"Done","IsDelegate":"Reassigned","SelectedDoc":"Selected document","Save":"Save","Cencel":"Cancel","Sorting":"Sort by ","Tasks":"Tasks","TaskResults1":"Done","TaskResults2":"Reassigned","TaskResults3":"Auto completion","TaskResults4":"Canceled","MyRoom":"My tasks","StateInMyRoom1":"New","StateInMyRoom2":"Active","StateInMyRoom3":"Overdue","StateInMyRoom4":"Completed","StateInMyRoom5":"Archive","AddTask":"Subtasks","RelateDoc":"Linked Record","ByDoc":"By document","ByTask":"By tasks","HistoryEvent":"Event","HistoryEventDate":"Event date","HistoryTaskName":"Task subject","HistoryTaskAuthor":"Author","HistoryTaskExecutor":"Assigned","HistoryTaskStart":"Start Date","HistoryTaskDuet":"Due Date","HistoryDocAuthor":"Record Author","HistoryDocStateName":"Stage subject","DelList":"Deleted lists","TypeAddTask":"additional task","AcceptChoise":"Apply the selection","PresentsStatus1":"Is present","PresentsStatus2":"Absent","Presents":"Presence status","UserDeputy":"Deputy","AddUser":"Add a user","AddDep":"Add Department","EditDep":"Edit","DelDep":"Delete","EditUser":"Edit ","DelUser":"Delete","DepUser":"View department employees","TypeResolutionToDo":"Reassignment implementation","Manth0":"January","Manth1":"February","Manth2":"March","Manth3":"April","Manth4":"May","Manth5":"June","Manth6":"July","Manth7":"August","Manth8":"September","Manth9":"October","Manth10":"November","Manth11":"December","Day1":"Mo","Day2":"Tu","Day3":"We","Day4":"Th","Day5":"Fr","Day6":"Sa","Day0":"Su","licenseLetterExpired1":"Dear Customer, your LS Docs license is expired ","licenseLetterExpired2":"Please contact LS Docs support team. \n Thank you for your attention,\n LS Docs Help Desk","licenseLetterForAdmin1":"User","licenseLetterForAdmin2":"launched workflow without license. Please, contact the LS Docs Help Desk to solve this issue.","licenseLetterForUser":"You are trying to start the workflow. Your LS Docs administrator needs to grant a license to you to use workflows. All your actions are going to be saved. Please,  contact your LS Docs administrator.","LSMeetings":"Meetings","StateCommitteesInMyRoom1":"New","StateCommitteesInMyRoom2":"Invitations","StateCommitteesInMyRoom3":"Assigned letters","StateCommitteesInMyRoom4":"Competed","StateCommitteesInMyRoom5":"Archive","GeneralInformation":"General","Issues":"Questions","Documents":"Documents","Protoсol":"Protocol","TitleOfMeeting":"Subject","AuthorOfMeeting":"Initiator","Location":"Venue","Members":"Participants","Secretary":"Secretary","TitmeOfMeeting":"Time","DateOfMeeting":"Date","NewIssue":"New question","Speakers":"Specify speakers","NewMeeting":"New message","Solution":"Decision","Task":"Task","Note":"Notes","WriteSolution":"Write a decision","WriteTitleTask":"Enter the problem statement","NotExistIssuesForMeeting":"No questions for the meeting","WriteSpeakers":"Specify the speakers","WriteColleague":"Specify the employee","DescriptionMeeting":"Content","WriteSecretary":"Specify the secretary","WriteMembers":"Specify members","WriteAuthor":"Specify the initiator","WriteLocation":"Specify venue","WriteDescription":"Write a description","WriteNote":"Make a note","Approve":"approve","Publish":"Publish","Send":"Send","Download":"Download","TitleOfProtocol":"Meeting protocol","From":"from","TitleNewTask":"New task","inArchive":"To archive","NotExistMeetings":"No meetings","AppruveProtocol":"Approve meeting notes","TitleStatusAppruveOfProtocol":"Approval Notes status","StatusMeetingNew":"New","StatusMeetingInvitation":"Invitation","StatusMeetingAssigned":"Assigned","StatusMeetingEnded":"Ended","StatusMeetingArchive":"Archive","MeetingAssignedTo":"Assign to","DraftOfProtocol":"Draft","SitesOfCommittees":"Committees Sites","HeadOfCommittees":"Head of the Committee","SecretaryOfCommittees":"Committee Secretary","EnterTheTitleOfCommittees":"Type Committee name","EnterIdOfCommittees":"Type page name in English for ur","NewSite":"New site","EditOfSite":"Site editing","SuggestedQuestions":"Suggested questions","AcceptedQuestions":"Accepted questions","HeadPageOfCommittees":"Main","Discussions":"Consideration","Favorites":"Favorites","Calendar":"Calendar","minute":"min","EnaterNameOfHeadCommittee":"Type the Committee Head name","EnaterNameOfSecretaryCommittee":"Type the Committee secretary name","Yes":"Yes","No":"No","EnterNewIssue":"Type a new question","DocumnetTitle":"Document","LinkTitle":"Link","AddLinkToFavorite":"Add link to Favorites","EnterTitleOfLink":"Type the link name","EnterLink":"Type the link address","Ok":"Оk","IssuesForMeeting":"Questions to meetings","Created":"Created","AddDocToFavorite":"Adding documents to Favorites ","FilterFrom":"from","FilterTo":"to","Meeting":"Meeting","UploadNewImg":"Upload logo of committee","DeleteCommittee":"Remove site committee?","DeleteMeeting":"Save your changes?","ClickForCopy":"Click to copy the link","LinkCopied":"Copied","tooltipFileNotFound":"File isn't found","DefaultLang":"System default language","AssignetMe":"Assigned to me","AssignedMyGroup":"Assigned to group","CustomLangValue":"Update All Terms","DefaultLangValue":"Restore Default","ViewTaskLists":"Edit quick info","DocInfoBlock":"Document information ","LSContracts":"Contracts","TitleOfContracts":"Contract name","Summ":"Contract Value","LSContractCard":"Contract Record","Curence":"Currency","SignedDate":"Signing Date","Comments":"Comment","ContractNumber":"Number","SubjectContract":"Subject","Legality":"Validity Period","ContractType":"Contract Type","LSOrders":"Internal","Initiator":"Initiator","RegDate":"Registration Date","RegNumber":"Registration number","Grif":"Classification ","OrderType":"Document type","Subject":"Title","LSOrderCard":"Document card","LSMemo":"Memos","MemoType":"Notes type ","LSMemoCard":"Notes card","LSIntDoc":"Inbox","Sender":"Sender","Search":"Search","IntDocType":"Document type","SenderNumber":"Number of received document","GetDocDate":"Date of received document","Source":"Incoming source","LSIntDocCard":"Incoming card","LSExtDoc":"Outgoing","Recipient":"Receiver","IntDocNumber":"Incoming document number","LSExtDocCard":"Outgoing card","OpenProtocol":"Open Protocol","Card":"Record","EventAll":"All tasks","EventCreateTask":"Task assigning","EventDoneTask":"Task completion","EventAddTask":"Task with subtasks","EventDelegateTask":"Task reassigning","EventAutoCloseTask":"Task autocompletion","EventInWorkTask":"Task in progress","EventByComment":"Tasks with comments","Close":"Close","LSOrganizations":"Company","OrganizationsTitle":"Name","INN":"Tax ID","Adress":"Address","LSReject":"Stop Workflow","LSRejectRoute1":"Reject","LSRejectRoute2":"workflow","LSDocDescript":"Properties","LSDocChat":"Discussions","LSMobileRoute":"Workflow","LSStartDate":"Started","NewState":"New stage","ChengeSate":"Stage changing","ChengeSateYes":"Available","ChengeSateNo":"Unavailable","DescriptionSate":"Stage Details","DelState":"Delete stage","LSDocsLawFirmsFace":"Legal entity","LSChildLink":"LSChildLink","LSParentLink":"LSParentLink","NLinkMyTasks":"My Tasks","NLinkShowMore":"My Cabinet","NNoTasks":"no tasks","NAllTasks":"All tasks","NNotDoneTasks":"Not done","NewItem":"New Item","Status":"Status","Status_NotStarted":"Not Started","Status_InProgress":"In Progress","Status_Completed":"Completed","Status_Denied":"Denied","EditView":"Edit View","CreateView":"Create View","Accept":"Accept","Clean":"Clean","FullScreen":"Full Screen","Binding":"Binding","SendOnRoute_1":"Send","SendOnRoute_2":"on route","Edit":"Edit","Ribbon":"Ribbon","FirstSaveAndThenBind":"Please, save this item first. You will get the access to the binding functions after that.","BindingFunctions":"Binding functions","BindingWithParent":"Binding with a parent element","ParentElement":"Parent element","BindingWithChilds":"Binding with a child element","ChildElements":"Child element","Bind":"Bind","SearchIn":"Search in: ","SearchByParameters":"Search by parameters: ","Step3":"Step 3","AllModule":"All Modules","Reset":"Reset","Select":"Select","Update":"Update","Modules":"Modules","ModulesDescript":"Choose predefined libraries you would like to install to the current site collection or update after editing language packs","ModulesInfo":"The Modules section collects libraries/lists with different structure and types of content within the system. The Modules below are available for the automatic creation and update.","DocumentTemplates":"Document Templates","DocTempInfo":"You have an option to create a separate template for any type of metadata. All created templates are going to be added to the ribbon menu and to the Create button on the Documents tab. The blank template will be among them, if you will activate this option.","Dashboard":"PowerBi Dashboard","DashboardDescript":"Enter URL of PowerBi dashboard linked to the system","DashboardInfo":"PowerBI collects information about User Activity, Website usage or any other custom information. When you will insert the link to the PowerBI Dashboard in this section, we will display it in the main menu on the My Tasks page. You can change this URL later.","MyTasksUrl":"MyTasks URL","MyTasksUrlDescript":"If you want to move or delete your personal Dashboard, change or delete the URL","MyTasksUrlInfo":"Do not worry, the data will be saved, if you are moving  or deleting dashboard to another URL","Yammer":"Yammer for LS Meetings","YammerDescript":"Enter Network information to use discussions in LS Meetings","YammerInfo":"Current version works only with Yammer","YammerNameNetwork":"Type Name of the Network here...","YammerIDNetwork":"Type ID of the Network here...","if":"if","Taskcolorinfo":"day(s) left before due date","TaskAutoCloseInfo":"Automatic Task completion will assign an “Autocompleted” Status to the tasks and subtasks after due date is reached. It will affect the entire system.","ListsSettings":"Lists Settings","RouteSettingsInfo1":"Select the View, where LS Docs will be applied.","RouteSettingsInfo2":"Select the workflow creation method (record type OR record type and condition)","RouteSettingsInfo3":"Insert more details to your workflow creation method (record type OR record type and condition)","RecordType":"Record Type","ConditionField":"Condition Field","RoutesSettings":"Workflow Settings","InformationFields":"Information Fields","GeneralSettings":"General Settings","EnableProtocol":"Would you like to turn on the Agreement report function for this library?","AboutEnableProtocol":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","AboutSelectedField":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","WhatFields":"Please, pick the fields from the library you would like to show in the Workflow Agreement notes.","EnableAddTasks":"Would you like to include the information from the sub-tasks in the Workflow Agreement notes?","nameOfDocument":"Document name","descriptionOfDocument":"Description","authorOfDocument":"Author","approveDate":"Agreed","titleOfProtocolApprove":"Agreement notes","FIO":"Matching person Full Name","DateAndTime":"Date and Time","StatusAppruve":"Agreement status","CommentsInPRotocol":"Comments","NoticeSettingsTitle":"Notifications","NoticeSettingsSign":"You can choose if you need any notifications about Licenses","NoticeSettignsFirst":"Notify me about my License Expiration date in 7, 3, and 1 days before that","NoticeSettingsSecong":"Notify me, if number of my licenses reaches 80% and every 2 % after that","MStep10":"Agreement notes","Status_NotStart":"Not Started","NoInfo":"Please, pick the information to display here","Info":"This section allows you to use custom User Interface for the current library instead of the Sharepoint one. By activating one or more Views you are launching this interface. Activation of the Content type is going to allow you to apply custom User Interface for chosen types.","Views":"Views","ContentTypes":"Content Types","Alert102":"You have used more than 80% of licenses","Languages":"Languages","DefaulLanguage":"Defaul Language","DefaulLanguageInfo":"Defaul language for new users","ResetLang":"Reset Language Packs","ResetLangInfo":"Restore language packs to their original defaults","EditLang":"Edit Language Packs","EditLangInfo":"What language pack you would like to edit?","SelectLang":"Select a language...","US":"Eng","RU":"Rus","UA":"Ukr","AZ":"Az","licenseLetterExpired3":"Thank you for your attention,","licenseLetterExpired4":"LS Docs Help Desk","licenseLetterForAdmin3":"Please, contact the LS Docs Help Desk to solve this issue.","licenseLetterForUser1":"You are trying to start the workflow.","licenseLetterForUser2":"Your LS Docs administrator needs to grant a license to you to use workflows.","licenseLetterForUser3":"All your actions are going to be saved. Please, contact your LS Docs administrator.","licenseLetterForUser4":"Please, contact your LS Docs administrator.","licenseLetterTrial1":"Dear Customer,","licenseLetterTrial2":"Thanks for signing up for LS Docs Trial. We hope you have been enjoying your free trial.","licenseLetterTrial3":"Unfortunately, your free trial is ending in  ","licenseLetterTrial4":"days.","licenseLetterTrial5":"We'd love to keep you as a customer, and there is still time to subscribe!","licenseLetterTrial6":"As a reminder, when your trial expires you will be automatically forbidden to use our software.","licenseLetterTrial7":"If you have any questions or feedback, just reply to this email, and we'll get right back to you.","licenseLetterTrial8":"-- The LS Docs Team","licenseLetterTrialExpired1":"Dear Customer, Thanks for signing up for LS Docs Trial. We hope you have been enjoying your free trial","licenseLetterTrialExpired2":"Your free trial has just ended :-(","licenseLetterTrialExpired3":"We'd love to keep you as a customer, so please, reach out to LS Docs Team to prolong your experience or buy the product!","licenseLetterTrialExpired4":"If you have any questions or feedback, just reply to this email, and we'll get right back to you.","licenseLetterTrialExpired5":"-- The LS Docs Team","licenseLetterAboutPercentActive1":"Dear Customer, ","licenseLetterAboutPercentActive2":"Thanks for using LS Docs! We hope you have been enjoying your experience.","licenseLetterAboutPercentActive3":"You are running out of the licenses, you have used  ","licenseLetterAboutPercentActive4":"of your accounts. If you need more licenses, just drop us a line and we will fix that for you.","licenseLetterAboutPercentActive5":"We'd love to keep you as a customer, and there is still time to subscribe! ","licenseLetterAboutPercentActive6":"As a reminder, when your trial expires you will be automatically forbidden to use our software. ","licenseLetterAboutPercentActive7":"If you have any questions or feedback, just reply to this email, and we'll get right back to you.","licenseLetterAboutPercentActive8":"-- The LS Docs Team","licenseLetterActive1":"Dear Customer, ","licenseLetterActive2":"Thanks for using LS Docs. We hope you have been enjoying using our product.","licenseLetterActive3":"Unfortunately, your subscription ends ","licenseLetterActive4":"days.","licenseLetterActive5":"We'd love to keep you as a customer, so please, reach out to LS Docs Team to prolong your experience!","licenseLetterActive6":"If you have any questions or feedback, just reply to this email, ","licenseLetterActive7":"and we'll get right back to you.","licenseLetterActive8":"-- The LS Docs Team ","Step4":"Step 4","MeetingInstall":"LS Meetings","MeetingInstallDescript":"LS Meetings install","MeetingInstallInfo":"Current version Meeting","StatusLicense":"Status","TitleForFieldsInProtocol":"Title Fields in the Agreement Notes","RouteSettingsInfo4":"Activate workflow Autorun for this library?","MStep11":"Updates","LSOrgSettingsTitle":"User Directory","LSOrgStructTab":"Organizational structure","LSFunctStructTab":"Functional structure","LSNewfirstLEvel":"Create the first level","LSOrgInfo":"Create a nescessary Organisational structure for your company","LSOrgDescript":"Description","LSAddSubDep":"Add subdepartment","LSDelSubDep":"Delete subdepartment","LSDepStaf":"Department's stuff","LSPosition":"Position","UserIsExist":"User exist","LSDepTitle":"Department title","AddDepAlert":"Specify the department name","OrgAlert1":"To remove the need to remove the subsidiaries","OrgAlert2":"To remove the need to remove members of the unit","InfoToolTip":"Info","Required":"This field is required!","SystemUpdates":"System Updates","Version":"Version","PreviousVersion":"Previous version","GetUpdateNow":"Get update now","InstallUpdateNow":"Install update now","UpdateInstalled":"Update installed","Complete":"complete","LearnMore":"Learn more...","Alert103":"Job title is not specified","licenseStopWhenDo":"This action can not be performed because the license has expired. Contact your system administrator to restart the system.","licenseExpiredWhenDo":"This action can not be performed because the license has expired. Contact your system administrator to restart the system.","licenseWhenExpired":"The license has expired and the operation of the system is limited. Contact your system administrator to resume the full functionality of the system.","licenseWhenStop":"The license has expired and the operation of the system is limited. Contact your system administrator to resume the full functionality of the system.","TaskInfoDescript":"Description","DocFields":"Document's fields","JobGroupe":"Choose by Functional Role","FlowIsRuning":"Workflow is running","FlowIsReject":"Workflow is rolling back","AutocomleteTasks":"Autocomlete tasks","AutocomleteSubTasks":"Autocomlete subtasks","LSJobGroupeStuff":"Work group employees","LSFuncInfo":"Create a necessary Functional structure","LSFuncDescript":"Here you can implement your Functional structure, by adding several groups and employees according to your needs","FuncAlert1":"You have to add Legal entitis module in the General Settings","FuncAletr2":"Legal entities list is empty. Please add at least one legal entity to use functional structure.","FuncAletr3":"Create a new group positions ...","FuncAletr4":"Before deleting the group, you have to delete all users from the group","FuncAletr5":"You have used an invalid character","NewJobGroupe":"Create the New group","DelJobGroupe":"Do you want to delete This Group?","licenseLetterActiveExpired1":"Dear Customer,","licenseLetterActiveExpired2":"Thanks for using LS Docs. We hope you have been enjoying using our product.","licenseLetterActiveExpired3":"Unfortunately, your subscription has just ended.","licenseLetterActiveExpired4":"We'd love to keep you as a customer, so please, reach out to LS Docs Team to prolong your experience!","licenseLetterActiveExpired5":"If you have any questions or feedback, just reply to this email, and we'll get right back to you.","licenseLetterActiveExpired6":"- The LS Docs Team","DownloadLang":"Download language file","SelectFieldToRegDate":"Обрати поле для дати реєстрації","SelectFieldToRegNumber":"Обрати поле для реєстраційного номера","AddNewRecorderRule":"Add rule","RecorderRuleOther":"Other","RecorderRuleDefaulte":"Defaulte","RecorderRuleConstructor":"Constructor","ConstComponentName":"Name...","ChooseField":"Choose current library fields...","ChooseComponent":"Choose component","CreateTime":"Create time","ModulName":"Module's name","RelateDocId":"ID","DocAuthore":"Document's author","RegDepartment":"Department","HavenotEmail":"You haven't mail. You have to contact your administrator","HavenotManager":"You haven't manager. You have to contact your administrator","Notinstructure":"You aren't in structure. You have to contact your administrator","InfoOnViewForm":"Please, switch to the edit mode to bind elements.","RecorderInfo1":"Register the document, when the Record has been saved for the first time","RecorderInfo2":"Muneration rules","RecorderInfo3":"Example","RecorderInfo4":"The first letter of the document library name","RecorderInfo5":"Time (current time, day, month, year)","RecorderInfo6":"Serial number within the library","RecorderInfo7":"First","RecorderInfo8":"letters from the Name of the Library","RecorderInfo9":"Department (1 letter)","RecorderInfo10":"Surname (1 letter) and Name (1 letter) of the author"}

/***/ }),

/***/ 427:
/***/ (function(module, exports) {

module.exports = {"mobile":{"ChangeUser":"Змінити користувача","and":" і ","Login":"Вхід","enterAnotherUser":" ввійти в систему під іншим користувачем.","anotherUser":"інший користувач","EnterMessage":"Введіть свій email та пароль для входу.","Wait":"Зачекайте...","Downloading":"Завантаження...","Empty":"Тут пусто","OperationError":"Операція невдала. Виникла помилка"},"MStep1":"Підрозділи та користувачі","MStep2":"Налаштування списків","MStep3":"Налаштування звітів","MStep4":"Налаштування мови","MStep5":"Налаштування модулів","MStep6":"Застосувати дизайн","MStep7":"Повідомлення","MStep8":"Реєстратор","MStep9":"Ліцензії","Step1":"Крок 1","Step2":"Крок 2","Installation":"Установка","InstallInfo1":"Вітаємо у LS Docs!","InstallInfo2":"Ми крок за кроком пройдемо процес установки LS Docs. Натисніть кнопку Встановити для старту ...","Install":"Встановити","InstallProgress":"Йде установка...","InstallInfo3":"Не закривайте цю сторінку до кінця процесу установки. Ви будете перенаправлені на сторінку налаштувань по завершенню процесу.","InstallInfo4":"Ми готуємо LS Docs для вас:","InstallInfo5":"Налаштування Менеджера задач","InstallInfo6":"Вставте URL порожньої сторінки, де ви хочете використовувати Менеджер Завдань як веб-частину","InstallInfo7":"Укажіть URL тут...","InstallInfo8":"Менеджер (Mу Tasks) є частиною LS Docs, де кожна людина може управляти власними задачами. Зазвичай, наші клієнти мають створити нову сайтову колекцію для системи управління документами і використовувати свою сторінку за замовчуванням 'Мої завдання' (наприклад, 'https: //yourcompany.sharepoint.com/sites/documentcenter/home.aspx'). Ви можете змінити цей URL в майбутньому за допомогою параметрів LS Docs.","InstallInfo9":"Вітаємо!","InstallInfo10":"Ви успішно завершили весь процес установки. Тепер ви можете налаштувати параметри LS Docs.","InstallInfo11":"Натисніть Готово і перейдіть у розділ Налаштування","LicensTitle":"Інформаця про ліцензії","LSiteCollection":"Сайтова колекція","LTotalAmount":"Загальна кількість ліцензій","LRemainingLicenses":"Кількість неактивованих ліцензій","LDueDate":"Термін дії лцензії","LActivelicenses":"Активні ліцензії","LHelpRequest":"Запит допомоги","LUpdateLicens":"Оновити ліцензії","InstallSourse":"Установка компонентів","AutoRunRoute":"Автозапуск","Reports":"Звіти","AddResolution":"Додати текст резолюції","ViewHistory":"Переглянути історію","DocTemplateOn":"Включити порожній шаблон в картці","AbsenceDaystart":"з","AbsenceDayend":"до","SendTo":"Кому","CopyTo":"Копія","MTitle":"Налаштування додатку","GetData":"Отримати дані","ToRoute":"Відправити за маршрутом","SendToRoute":"Відправлено за маршрутом","AutoCloseTaskTitle":"Увімкнути автоматичне закриття завдань по закінченню терміну","NotificationSettings":"Налаштування сповіщень","EventType1":"Назначена задача","EventType2":"Назначена підзадача","EventType3":"Делегована задача","EventType4":"Завершена задача","EventType5":"Завершена підзадача","EventType6":"Зупинено виконання маршруту","EventType7":"Повернути попереднє значення","EventType8":"Відхилення задачі","NotifField_AssignedTo":"Виконавець","NotifField_ID":"Задача","NotifField_StartDate":"Дата початку","NotifField_TaskDueDate":"Термін","NotifField_TaskAuthore":"Автор задачі","NotifField_Authore":"Автор документа","NotifField_LinkToTask":"Посилання на задачу","NotifField_TaskComment":"Коментар","PermSettings":"Налаштування дозволів","EditRoute":"Редашування етапу","PermInState":"Під час етапу","PermEndState":"По завершенню этапу","PermExecutor":"Виконавець","PermExecutorDeputy":"Заступник виконавця","PermExecutorManager":"Керівник виконавця","PermExecutorAllManager":"Всі керівники виконавця по вертикалі","PermAuthor":"Автор задачі","PermAuthorManager":"Керівники автора адачі","PermAuthorAllManager":"Всі керівники автора завдання по вертикалі","PermExecutorAddTask":"Виконавці підзадач","PermUserAndGroup":"Користувач або група","PermRoleView":"Перегляд","PermRoleEdit":"Редагування","PermRoleViewInfo":"Користувачі можуть переглядати картку і завантажувати документи.","PermRoleEditInfo":"Користувачі можуть змінювати і видаляти картку і документи в ній, а також додавати нові документи.","PermGetRoute":"Успадковувати права маршруту","PermAuthorDoc":"Автор документа","PermAuthorManagerDoc":"Керівник автора документа","PermAuthorAllManagerDoc":"Всі керівники автора документа по вертикалі","Del":"Видалити","ToRoute1":"Відправити","ToRoute2":"за маршрутом","CreateRoute":"Створити маршрут","RouteCreating":"Створення маршруту","CreateFirstDep":"Створити перший рівень","TaskColorSettings":"Налаштування кольору задач","GetCurentState":"Переглянути стан","ViewPropertys":"Переглянути властивості","EditePropertys":"Змінити властивості","DayPod1":"день","DayPod2":"дні","DayPod3":"днів","RunInRoute":"Запуск за маршрутом","RouteState":"Стан виконання","CreateState":"Створити етап","ToolBarButtonRoute11":"Поточний","ToolBarButtonRoute12":"маршрут","ToolBarButtonRoute31":"Створити","ToolBarButtonRoute32":"маршрут","ToolBarButtonRoute21":"Відправити","ToolBarButtonRoute22":"за маршрутом","MainMenu":"Головне меню","Filter":"Фільтр","Sorting":"Сортування","StateTask":"Задача етапу","StateType":"Тип етапу","StateEstime":"Термін (днів)","StateStatus":"Стан етапу","StateExecutor":"Виконавець","Create":"Створити","RouteTaskName":"Формулювання завдання...","RouteStateNum":"Номер етапу","RouteStateEstim":"Термін в днях","UpdateStruct":"Оновити структуру","Refresh":"Оновити","Search":"Поиск","SelectType":"Тип завдання","StateType1":"Підготовка","StateType2":"Погодження","StateType3":"Резолюція","StateType4":"Підписання","StateType5":"Виконання","StateType6":"Реєстрація","LSTaskGroupeButton1":"Погодити","LSTaskGroupeButton2":"Відмовити","LSTaskGroupeButton3":"Підписати","Comitets":"Комітети","LSWith":"з","History":"Історія","TypeExecute1":"Користувач або група","TypeExecute2":"Автор документу","TypeExecute3":"Керівник підрозділу","TypeExecute4":"Керівник автора","TypeExecute5":"Функціональна роль","Next":"Далі","Alert1":"Для данного типу не існує маршрутів","Alert2":"Кому призначити...","Alert3":"Вкажіть заступника...","Alert4":"Вкажіть посаду...","Alert5":"Вкажіть співробітника...","Alert6":"Вкажіть керівника...","Alert7":"Необхідно заповнити поле","Alert8":"Значення повинно бути більше нуля","Alert9":"Значення повинно бути цілим","Alert10":"Не правильний формат дати","Alert11":"Тип етапу відрізняеться від існуючого типу етапу","Alert12":"Виберіть тип етапу","Alert13":"Дата не може бути менше поточної","Alert14":"Введіть коментар ...","Alert15":"За Вашим запитом нічого не знайдено...","Alert16":"Видалити департамент?","Alert17":"Видалити користувача?","Alert18":"Можливо вказати тільки одного користувача","Alert19":"Виберіть підрозділ","Alert20":"Значення повинно бути числом","Alert21":"Термін ...","Alert22":"Вкажіть тему...","Alert23":"Вибір списку/бібліотеки для підключення рішення","Alert24":"Оберіть подання для налагодження","Alert25":"Оберіть поля, відносно яких будуть будуватися маршрути","Alert26":"Побудуйте маршрути для обраних типів","Alert27":"Виберіть хоча б одне значення","Alert28":"Вы не наклали жодної резолюції","Alert29":"Введіть текст резолюції...","Alert30":"Опис","Alert31":"В роботу","Alert32":"Відхилити","Alert33":"Делегувати","Alert34":"Нова підзадача","Alert35":"Виконати","Alert36":"Накласти резолюцію","Alert37":"Введіть коментар до виконання завдання...","Alert38":"для","Alert39":"від","Alert40":"з терміном до","Alert41":"та з коментарем","Alert42":"в","Alert43":"Додати","Alert44":"Немає завдань","Alert45":"Тип завдань","Alert46":"Тип документу","Alert47":"Я","Alert48":"Моя група","Alert49":"Мій підрозділ","Alert50":"Інше","Alert51":"Я","Alert52":"За зростанням","Alert53":"За зменшенням","Alert54":"Оберіть тип, відносно якого буде будуватися маршрут","Alert55":"Поле типу","Alert56":"Поле умови","Alert57":"Призначене завдання","Alert58":"Автоматично закрите завдання","Alert59":"Взяте в роботу завдання","Alert60":"Завершено завдання","Alert61":"Введіть посилання на звіт","Alert62":"Отримана згода по завданню","Alert63":"Ви дійсно бажаєте видалити даний елемент?","Alert64":"телефон не вказано","Alert65":"підрозділ не вказано","Alert66":"Отримано відмову по завданню","Alert67":"делегував завдання","Alert68":"Створена підзадача","Alert69":"Для завершення налаштування особистого кабинету необхідно вказати посилання поточної сторінки в налаштування даної веб-частини.","Alert70":"Поле 'Кому призначити' заповнено не коректно","Alert71":"Кількість символів не повинно перевищувати 255","Alert72":"Ваші зміни збережені, але для їх вступу в силу може знадобитися кілька хвилин. Не турбуйтеся, якщо не побачите їх відразу ж.","Alert73":"Мовні параметри були збережені","Alert74":"Модуль успішно створено","Alert75":"Модуль успішно оновлено","Alert76":"У Вас недостатньо прав на виконання даних дій","Alert77":"Виберіть поля картки, які будуть перегляньте в завданні для інформації","Alert78":"Перед створенням необхідно створити модуль Контрагенти","Alert79":"з","Alert80":"Не вибрано","Aletr81":"Організаційна структура","Aletr82":"Функціональна структура","Aletr83":"Створити нову групу посад ...","Aletr84":"Виберіть юридичну особу ...","Aletr85":"База юридичних осіб порожня, перш ніж продовжувати роботу вказати хоча б одну юридичну особу в списку","Aletr86":"Ваша професія ...","Alert87":"Елемент з такою назвою вже існує","Alert88":"Доступність функціональної структури","Alert89":"Ви дійсно хочете скасувати маршрут?","Alert90":"Вкажіть посилання на сторінку","Alert91":"Дата закінчення не може бути менше початку","Alert92":"Виберіть один з варіантів ...","Alert93":"Виберіть права ...","Alert94":"Створіть хоча б один елемент","Alert95":"Виберіть подію ...","Alert96":"Використовуйте змінні для тексту повідомлення","Alert97":"Всі не збережені дані будуть втрачені","Alert98":"Не можна делегувати задачу на себе","Alert99":"Не можна вибирати більше 15 полів","Alert100":"Нема даних","Alert101":"Оберіть інформацію для відображення","Back":"Назад","NewRezolution":"Нова резолюція","ChoiseTasksType":"Вибір типу завдань","MySettings":"Мої налаштування","EstimeKind1":"більше 2 днів","EstimeKind2":"меньше 2 днів","EstimeKind3":"термін вичерпано","All":"Всі","DepManager":"Керівник підрозділу","RunRoute":"Запустити","StateStatus1":"Не розпочато","StateStatus2":"В роботі","StateStatus3":"Завершено","Save":"Зберегти","Cencel":"Відмінити","Tasks":"Завдання","TaskStatus1":"Не розпочато","TaskStatus2":"На виконанні","TaskStatus3":"Завершено","SelectedDoc":"Обраний документ","TaskResults1":"Виконано","TaskResults2":"Делеговано","TaskResults3":"Авто завершення","TaskResults4":"Відмінено","MyRoom":"Мої завдання","IsDelegate":"Делеговано","StateInMyRoom1":"Нові","StateInMyRoom2":"В роботі","StateInMyRoom3":"Протерміновано","StateInMyRoom4":"Завершено","StateInMyRoom5":"Архів","AddTask":"Підзадачі","RelateDoc":"Пов'язаний елемент","ByDoc":"По документу","ByTask":"По завданням","HistoryEvent":"Подія","HistoryEventDate":"Дата події","HistoryTaskName":"Назва завдання","HistoryTaskAuthor":"Автор","HistoryTaskExecutor":"Призначено","HistoryTaskStart":"Дата початку","HistoryTaskDuet":"Термін","HistoryDocAuthor":"Автор документу","HistoryDocStateName":"Назва етапу","DelList":"Видалити списки LSDocsOnline","TypeAddTask":"Додаткове завдання","AcceptChoise":"Застосувати вибір","PresentsStatus1":"Присутній","PresentsStatus2":"Відсутній","Presents":"Присутність","UserDeputy":"Заступник","AddUser":"Додати користувача","AddDep":"Додати підрозділ","EditDep":"Редагувати підрозділ","DelDep":"Видалити підрозділ","DepUser":"Співробітники підрозділу","EditUser":"Редагувати співробітника","DelUser":"Видалити співробітника","TypeResolutionToDo":"Виконання резолюції","Manth0":"січня","Manth1":"лютого","Manth2":"березня","Manth3":"квітня","Manth4":"травня","Manth5":"червня","Manth6":"липня","Manth7":"серпня","Manth8":"вересеня","Manth9":"жовтня","Manth10":"листопада","Manth11":"грудня","Day1":"Пн","Day2":"Вт","Day3":"Ср","Day4":"Чт","Day5":"Пт","Day6":"Сб","Day0":"Нд","licenseLetterExpired1":"Шановний адміністратор, термін користування ліцензованою весією продукту LS Docs вичерпано","licenseLetterExpired2":"Прохання, звернутись до команди підтримки продукту.","licenseLetterForAdmin1":"Користувач","licenseLetterForAdmin2":"запустив документи по маршруту, не маючи ліцензії.","licenseLetterForUser":"Ви намагаєтеся відправити документ по маршруту. На жаль, ваш аккаунт не був ліцензований. Ваші дії будуть збережені. Документи будуть відправлені, коли аккаунт пройде ліцензування. Зверніться до адміністратора системи вашої компанії.","LSMeetings":"Наради","StateCommitteesInMyRoom1":"Нові","StateCommitteesInMyRoom2":"Запрошення","StateCommitteesInMyRoom3":"Призначені","StateCommitteesInMyRoom4":"Завершенні","StateCommitteesInMyRoom5":"Архів","GeneralInformation":"Загальні","Issues":"Питання","Documents":"Документи","Protoсol":"Протокол","TitleOfMeeting":"Назва","AuthorOfMeeting":"Ініціатор","Location":"Місце проведення","Members":"Учасники","Secretary":"Секретар","TitmeOfMeeting":"Час проведення","DateOfMeeting":"Дата проведення","NewIssue":"Нове питання","Speakers":"Вкажіть спікерів","NewMeeting":"Нова нарада","Solution":"Рішення","Task":"Задача","Note":"Замітки","WriteSolution":"Вкажіть прийняте рішення","WriteTitleTask":"Введіть текст задачі","NotExistIssuesForMeeting":"Відсутні питання для обраного засідання ","WriteSpeakers":"Вкажіть спікерів","WriteColleague":"Вкажіть працівника","DescriptionMeeting":"Опис","WriteSecretary":"Вкажіть секретаря","WriteMembers":"Вкажіть учасників","WriteAuthor":"Вкажіть ініціатора","WriteLocation":"Вкажіть місце проведення","WriteDescription":"Вкажіть опис","WriteNote":"Напишіть замітку","Approve":"Погодити","Publish":"Опублікувати","Send":"Відправити","Download":"Скачати","TitleOfProtocol":"Протокол зустрічі","From":"від","TitleNewTask":"Нова задача","inArchive":"В Архів","NotExistMeetings":"Немає мітингів","AppruveProtocol":"Погодити протокол зустрічі","TitleStatusAppruveOfProtocol":"Статус погодження протоколу","StatusMeetingNew":"Нові","StatusMeetingInvitation":"Запрошення","StatusMeetingAssigned":"Призначені","StatusMeetingEnded":"Завершені","StatusMeetingArchive":"Архів","MeetingAssignedTo":"Призначити","DraftOfProtocol":"Чернетка","SitesOfCommittees":"Сайти комітетів","HeadOfCommittees":"Голова комітету","SecretaryOfCommittees":"Секретар комітету","EnterTheTitleOfCommittees":"Введіть назву комітету","EnterIdOfCommittees":"Введіть назву сторінки англійською для url","NewSite":"Новий сайт","EditOfSite":"Змінити сайт","SuggestedQuestions":"Запропоновані питання","AcceptedQuestions":"Прийняті питання","HeadPageOfCommittees":"Головна","Discussions":"Обговорення","Favorites":"Обране","Calendar":"Календар","minute":"хв","EnaterNameOfHeadCommittee":"Введіть ім’я голови комітету","EnaterNameOfSecretaryCommittee":"Введіть ім’я секретаря комітету","Yes":"Так","No":"Ні","EnterNewIssue":"Введіть текст нового питання","DocumnetTitle":"Документ","LinkTitle":"Посилання","AddLinkToFavorite":"Додавання посилання в Обране","EnterTitleOfLink":"Введіть назву посилання","EnterLink":"Введіть адресу посилання","Ok":"ОК","IssuesForMeeting":"Питання на засідання","Created":"Створено","AddDocToFavorite":"Додавання документу в Обране","FilterFrom":"з","FilterTo":"по","Meeting":"Нарада","UploadNewImg":"Завантажте лого комітету","DeleteCommittee":"Видалити сайт комітету?","DeleteMeeting":"Зберегти внесені зміни?","ClickForCopy":"Натисніть, щоб скопіювати посилання","LinkCopied":"Скопійовано","tooltipFileNotFound":"Файл не знайдено","DefaultLang":"Мова системи по замовчанню","AssignetMe":"Призначені мені","AssignedMyGroup":"Призначені моїй групі","CustomLangValue":"Оновити структуру термінів","DefaultLangValue":"Отримати значення за замовчанням","ViewTaskLists":"Выбрать поля для отображения в задачах","DocInfoBlock":"Інформація по документу","LSContracts":"Договори","TitleOfContracts":"Назва договору","Summ":"Сумма","LSContractCard":"Картка договору","Curence":"Валюта","SignedDate":"Дата підписання","Comments":"Коментарі","ContractNumber":"Номер","SubjectContract":"Предмет договору","Legality":"Термін дії","ContractType":"Тип договора","LSOrders":"Внутрішні","Initiator":"Ініціатор","RegDate":"Дата реєстрації","RegNumber":"Реєстраційний номер","Description":"Зміст","Grif":"Гриф","OrderType":"Тип документу","Subject":"Тема","LSOrderCard":"Картка документу","LSMemo":"Службові записки","MemoType":"Тип записки","LSMemoCard":"Картка записки","LSIntDoc":"Вхідні","Sender":"Відправник","IntDocType":"Тип документу","SenderNumber":"Номер отриманого документу","GetDocDate":"Дата отриманного документу","Source":"Джерело надходження","LSIntDocCard":"Картка вхідного","LSExtDoc":"Вихідні","Recipient":"Отримувач","IntDocNumber":"Номер вхідного документу","LSExtDocCard":"Картка вихідного","LSOrganizations":"Контрагенти","OrganizationsTitle":"Назва контрагента","INN":"ІПН","Adress":"Адреса","NewItem":"Новий елемент","Status":"Статус","Status_NotStarted":"Не розпочато","Status_InProgress":"В процесі","Status_Completed":"Завершено","Status_Denied":"Відхилено","EditView":"Змінити це подання","CreateView":"Створити подання","Accept":"Застосувати","Clean":"Очистити","FullScreen":"Повноекранний","Binding":"Зв'язування","SendOnRoute_1":"Відправити","SendOnRoute_2":"за маршрутом","Edit":"Змінити","Ribbon":"Стрічка","FirstSaveAndThenBind":"Збережіть цей елемент, після цього вам стануть доступні функції зв'язування.","BindingFunctions":"Зв'язування з елементом","BindingWithParent":"Зв'язок з батьківським елементом","ParentElement":"Батьківський елемент","BindingWithChilds":"Зв'язок з дочірнім елементом","ChildElements":"Дочірній елемент","Bind":"Зв'язати","SearchIn":"Пошук в: ","SearchByParameters":"Пошук по параметру: ","OpenProtocol":"Відкрити протокол","Card":"Картка","EventAll":"Усі події","EventCreateTask":"Призначення задач","EventDoneTask":"Виконання задач","EventAddTask":"Події з підзадачами","EventDelegateTask":"Делегування задач","EventAutoCloseTask":"Автозавершення задач","EventInWorkTask":"Взяти задачу в роботу","EventByComment":"Події з коментарями","Close":"Закрити","LSReject":"Відхилити маршрут","LSRejectRoute1":"Відхилити","LSRejectRoute2":"маршрут","LSDocDescript":"Властивості","LSDocChat":"Обговорення","LSMobileRoute":"Маршрут","LSStartDate":"Розпочато","NewState":"Новий етап","ChengeSate":"Зміна етапа","ChengeSateYes":"Доступно","ChengeSateNo":"Не доступно","DescriptionSate":"Деталі етапа","DelState":"Видалити етап","LSDocsLawFirmsFace":"Юридична особа","LSChildLink":"Дочірній елемент","LSParentLink":"Батьківський елемент","NLinkMyTasks":"Мої задачі","NLinkShowMore":"Мій кабінет","NNoTasks":"задач немає","NAllTasks":"Всі","NNotDoneTasks":"Невиконані","Step3":"Крок 3","AllModule":"Всі модулі","Reset":"Перезавантажити","Select":"Обрати","Update":"Оновити","Modules":"Модулі","ModulesDescript":"Виберіть бібліотеки, які ви хотіли б встановити в поточному сімействі сайтів або оновити після редагування мовних пакетів\n","ModulesInfo":"У розділі Модулі зібрано бібліотеки / списки з різною структурою і типами контенту в системі. Модулі нижче, доступні для автоматичного створення та оновлення.","DocumentTemplates":"Шаблони документів","DocTempInfo":"У вас є можливість створити окремий шаблон для будь-якого типу метаданих. Всі створені шаблони будуть додані в меню стрічки і кнопку Створити на вкладці Документи. Порожній шаблон буде серед них, якщо ви активуєте цю опцію.","Dashboard":"Звіти PowerBi","DashboardDescript":"Вкажіть URL на звіти PowerBi, що мають бути залінковані","DashboardInfo":"PowerBI збирає інформацію про активність користувачів, використання веб-сайту або будь-яку іншу інформацю про користувачів. Коли ви розмістите посилання на PowerBI в панелі управління в цьому розділі, ми будемо показувати його в головному меню на сторінці Мої завдання. Ви можете змінити цей URL пізніше.","MyTasksUrl":"Менеджер Задач URL","MyTasksUrlDescript":"Якщо ви бажаєте перенести або видалити персональний кабінет, то просто змініть або видаліть URL","MyTasksUrlInfo":"Не хвилюйтесь, усі дані будуть збережені, якщо ви переміщуєте або видаляєте кабінет","Yammer":"Yammer для LS Meetings","YammerDescript":"Вкажіть інформацію про Мережу для використання Обговорень в LS Meetings","YammerInfo":"Поточна версія працює тільки з Yammer","YammerNameNetwork":"Вкажіть Назву Мережі...","YammerIDNetwork":"Вкажіть ID Мережі...","if":"якщо","Taskcolorinfo":"дні(в) до кінця терміну виконання","TaskAutoCloseInfo":"Автоматичне завершення задач буде призначити статус 'Автозавершення' задач і підзадач після закінчення терміну виконання. Це буде впливати на всю систему.","ListsSettings":"Налаштування списків","RouteSettingsInfo1":"Оберіть Відображення до яких буде застосовано LS Docs.","RouteSettingsInfo2":"Оберіть метод побудови маршруту (метадані АБО метадані та умова)","RouteSettingsInfo3":"Деталізуйте метод побудови маршруту (метадані АБО метадані та умова)","RecordType":"Тип документу","ConditionField":"Умова","RoutesSettings":"Налаштування маршрутів","InformationFields":"Інформаційні поля","GeneralSettings":"Загальні налаштування","EnableProtocol":"Ви хочете підключити складання Протоколу узгодження для цієї бібліотеки?","AboutEnableProtocol":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","AboutSelectedField":"This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.This text should contain the exlanation for yhe Step #. Actions and the outcome.","WhatFields":"Будь ласка, виберіть поля з бібліотеки, які вам необхідно включити в Протокол узгодження.","EnableAddTasks":"Ви хочете включити інформацію з під-задач в рамках даного процесу?","nameOfDocument":"Назва документу","descriptionOfDocument":"Опис документу","authorOfDocument":"Автор документу","approveDate":"Узгоджено","titleOfProtocolApprove":"Протокол погодження","FIO":"ПІБ ПОГОДЖУЮЧОГО","DateAndTime":"ДАТА І ЧАС","StatusAppruve":"СТАТУС УЗГОДЖЕННЯ","CommentsInPRotocol":"КОМЕНТАРІ","NoticeSettingsTitle":"Сповіщення","NoticeSettingsSign":"Ви можете вибрати, якщо вам потрібні будь-які сповіщення про Ліцензії","NoticeSettignsFirst":"Повідомляти мене про термін закінчення дії підписки за 7,3,1 днів до цієї дати","NoticeSettingsSecong":"Повідомляти мене про про досягнення ліміту користувачів (з 80% кожні 2%)","MStep10":"Протокол","Status_NotStart":"Не розпочато","NoInfo":"Оберіть інформацію для відображення","Info":"This section allows you to use custom User Interface for the current library instead of the Sharepoint one. By activating one or more Views you are launching this interface. Activation of the Content type is going to allow you to apply custom User Interface for chosen types.","Views":"Відображення","ContentTypes":"Контент Типи","Alert102":"Ви використали більше 80% ліцензій","Languages":"Мови","DefaulLanguage":"Мова за замовчанням","DefaulLanguageInfo":"Мова за замовчанням для нових користувачів","ResetLang":"Перезавантажити мовні налаштування","ResetLangInfo":"Встановити початкові значення для усіх мов","EditLang":"Редагувати мовні налаштування","EditLangInfo":"Яку мову ви бажаєте редагувати?","SelectLang":"Оберіть мову...","US":"Eng","RU":"Рус","UA":"Укр","AZ":"Az","licenseLetterExpired3":"","licenseLetterExpired4":"- Команда LS Docs","licenseLetterForAdmin3":"Зверніться до підтримки LS Docs для отримання ліцензії користувача.","licenseLetterForUser1":"Ви намагаєтеся відправити документ по маршруту. ","licenseLetterForUser2":"На жаль, ваш аккаунт не був ліцензований. ","licenseLetterForUser3":"Ваші дії будуть збережені. Документи будуть відправлені, коли аккаунт пройде ліцензування. ","licenseLetterForUser4":" Зверніться до адміністратора системи вашої компанії.","licenseLetterTrial1":"Шановний клієнт,","licenseLetterTrial2":" Дякуємо за реєстрацію LS Docs Trial. Ми сподіваємося, що ви насолоджувалися безкоштовну пробну версію.","licenseLetterTrial3":"На жаль, ваша безкоштовна пробна версія LS Docs закінчується через ","licenseLetterTrial4":"днів.","licenseLetterTrial5":"Ми хотіли б, щоб ви стали нашим постiйним клиєнтом,! ","licenseLetterTrial6":"Ми хочемо нагадати, що коли термін дії пробної версії буде вичерпано, то система автоматично заборонить використання нашого програмне забезпечення.","licenseLetterTrial7":"Якщо у вас є які-небудь питання або побажання, просто дайте відповідь на цей лист, і ми обов'язково зв'яжемося з вами.","licenseLetterTrial8":"- Команда LS Docs","licenseLetterTrialExpired1":"Шановний клієнт,","licenseLetterTrialExpired2":"Ваш безкоштовний пробний період користування LS Docs щойно закінчився :-(","licenseLetterTrialExpired3":"Ми хотіли б, щоб ви залишалися нашим клієнтом, тому, будь ласка, зверніться до команди підтримки LS Docs,","licenseLetterTrialExpired4":"щоб продовжити пробну версію або купити продукт! Якщо у вас є які-небудь питання або побажання, просто дайте відповідь на цей лист, і ми обов'язково зв'яжемося з вами.","licenseLetterTrialExpired5":"- Команда LS Docs","licenseLetterAboutPercentActive1":"Шановний клієнт, ","licenseLetterAboutPercentActive2":"Дякуємо Вам за використання LS Docs! Ми сподіваємося, що Ви із задоволенням користуєтеся нашим продуктом.","licenseLetterAboutPercentActive3":"Ви використали ","licenseLetterAboutPercentActive4":"ваших ліценззій. Якщо вам потрібно більше ліцензій, просто напишіть нам, і ми виправимо це.","licenseLetterAboutPercentActive5":"Ми хотіли б, щоб ви залишалися нашим клієнтом! ","licenseLetterAboutPercentActive6":"Якщо у вас є які-небудь питання або побажання, просто дайте відповідь на цей лист, і ми обов'язково зв'яжемося з вами.","licenseLetterAboutPercentActive7":" і ми обов'язково зв'яжемося з вами.","licenseLetterAboutPercentActive8":"- Команда LS Docs","licenseLetterActive1":"Шановний клієнт,","licenseLetterActive2":"Дякуємо Вам за використання LS Docs. Ми сподіваємося, що вам подобається наш продукт.","licenseLetterActive3":"На жаль, ваша підписка закінчується через","licenseLetterActive4":"днів (день).","licenseLetterActive5":"Ми хочемо, щоб ви залишалися нашим клієнтом, будь ласка, зверніться до команди LS Docs, щоб продовжити підписку!","licenseLetterActive6":"Якщо у вас є які-небудь питання або побажання, просто дайте відповідь на цей лист, ","licenseLetterActive7":"і ми обов'язково зв'яжемося з вами.","licenseLetterActive8":"- Команда LS Docs","Step4":"Крок 4","MeetingInstall":"LS Meetings","MeetingInstallDescript":"Встановити LS Meetings","MeetingInstallInfo":"Версія LS Meetings","StatusLicense":"Статус","TitleForFieldsInProtocol":"Поля заголовку Протоколу узгодження","RouteSettingsInfo4":"Підключати Автозапуск за маршрутом до даної бібліотеки?","MStep11":"Оновлення","LSOrgSettingsTitle":"Підрозділи та користувачі","LSOrgStructTab":"Організаційна структура","LSFunctStructTab":"Функціональна структура","LSNewfirstLEvel":"Створити перший рівень","LSOrgInfo":"Створіть необхідну Організаційну структуру для вашої компанії","LSOrgDescript":"Опис","LSAddSubDep":"Додати піддепартамент","LSDelSubDep":"Видалити піддепартамент","LSDepStaf":"Співробітники департаменту","LSPosition":"Посада","UserIsExist":"Такий користувач вже існує","LSDepTitle":"Назва департаменту","AddDepAlert":"Укажите название подразделения","OrgAlert1":"Для видалення необхідно видалити дочірні підрозділи","OrgAlert2":"Для видалення необхідно видалити користувачів даного підрозділу","InfoToolTip":"Інформація","Required":"Це поле є обов'язковим!","SystemUpdates":"Оновлення системи","Version":"Версія","PreviousVersion":"Попередні версії","GetUpdateNow":"Отримати оновлення зараз","InstallUpdateNow":"Встановити оновлення","UpdateInstalled":"Обовленн встановлено","Complete":"Завершено","LearnMore":"Дізнатись більше...","Alert103":"Посаду не вказано","licenseStopWhenDo":"Дана дія не може бути виконати, оскільки закінчився термін дії ліцензії. Зверніться до адміністратора системи для відновлення роботи системи.","licenseExpiredWhenDo":"Дана дія не може бути виконати, оскільки закінчився термін дії ліцензії. Зверніться до адміністратора системи для відновлення роботи системи.","licenseWhenExpired":"Термін дії ліцензії закінчився і функціонування системи обмежено. Зверніться до адміністратора системи для відновлення повнофункціональної роботи системи.","licenseWhenStop":"Термін дії ліцензії закінчився і функціонування системи обмежено. Зверніться до адміністратора системи для відновлення повнофункціональної роботи системи.","TaskInfoDescript":"Опис","DocFields":"Document's fields","JobGroupe":"Choose by Functional Role","FlowIsRuning":"Flow is runing","FlowIsReject":"Flow is rejecting","AutocomleteTasks":"Autocomlete tasks","AutocomleteSubTasks":"Autocomlete subtasks","LSJobGroupeStuff":"Співробітники группи","LSFuncInfo":"Створіть необхідну Функціональну структуру","LSFuncDescript":"Опис","FuncAlert1":"Необхідно додати модуль Контрагенти у розділі Загальні налаштування","FuncAletr2":"База юридичних осіб порожня, перш ніж продовжувати роботу вказати хоча б одну юридичну особу в списку","FuncAletr3":"Create a new group positions ...","FuncAletr4":"Для удаления необходимо удалить пользователей данной группы","FuncAletr5":"Используется недопустимый символ","NewJobGroupe":"Створіть нову группу","DelJobGroupe":"Del Job Groupe?","licenseLetterActiveExpired1":"Шановний клієнт,","licenseLetterActiveExpired2":"Дякуємо Вам за використання LS Docs. Ми сподіваємося, що вам подобається наш продукт.","licenseLetterActiveExpired3":"На жаль, термін дії вашої ліцензії на користування LS Docs щойно закінчився :-(","licenseLetterActiveExpired4":"Ми хочемо, щоб ви залишалися нашим клієнтом, будь ласка, зверніться до команди LS Docs, щоб продовжити підписку!","licenseLetterActiveExpired5":"Якщо у вас є які-небудь питання або побажання, просто дайте відповідь на цей лист, і ми обов'язково зв'яжемося з вами.","licenseLetterActiveExpired6":"- Команда LS Docs","DownloadLang":"Download language file","SelectFieldToRegDate":"Обрати поле для дати реєстрації","SelectFieldToRegNumber":"Обрати поле для реєстраційного номера","AddNewRecorderRule":"Add rule","RecorderRuleOther":"Other","RecorderRuleDefaulte":"Defaulte","RecorderRuleConstructor":"Constructor","ConstComponentName":"Name...","ChooseField":"Choose current library fields...","ChooseComponent":"Choose component","CreateTime":"Create time","ModulName":"Module's name","RelateDocId":"ID","DocAuthore":"Document's author","RegDepartment":"Department","HavenotEmail":"You haven't mail. You have to contact your administrator","HavenotManager":"You haven't manager. You have to contact your administrator","Notinstructure":"You aren't in structure. You have to contact your administrator","InfoOnViewForm":"Для виконання зв'язування перейдіть до режиму редагування.","RecorderInfo1":"Регистрация при первом сохранении карточки документа","RecorderInfo2":"Правила присвоения номера","RecorderInfo3":"Пример","RecorderInfo4":"Первая буква из названия библиотеки документа","RecorderInfo5":"Время (текущее время, день, месяц, год)","RecorderInfo6":"Порядковй номер в рамках библиотеки","RecorderInfo7":"Первые","RecorderInfo8":"буквы из названия библиотеки документа","RecorderInfo9":"Подразделение (1 буква)","RecorderInfo10":"Фамилия (1 буква) и Имя (1 буква) автора"}

/***/ }),

/***/ 430:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 220,
	"./af.js": 220,
	"./ar": 221,
	"./ar-dz": 222,
	"./ar-dz.js": 222,
	"./ar-kw": 223,
	"./ar-kw.js": 223,
	"./ar-ly": 224,
	"./ar-ly.js": 224,
	"./ar-ma": 225,
	"./ar-ma.js": 225,
	"./ar-sa": 226,
	"./ar-sa.js": 226,
	"./ar-tn": 227,
	"./ar-tn.js": 227,
	"./ar.js": 221,
	"./az": 228,
	"./az.js": 228,
	"./be": 229,
	"./be.js": 229,
	"./bg": 230,
	"./bg.js": 230,
	"./bm": 231,
	"./bm.js": 231,
	"./bn": 232,
	"./bn.js": 232,
	"./bo": 233,
	"./bo.js": 233,
	"./br": 234,
	"./br.js": 234,
	"./bs": 235,
	"./bs.js": 235,
	"./ca": 236,
	"./ca.js": 236,
	"./cs": 237,
	"./cs.js": 237,
	"./cv": 238,
	"./cv.js": 238,
	"./cy": 239,
	"./cy.js": 239,
	"./da": 240,
	"./da.js": 240,
	"./de": 241,
	"./de-at": 242,
	"./de-at.js": 242,
	"./de-ch": 243,
	"./de-ch.js": 243,
	"./de.js": 241,
	"./dv": 244,
	"./dv.js": 244,
	"./el": 245,
	"./el.js": 245,
	"./en-au": 246,
	"./en-au.js": 246,
	"./en-ca": 247,
	"./en-ca.js": 247,
	"./en-gb": 114,
	"./en-gb.js": 114,
	"./en-ie": 248,
	"./en-ie.js": 248,
	"./en-nz": 249,
	"./en-nz.js": 249,
	"./eo": 250,
	"./eo.js": 250,
	"./es": 251,
	"./es-do": 252,
	"./es-do.js": 252,
	"./es-us": 253,
	"./es-us.js": 253,
	"./es.js": 251,
	"./et": 254,
	"./et.js": 254,
	"./eu": 255,
	"./eu.js": 255,
	"./fa": 256,
	"./fa.js": 256,
	"./fi": 257,
	"./fi.js": 257,
	"./fo": 258,
	"./fo.js": 258,
	"./fr": 259,
	"./fr-ca": 260,
	"./fr-ca.js": 260,
	"./fr-ch": 261,
	"./fr-ch.js": 261,
	"./fr.js": 259,
	"./fy": 262,
	"./fy.js": 262,
	"./gd": 263,
	"./gd.js": 263,
	"./gl": 264,
	"./gl.js": 264,
	"./gom-latn": 265,
	"./gom-latn.js": 265,
	"./gu": 266,
	"./gu.js": 266,
	"./he": 267,
	"./he.js": 267,
	"./hi": 268,
	"./hi.js": 268,
	"./hr": 269,
	"./hr.js": 269,
	"./hu": 270,
	"./hu.js": 270,
	"./hy-am": 271,
	"./hy-am.js": 271,
	"./id": 272,
	"./id.js": 272,
	"./is": 273,
	"./is.js": 273,
	"./it": 274,
	"./it.js": 274,
	"./ja": 275,
	"./ja.js": 275,
	"./jv": 276,
	"./jv.js": 276,
	"./ka": 277,
	"./ka.js": 277,
	"./kk": 278,
	"./kk.js": 278,
	"./km": 279,
	"./km.js": 279,
	"./kn": 280,
	"./kn.js": 280,
	"./ko": 281,
	"./ko.js": 281,
	"./ky": 282,
	"./ky.js": 282,
	"./lb": 283,
	"./lb.js": 283,
	"./lo": 284,
	"./lo.js": 284,
	"./lt": 285,
	"./lt.js": 285,
	"./lv": 286,
	"./lv.js": 286,
	"./me": 287,
	"./me.js": 287,
	"./mi": 288,
	"./mi.js": 288,
	"./mk": 289,
	"./mk.js": 289,
	"./ml": 290,
	"./ml.js": 290,
	"./mr": 291,
	"./mr.js": 291,
	"./ms": 292,
	"./ms-my": 293,
	"./ms-my.js": 293,
	"./ms.js": 292,
	"./mt": 294,
	"./mt.js": 294,
	"./my": 295,
	"./my.js": 295,
	"./nb": 296,
	"./nb.js": 296,
	"./ne": 297,
	"./ne.js": 297,
	"./nl": 298,
	"./nl-be": 299,
	"./nl-be.js": 299,
	"./nl.js": 298,
	"./nn": 300,
	"./nn.js": 300,
	"./pa-in": 301,
	"./pa-in.js": 301,
	"./pl": 302,
	"./pl.js": 302,
	"./pt": 303,
	"./pt-br": 304,
	"./pt-br.js": 304,
	"./pt.js": 303,
	"./ro": 305,
	"./ro.js": 305,
	"./ru": 115,
	"./ru.js": 115,
	"./sd": 306,
	"./sd.js": 306,
	"./se": 307,
	"./se.js": 307,
	"./si": 308,
	"./si.js": 308,
	"./sk": 309,
	"./sk.js": 309,
	"./sl": 310,
	"./sl.js": 310,
	"./sq": 311,
	"./sq.js": 311,
	"./sr": 312,
	"./sr-cyrl": 313,
	"./sr-cyrl.js": 313,
	"./sr.js": 312,
	"./ss": 314,
	"./ss.js": 314,
	"./sv": 315,
	"./sv.js": 315,
	"./sw": 316,
	"./sw.js": 316,
	"./ta": 317,
	"./ta.js": 317,
	"./te": 318,
	"./te.js": 318,
	"./tet": 319,
	"./tet.js": 319,
	"./th": 320,
	"./th.js": 320,
	"./tl-ph": 321,
	"./tl-ph.js": 321,
	"./tlh": 322,
	"./tlh.js": 322,
	"./tr": 323,
	"./tr.js": 323,
	"./tzl": 324,
	"./tzl.js": 324,
	"./tzm": 325,
	"./tzm-latn": 326,
	"./tzm-latn.js": 326,
	"./tzm.js": 325,
	"./uk": 38,
	"./uk.js": 38,
	"./ur": 327,
	"./ur.js": 327,
	"./uz": 328,
	"./uz-latn": 329,
	"./uz-latn.js": 329,
	"./uz.js": 328,
	"./vi": 330,
	"./vi.js": 330,
	"./x-pseudo": 331,
	"./x-pseudo.js": 331,
	"./yo": 332,
	"./yo.js": 332,
	"./zh-cn": 333,
	"./zh-cn.js": 333,
	"./zh-hk": 334,
	"./zh-hk.js": 334,
	"./zh-tw": 335,
	"./zh-tw.js": 335
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 430;

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Loader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var Loader = (function () {
    function Loader(loadingCtrl, loc) {
        this.loadingCtrl = loadingCtrl;
        this.loc = loc;
        this.calls = [];
    }
    Loader.prototype.presentLoading = function () {
        this.calls.push(1);
        if (this.calls.length > 1) {
            return Promise.resolve();
        }
        ;
        this.loader = this.loadingCtrl.create({
            content: this.loc.dic.mobile.Wait,
        });
        return this.loader.present();
    };
    Loader.prototype.stopLoading = function () {
        var _this = this;
        setTimeout(function () {
            _this.calls.pop();
            if (_this.calls.length == 0) {
                try {
                    _this.loader.dismiss();
                }
                catch (e) {
                    console.log('<Loader> error in loader:', e);
                    console.log('<Loader> this.loader:', _this.loader);
                }
            }
        }, 300);
        return Promise.resolve();
    };
    return Loader;
}());
Loader = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__localization__["a" /* Localization */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__localization__["a" /* Localization */]])
], Loader);

//# sourceMappingURL=loader.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TaskItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Contracts_Item_Item__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_arraySort__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_consts__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_user__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_access__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_selecteditem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_loader__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_images__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils_localization__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};













var TaskItem = (function () {
    function TaskItem(platform, navCtrl, images, loc, loaderctrl, events, viewCtrl, loadingCtrl, toastCtrl, access, selectedItem, navParams, http, user) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.images = images;
        this.loc = loc;
        this.loaderctrl = loaderctrl;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.access = access;
        this.selectedItem = selectedItem;
        this.navParams = navParams;
        this.http = http;
        this.user = user;
        this.historyToggle = false;
        this.typingComment = false;
        this.siteUrl = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */];
        this.task = navParams.data.item;
        this.Status = navParams.data.item.OData__Status || 'Done';
        this.ContentType = navParams.data.item.TaskType || navParams.data.item.ContentType.Name || "undefined";
        this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
        this.startDate = navParams.data.item.StartDate_view;
        this.deadLine = navParams.data.item.TaskDueDate_view || navParams.data.item.DueDate_view;
        this.assignetTo = navParams.data.item.AssignetToEmail ? { Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : { Email: navParams.data.item.ExecutorEmail, Title: navParams.data.item.NameExecutor };
        this.taskAuthore = navParams.data.item.TaskAuthore || { EMail: navParams.data.item.AthoreEmail, Title: navParams.data.item.NameAuthore };
        this.getTaskHistory();
        this.getConnectedDoc();
        access.getDigestValue().then(function (digest) { return _this.digest = digest; });
        access.getToken().then(function (token) { return _this.access_token = token; });
    }
    TaskItem.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.dismiss(); return false; }, 100);
        if (this.footer)
            this.scrollHeight = this.footer.nativeElement.offsetTop - this.footer.nativeElement.offsetHeight - this.middlelabel.nativeElement.offsetTop - this.middlelabel.nativeElement.offsetHeight + "px";
        else
            this.scrollHeight = this.middlelabel.nativeElement.offsetParent.offsetHeight - this.middlelabel.nativeElement.offsetTop - this.middlelabel.nativeElement.offsetHeight - 56 + "px";
    };
    TaskItem.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.dismiss(); return false; }, 100);
    };
    TaskItem.prototype.ionViewCanLeave = function () {
        var _this = this;
        this.platform.registerBackButtonAction(function (e) { _this.platform.exitApp(); return false; }, 100);
    };
    TaskItem.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    TaskItem.prototype.toWorkTask = function () {
        var _this = this;
        this.loaderctrl.presentLoading();
        var data = {
            "__metadata": {
                "type": "SP.Data.LSTasksListItem"
            },
            OData__Status: 'In Progress',
            AssignetToEmail: this.user.getEmail(),
            AssignetToTitle: this.user.getUserName(),
            AssignedToId: this.user.getId()
        };
        Promise.all([this.writeToHistoryAfterTaskGet(), this.updateTaskData(this.task.Id, data)])
            .then(function (resdata) {
            console.log('<TaskItem> toWorkTask');
            _this.events.publish('task:checked');
            _this.events.publish('task:towork');
            _this.loaderctrl.stopLoading().then(function () { _this.dismiss(); });
        })
            .catch(function (err) {
            console.log('<TaskItem> toWorkTask error', err);
            _this.showToast(_this.loc.dic.mobile.OperationError);
            _this.loaderctrl.stopLoading().then(function () { _this.dismiss(); });
        });
    };
    TaskItem.prototype.cancelTask = function () {
        this.loaderctrl.presentLoading();
        if (this.ContentType == 'LSTaskAppruve' || this.ContentType == 'LSTaskAgreement')
            this.doneTask('Back');
        if (this.ContentType == 'LSTaskPreparetion')
            this.doneTask('RefuseTask');
    };
    TaskItem.prototype.executeTask = function () {
        var _this = this;
        this.loaderctrl.presentLoading();
        if (this.ContentType == 'LSTaskResolution') {
            this.сheckResolution()
                .then(function (res) {
                if (res.json().d.results.length !== 0) {
                    _this.doneTask('Done');
                }
                else {
                    _this.showToast(_this.loc.dic.Alert28);
                    _this.loaderctrl.stopLoading();
                }
            })
                .catch(function (error) {
                console.log('<TaskItem> checkResolution error:', error);
                _this.showToast(_this.loc.dic.Alert28);
                _this.loaderctrl.stopLoading();
            });
        }
        else {
            this.doneTask('Done');
        }
    };
    TaskItem.prototype.doneTask = function (taskResult) {
        var _this = this;
        var data = {
            "__metadata": {
                "type": "SP.Data.LSTasksListItem"
            },
            OData__Status: 'Done',
            OData__Comments: this.coments.value,
            TaskResults: taskResult
        };
        this.task.TaskResults = taskResult;
        Promise.all([this.updateTaskData(this.task.Id, data)])
            .then(function () {
            return _this.writeToHistoryAfterTaskDone();
        })
            .then(function () {
            console.log('<TaskItem> done Task');
            _this.events.publish('task:checked');
            _this.events.publish('task:doneTask', _this.task);
            _this.loaderctrl.stopLoading().then(function () { _this.dismiss(); });
        })
            .catch(function (err) {
            console.log('<TaskItem> doneTask error', err);
            _this.showToast(_this.loc.dic.mobile.OperationError);
            _this.loaderctrl.stopLoading().then(function () { _this.dismiss(); });
        });
    };
    TaskItem.prototype.writeToHistoryAfterTaskDone = function () {
        var EvanteDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"]().format("YYYY-MM-DD HH:mm:ss");
        var StartDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.startDate).format("DD.MM.YYYY HH:mm:ss");
        var DueDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.TaskDueDate).format("DD.MM.YYYY");
        var taskEvent = this.loc.dic.Alert60;
        var EventType = 'EventDoneTask';
        if (this.ContentType == 'LSTaskAppruve') {
            if (this.task.TaskResults == 'Back') {
                taskEvent = this.loc.dic.Alert66;
                EventType = 'EventBackTask';
            }
            else {
                taskEvent = this.loc.dic.Alert62;
            }
        }
        if (this.ContentType == 'LSSTaskAdd') {
            EventType = 'EventDoneTask EventAddTask';
        }
        if (this.task.TaskResults == 'Delegate') {
            taskEvent = this.user.getUserName() + " " + this.loc.dic.Alert67;
            EventType = 'EventDelegateTask';
        }
        var StateInRouteData = {
            sysIDList: this.task.sysIDList,
            sysIDItem: this.task.sysIDItem,
            EventTypeUser: EventType,
            itemData: {
                ItemId: this.task.sysIDItem,
                ListID: this.task.sysIDList,
                ItemTitle: "-",
                ListTitle: "-",
                EventType: 'Task'
            },
            HistoryArray: [{
                    EventType: EventType,
                    Event: taskEvent,
                    NameExecutor: this.user.getUserName(),
                    NameAuthore: this.taskAuthore.Title,
                    TaskTitle: this.Title,
                    StartDate: StartDate,
                    DueDate: DueDate,
                    StartDateSort: __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.StartDate).format("YYYYMMDD"),
                    DueDateSort: __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.TaskDueDate).format("YYYYMMDD"),
                    EvanteDate: EvanteDate,
                    Comments: this.coments.value,
                    TaskType: this.ContentType,
                    TaskResult: this.task.TaskResults,
                    EndTask: '',
                    ExecutorEmail: this.user.getEmail(),
                    AthoreEmail: this.taskAuthore.EMail,
                    ItemId: this.task.sysIDItem,
                    ListID: this.task.sysIDList,
                    TaskID: this.task.ID
                }],
            HistoryType: 'HistoryDataForUser'
        };
        var transitTaskData = {
            Action: 'TaskDone',
            ListID: this.task.sysIDList,
            ItemID: this.task.sysIDItem,
            Type: 'Task',
            DataSource: {
                TaskResults: this.task.TaskResults,
                CurentTaskID: this.task.Id,
                RelateListId: this.task.sysIDList,
                RelateItem: this.task.sysIDItem,
                Alert58: this.loc.dic.Alert58,
                StateID: this.task.StateID
            }
        };
        return Promise.all([this.updateTransitTask(transitTaskData), this.updateTransitHistory(StateInRouteData), this.updateTransitHistory(StateInRouteData, 'TaskAndDocHistory')])
            .then(function () {
            // return this.startWriteToHistory();
        })
            .catch(function (err) {
            console.log('<TaskItem> writeToHistoryAfterTaskDone error', err);
            throw new Error('writeToHistoryAfterTaskDone error');
        });
    };
    TaskItem.prototype.writeToHistoryAfterTaskGet = function () {
        var EvanteDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"]().format("YYYY-MM-DD HH:mm:ss"); //2017-06-01 04:32:35
        var StartDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.StartDate).format("DD.MM.YYYY HH:mm:ss");
        var DueDate = __WEBPACK_IMPORTED_MODULE_3_moment__["utc"](this.task.TaskDueDate).format("DD.MM.YYYY");
        var StateInRouteData = {
            sysIDList: this.task.sysIDList,
            sysIDItem: this.task.sysIDItem,
            EventTypeUser: 'TaskInWork',
            itemData: {
                ItemId: this.task.sysIDItem,
                ListID: this.task.sysIDList,
                ItemTitle: "-",
                ListTitle: "-",
                EventType: 'Task'
            },
            HistoryArray: [{
                    EventType: 'EventInWorkTask',
                    Event: this.loc.dic.Alert59,
                    NameExecutor: this.user.getUserName(),
                    NameAuthore: this.taskAuthore.Title,
                    TaskTitle: this.Title,
                    StartDate: StartDate,
                    DueDate: DueDate,
                    EvanteDate: EvanteDate,
                    Comments: this.coments.value,
                    ExecutorEmail: this.user.getEmail(),
                    AthoreEmail: this.taskAuthore.EMail,
                    TaskID: this.task.Id
                }],
            HistoryType: 'HistoryDataForUser'
        };
        return Promise.all([this.updateTransitHistory(StateInRouteData), this.updateTransitHistory(StateInRouteData, 'TaskAndDocHistory')])
            .then(function () {
            //return this.startWriteToHistory("WriteHistory");
        })
            .catch(function (err) {
            console.log('<TaskItem> writeToHistory error', err);
            throw new Error('writeToHistory error');
        });
    };
    TaskItem.prototype.сheckResolution = function () {
        var url = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ID,sysIDList,ContentTypeId,Title,TaskDescription,StartDate,sysTaskLevel,TaskResults,sysIDParentMainTask,TaskDueDate,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore,AssignedTo,ContentType&$filter=(sysIDItem eq '" + this.task.sysIDItem + "') and (sysIDList eq '" + this.task.sysIDList + "') and (ContentType eq 'LSResolutionTaskToDo') and (TaskAuthore/Title eq '" + encodeURI(this.taskAuthore.Title) + "')";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(url, options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */]).toPromise();
    };
    TaskItem.prototype.updateTransitTask = function (taskData) {
        taskData.DataSource.UserLang = 'LS' + this.user.locale.toUpperCase();
        taskData.DataSource.Alert57 = this.loc.dic.Alert57;
        taskData.DataSource.Alert58 = this.loc.dic.Alert58;
        taskData.DataSource.Alert60 = this.loc.dic.Alert60;
        taskData.DataSource.Alert62 = this.loc.dic.Alert62;
        taskData.DataSource.Alert66 = this.loc.dic.Alert66;
        var body = {
            '__metadata': {
                type: "SP.Data.LSDocsListTransitTasksItem"
            },
            Title: taskData.Action,
            ListID: taskData.ListID,
            ItemID: taskData.ItemID,
            Type: taskData.Type,
            DataSource: JSON.stringify(taskData.DataSource)
        };
        var url = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSDocsListTransitTasks')/Items";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ "Authorization": (window.localStorage.getItem('OnPremise') ? "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) : "Bearer " + this.access_token), "X-RequestDigest": this.digest, 'X-HTTP-Method': 'POST', 'IF-MATCH': '*', 'Accept': 'application/json;odata=verbose', "Content-Type": "application/json;odata=verbose" });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(url, JSON.stringify(body), options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */]).toPromise();
    };
    TaskItem.prototype.updateTransitHistory = function (routeData, historyType) {
        var url = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSDocsListTransitHistory')/Items";
        var body = {
            "__metadata": {
                type: "SP.Data.LSDocsListTransitHistoryItem"
            },
            Title: historyType ? historyType : routeData.HistoryType,
            ListID: routeData.sysIDList,
            ItemID: routeData.sysIDItem,
            Type: routeData.EventTypeUser,
            historyData: JSON.stringify(routeData.HistoryArray),
            itemData: JSON.stringify(routeData.itemData)
        };
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ "Authorization": (window.localStorage.getItem('OnPremise') ? "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) : "Bearer " + this.access_token), "X-RequestDigest": this.digest, 'X-HTTP-Method': 'POST', 'IF-MATCH': '*', 'Accept': 'application/json;odata=verbose', "Content-Type": "application/json;odata=verbose" });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(url, JSON.stringify(body), options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */]).toPromise();
    };
    TaskItem.prototype.updateTaskData = function (id, data) {
        var url = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSTasks')/Items(" + id + ")";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ "Authorization": (window.localStorage.getItem('OnPremise') ? "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) : "Bearer " + this.access_token), "X-RequestDigest": this.digest, 'X-HTTP-Method': 'MERGE', 'IF-MATCH': '*', 'Accept': 'application/json;odata=verbose', "Content-Type": "application/json;odata=verbose" });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(url, JSON.stringify(data), options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */]).toPromise();
    };
    TaskItem.prototype.getTaskHistory = function () {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '" + (this.task.sysIDItem || this.task.ItemId) + "') and (Title eq '" + (this.task.sysIDList || this.task.ListID) + "') and (ItemName eq 'Task')";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            _this.history = res.json().d.results[0] || {};
            if (_this.history && _this.history.propertyIsEnumerable('TaskHistory')) {
                _this.taskHistory = JSON.parse(_this.history.TaskHistory).map(function (task) {
                    task.EvanteDate = task.EvanteDate.substring(0, 10).split('.').reverse().join('-') + task.EvanteDate.substring(10, task.EvanteDate.length);
                    return task;
                });
            }
        })
            .catch(function (error) {
            console.error('<TaskItem> Loading History error!', error);
            _this.history = [];
        });
    };
    TaskItem.prototype.getConnectedDoc = function () {
        var _this = this;
        var listGet = __WEBPACK_IMPORTED_MODULE_6__utils_consts__["k" /* siteUrl */] + "/_api/Web/Lists(guid'" + (this.task.sysIDList || this.task.ListID) + "')/items(" + (this.task.sysIDItem || this.task.ItemId) + ")";
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({ 'Accept': 'application/json;odata=verbose', 'Authorization': "Basic " + btoa(window.localStorage.getItem('username') + ':' + window.localStorage.getItem('password')) });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({ headers: headers });
        this.http.get(listGet, options).timeout(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["l" /* timeoutDelay */]).retry(__WEBPACK_IMPORTED_MODULE_6__utils_consts__["h" /* retryCount */])
            .toPromise()
            .then(function (res) {
            _this.connectedItem = res.json().d;
        })
            .catch(function (error) {
            console.log('There is no connected doc', error);
        });
    };
    TaskItem.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: (typeof message == 'string') ? message : message.toString().substring(0, (message.toString().indexOf('&#x') || message.toString().length)),
            position: 'bottom',
            showCloseButton: true,
            duration: 9000
        });
        toast.present();
    };
    TaskItem.prototype.showHistory = function () {
        if (this.historyToggle) {
            this.historyToggle = false;
            return;
        }
        this.historyToggle = true;
    };
    TaskItem.prototype.openConnecedItem = function () {
        this.selectedItem.set(this.connectedItem, this.task.sysIDList || this.task.ListID);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__Contracts_Item_Item__["a" /* Item */], {
            item: this.connectedItem,
            listGUID: this.task.sysIDList || this.task.ListID
        });
    };
    TaskItem.prototype.onFocus = function () {
        this.typingComment = true;
    };
    TaskItem.prototype.onBlur = function () {
        this.typingComment = false;
    };
    return TaskItem;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('coments'),
    __metadata("design:type", Object)
], TaskItem.prototype, "coments", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('myFooter'),
    __metadata("design:type", Object)
], TaskItem.prototype, "footer", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])('middlelabel'),
    __metadata("design:type", Object)
], TaskItem.prototype, "middlelabel", void 0);
TaskItem = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'TaskItem',
        providers: [__WEBPACK_IMPORTED_MODULE_5__utils_arraySort__["a" /* ArraySortPipe */]],template:/*ion-inline-start:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/TaskItem/TaskItem.html"*/'<ion-header>\n  <ion-toolbar>\n    <ion-title>\n      <ion-slides>\n         <ion-slide>\n            {{Title}}\n         </ion-slide>\n      </ion-slides>\n    </ion-title>\n    <ion-buttons start>\n      <button ion-button (click)="dismiss()">\n        <ion-icon name="close"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-label [ngClass]="typingComment? \'inactive\' : \'active\'">\n    <div class="line" >\n       <ion-icon name="ios-return-left"></ion-icon>\n       <div class="left">{{loc.dic.HistoryTaskAuthor}}</div>\n       <div class="right">\n         <div class="userTag">\n           <ion-avatar item-left>\n             <img src="{{images.getImage(taskAuthore.EMail || \'undefined\')}}" >\n             <!-- {{siteUrl}}/_layouts/15/userphoto.aspx?size=S&accountname={{taskAuthore.EMail}}" /> -->\n           </ion-avatar>\n           <span>{{taskAuthore.Title}}</span>\n         </div>\n       </div>\n    </div>\n    <div class="line">\n       <ion-icon name="ios-return-right"></ion-icon>\n       <div class="left">{{loc.dic.HistoryTaskExecutor}}</div>\n       <div class="right">\n         <div class="userTag">\n           <ion-avatar item-left>\n             <img src="{{images.getImage(assignetTo.Email || \'undefined\')}}" >\n             <!-- {{siteUrl}}/_layouts/15/userphoto.aspx?size=S&accountname={{assignetTo.Email}}" /> -->\n           </ion-avatar>\n           <span>{{assignetTo.Title}}</span>\n         </div>\n       </div>\n    </div>\n    <div class="line">\n       <ion-icon name="ios-calendar-outline"></ion-icon>\n       <div class="left">{{loc.dic.HistoryTaskStart}}</div>\n       <div class="right">{{startDate}}</div>\n    </div>\n    <div class="line">\n       <ion-icon name="ios-timer-outline"></ion-icon>\n       <div class="left">{{loc.dic.HistoryTaskDuet}}</div>\n       <div class="right">{{deadLine}}</div>\n    </div>\n</ion-label>\n<ion-label #middlelabel class="middlelabel" >\n  <!--<button ion-button color="primary" clear><ion-icon name="list"></ion-icon></button>-->\n  <button ion-button color="primary" (click)="showHistory()" clear><ion-icon name="calendar"></ion-icon></button>\n  <button *ngIf="task.sysIDItem || task.ItemId"  [disabled]="!connectedItem" ion-button color="primary" (click)="openConnecedItem()" clear><ion-icon name="document"></ion-icon>{{loc.dic.RelateDoc}}</button>\n</ion-label>\n<ion-scroll #scrollMy [ngClass]="\'scrollMy\'" [style.height]="scrollHeight" scrollY="true">\n  <ion-list *ngIf="historyToggle" no-lines class="history" [ngClass]="historyToggle? \'active\' : \'\' " style="z-index: -1;padding-bottom: 5px;">\n          <ion-item class="task" *ngFor="let task of taskHistory | arraySort:\'-EvanteDate\'" >\n              <h3>\n                  <div class="marker"></div>\n                  <span>{{task.Event}}</span> <span>{{task.TaskTitle}}</span> {{loc.dic.Alert38}}\n                  <span class="user">{{task.NameExecutor}}</span> {{loc.dic.Alert39}} <span class="user">{{task.NameAuthore}}</span>\n                  <span> {{loc.dic.Alert40}} </span>\n                  <span>{{task.DueDate}}</span>\n              </h3>\n              <p>{{task.EvanteDate}}</p>\n          </ion-item>\n          <ion-item *ngIf="history && !taskHistory">\n            <h2>{{loc.dic.mobile.Empty}}</h2>\n          </ion-item>\n          <ion-item *ngIf="!history">\n            <h2>{{loc.dic.mobile.Downloading}}</h2>\n          </ion-item>\n  </ion-list>\n  <ion-item *ngIf="(Status != \'Done\')" [ngClass]="historyToggle? \'inactive\' : \'active\'">\n      <ion-label floating>{{loc.dic.Alert37}}</ion-label>\n      <ion-textarea #coments rows="6" (blur)="onBlur()" (focus)="onFocus()" ></ion-textarea>\n  </ion-item>\n</ion-scroll>\n</ion-content>\n\n<ion-footer #myFooter *ngIf="Status != \'Done\'">\n  <ion-toolbar>\n    <ion-buttons full>\n      <ion-grid>\n        <ion-row>\n          <ion-col *ngIf="Status == \'Not Started\'" >\n             <button  clear ion-button (click)="toWorkTask()">\n                <ion-icon name="md-arrow-down"></ion-icon>\n                <div>{{loc.dic.Alert31}}</div>\n            </button>\n         </ion-col>\n         <ion-col *ngIf="task.sysTaskLevel == 1 && (ContentType == \'LSTaskPreparetion\' || ContentType == \'LSTaskAppruve\' || ContentType ==\'LSTaskAgreement\' ) ">\n            <button  clear ion-button (click)="cancelTask()">\n               <ion-icon name="md-close"></ion-icon>\n               <div *ngIf="ContentType == \'LSTaskPreparetion\'">\n                  {{loc.dic.Cencel}}\n               </div>\n               <div *ngIf="ContentType == \'LSTaskAppruve\' || ContentType == \'LSTaskAgreement\'">\n                  {{loc.dic.Alert32}}\n               </div>\n               <!-- <div *ngIf="ContentType != \'LSTaskToRegistrate\' && assignetTo.Email == user.getEmail() ">\n                  Делегировать\n               </div> -->\n            </button>\n         </ion-col>\n         <!-- <ion-col *ngIf="ContentType == \'LSTaskToRegistrate\'">\n           <button  clear ion-button (click)="addTask()">\n               <ion-icon name="arrow-down"></ion-icon>\n               <div>Новая подзадача</div>\n           </button>\n        </ion-col> -->\n         <ion-col>\n            <button  clear ion-button (click)="executeTask()">\n               <ion-icon name="md-checkmark"></ion-icon>\n               <div *ngIf="ContentType == \'LSTaskAppruve\'">\n                  {{loc.dic.Approve}}\n               </div>\n               <div *ngIf="ContentType != \'LSTaskAppruve\'">\n                  {{loc.dic.Alert35}}\n               </div>\n            </button>\n         </ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/pavlezt/Projects/Ionic2LSDocs/src/pages/MyTasks/TaskItem/TaskItem.html"*/
    }),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_11__utils_images__["a" /* Images */])), __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_12__utils_localization__["a" /* Localization */])), __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__utils_loader__["a" /* Loader */])), __param(9, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__utils_access__["a" /* Access */])), __param(10, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__utils_selecteditem__["a" /* SelectedItem */])), __param(12, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */])), __param(13, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__utils_user__["a" /* User */])),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_11__utils_images__["a" /* Images */], __WEBPACK_IMPORTED_MODULE_12__utils_localization__["a" /* Localization */], __WEBPACK_IMPORTED_MODULE_10__utils_loader__["a" /* Loader */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_8__utils_access__["a" /* Access */], __WEBPACK_IMPORTED_MODULE_9__utils_selecteditem__["a" /* SelectedItem */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_7__utils_user__["a" /* User */]])
], TaskItem);

//# sourceMappingURL=TaskItem.js.map

/***/ })

},[346]);
//# sourceMappingURL=main.js.map