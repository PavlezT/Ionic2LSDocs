//NOT CHANGE LOWER
export const timeoutDelay = 3500;
export const retryCount = 4;
export const swipeDelay = 300;
export const MSOnlineSts = 'https://login.microsoftonline.com/extSTS.srf';
export const FormsPath = '_forms/default.aspx?wa=wsignin1.0';
export const Online_saml = 'online_saml.tmpl';
export const Online_saml_path = 'www/assets/templates/';
export const client_id = '042a3cb4-c140-4455-ab2f-e46f149311dc';
export const secret = 'uHR0hglMdSGYWhkr1UlykNf0BOzmHIeGa6+7vIrlPTI=';
export const resource = '00000003-0000-0ff1-ce00-000000000000';
//On Premise
export const OnPremise_keyPath = 'www/assets/templates/';
export const Key = 'spaddin.key';
export const shaThumbprint = '3FNtei0NfX9PyzHRxwXeKntomcY';
export const isser_id = '9e9e46c4-6329-4990-a0b8-13b87b3ba56a';
export const access_tokenOnPremise = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IjNGTnRlaTBOZlg5UHl6SFJ4d1hlS250b21jWSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbHNkb2NzLmV4dDUubGl6YXJkLm5ldC51YUAxYTgxMWIyMi04YjJlLTQ1M2MtODE5MS0wYmJjMDM3MWRlOGEiLCJpc3MiOiI5ZTllNDZjNC02MzI5LTQ5OTAtYTBiOC0xM2I4N2IzYmE1NmFAMWE4MTFiMjItOGIyZS00NTNjLTgxOTEtMGJiYzAzNzFkZThhIiwibmFtZWlkIjoiMDQyYTNjYjQtYzE0MC00NDU1LWFiMmYtZTQ2ZjE0OTMxMWRjQDFhODExYjIyLThiMmUtNDUzYy04MTkxLTBiYmMwMzcxZGU4YSIsIm5iZiI6IjExNzI0OTA4NzYiLCJleHAiOiIxODAzMjEwODc2IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOnRydWUsImlhdCI6MTQ4Nzg1MDg3Nn0.UXt30oEuAFKx4oLE7IQ7ZrWF15NtcsCUS9NEJljjidDYBGWWwfomL7fAJVa9JwGUuu7r8_V2fb2uTfkAgAa1WGP4JSJS6lkUPqzrx1oTnHLhfPbwWwVJzFOnEEKT2URpLc1oox1AeENPE7JE0mBVOpFJ6G34rlwAU_HRdTx7jZVM20axPP5PkqO3nDuV8ZpZXOUb7-qAiQ9e8s0VdIzsTO5FKS6gQ4gKwQJYYaaOz2Uotc_I6hvTqhT3xfTe1frRxq29T2C3CPUcE7Hb2N_dun9xYdXV3wZvzp-nRtIBOgTwk6CSYAa8FUnukH8WhzO-WrBtWg_qjJccKd5rg7pBYtxL233e4npslJrcQ7cH5YOvgihq9iSfuPWi6uggzmi0p__fyy2BbYKVWKByAe-E3ocWeIA1sz2JDHe5a1MCJxajwrN2xx4xi4MqI3iUh3upPhGtaXmbAx0M41cG04qHND0Hr18d45BhqhHWAq5T6ALfsb2C3mVZz4cRtRNz53Yok0DEqu6_aMPjDmKaz3nGGJCmuvZJUCTvAZq_Ka_crVi_n2X10LTNH0CBjW_Jr7PZnKTGiDlftl8wPPT7BHpJ91XPLg24yZccTs_5JPNnppw0kibg-a6hutKcGjvD4qgD59FOpGEIcrhfT_lCXpVUPc1HuBUSxpij0Ty6RIW_WeI';

//update for special site
export let siteUrl ;//= 'https://qalizard.sharepoint.com/sites/LSDocs';//'https://lizardsoftcom.sharepoint.com/sites/ls-net';
// export const site_realm = '5dab8cdb-5d81-439b-93dd-0dec67231dc2';//'c65ff4dd-5d90-4eee-a7b3-febe4438d60f';
// export const OnPremise = false;

export function setUrl(url:string): void {
    siteUrl = url;
}

// export const AdfsOnlineRealm = 'urn:federation:MicrosoftOnline';
// export const OnlineUserRealmEndpoint = 'https://login.microsoftonline.com/GetUserRealm.srf';

//isserId lsdocs 26bab6fd-6d83-4f7b-8a9c-54195697d012
