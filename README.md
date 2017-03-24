# Ionic2LSDocs
mobile native app for LSDocs

git clone https://github.com/PavlezT/Ionic2LSDocs.git

cordova platform add android@4
//to specificate that cordova need 22 target build tools

cordova requirements 
//check android sdk installed properly

ionic state reset

# Reg App
##`step 1` registering app in sharepoint
 <https://your_site_name.com/_layouts/15/appregnew.aspx>

* client-id: 0fe0384a-4e63-43fe-9b79-a3bd2491a663
* secret: hAoUjYvatXkG+dHYT8Y/eMGb2XSvplaBOLCYfAft1kw=
* name: LSMobile 
* domen: www.lsdocsthebest.com
* redirected_uri: https://www.lsdocsthebest.com

##`step 2` accept app in sharepoint
<https://your_site.sharepoint.com/_layouts/oauthauthorize.aspx?client_id=0fe0384a-4e63-43fe-9b79-a3bd2491a663&scope=Web.Read&response_type=code&redirect_uri=https://www.lsdocsthebest.com>

after confirming app rules, takes from redirected uri `code` paramentr <br>
example of redirected uri: `https://www.lsdocsthebest.com/?code=IAAAAEfwWtIn0mt7lbgmrNKuyOvHjwOQ8Gy8Jb88b1vtqk4V5mqWHRor9eRkZspQRM9dPDhqltNpuqEOMaHmKcJK-isUVRbIwIsgSEX1a4FF388PeEHuQssuREQQs4AB4VJSCLYTFSa2mSilldfkMoP2nBNGwaAOmwanRO1JD1lKC5Llpu4ittQs7YbcKU2KtSJgMn2uy9kgEDQLc6jMzaMW4F_08A0zP9vCr3r1yZe-DS8sFeNEX1QaXvnXpTTJxhPA3gZ0GihyBRiiQLwqviCouzjKiJtX_5soHyZqHIBCs06OXhoRc_cxtvs04D-7oL_uIy11ZkZlYXTFYcagT4NDp2gUgNVrycYzcUjPHMPFzZZLKIPjm5GyrQnkPm5Sym5Qgg` 
##`step 3` getting access_token from accesscontrol
###find var `site_realm` :
* watching installed apps  by <https://your_site.sharepoint.com/_layouts/15/AppPrincipals.aspx>


### generating token
make POST request to <https://accounts.accesscontrol.windows.net/site_realm/tokens/OAuth/2>

* grant_type = authorization_code
* client_id = 0fe0384a-4e63-43fe-9b79-a3bd2491a663@`site_realm`
* client_secret = hAoUjYvatXkG+dHYT8Y/eMGb2XSvplaBOLCYfAft1kw=
* code  
* redirect_uri = https://www.lsdocsthebest.com
* resource = 00000003-0000-0ff1-ce00-000000000000/`your_site_.com`@`site_realm`

![screenshot of sample](http://i.piccy.info/i9/4b9a430966706019327714a065a105a8/1484140055/144215/1107683/d1111.png)

##`step 4` adding permisions to app
<https://your_site.com/_layouts/15/appinv.aspx>

in field `Client Identifier` paste `client-id` and press `check`<br>
in `XML-request permissions` paste <br>

```xml
<AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl" />
    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl" />
</AppPermissionRequests>
```

##`step 5` refreshing token
similar to step 3, but need to change:
* grant_type = refresh_token
* delete `code`
* add `refresh_token` 

# Pratices
use Allow-Control-Allow-Origin: *  - chrome extention to awoid CORS restritions and make possible to use REST api in browser

(Device.device.uuid) ? (consts.MSOnlineSts) : ('/api' + consts.MSOnlineSts);
//cheking diveci or browser is this

###updating ionic-scripts (if webpack can`t load .json) //https://github.com/driftyco/ionic-app-scripts
npm install @ionic/app-scripts@latest --save-dev

###save session alive on IOS - change this in LSDocs/Classes/AppDelegate.m
```objective-c
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    NSData *cookiesData = [[NSUserDefaults standardUserDefaults] objectForKey:@"Cookies"];
    if ( [cookiesData length] )
    {
        NSArray *cookies = [NSKeyedUnarchiver unarchiveObjectWithData:cookiesData];
        for ( NSHTTPCookie *cookie in cookies )
            [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
    }
    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
    NSData *cookieData = [NSKeyedArchiver archivedDataWithRootObject:cookies];
    [[NSUserDefaults standardUserDefaults] setObject:cookieData forKey:@"Cookies"];
}
```
