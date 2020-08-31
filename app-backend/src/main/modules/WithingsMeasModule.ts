// import {
//     ImplementationMissingException,
//     Module,
// } from "@nu-art/ts-common";
// import {HttpClient} from "../to-move/HttpClient";
// import {
//     DatabaseWrapper,
//     FirebaseModule
// } from "@nu-art/firebase/backend";
//
// class WithingsMeasModule
//     extends Module<Config> {
//     private httpClient = new HttpClient("https://wbsapi.withings.net");
//     private db!: DatabaseWrapper;
//
//
//     getAuth = async () => {
//         const response = await this.httpClient.get('https://account.withings.com/oauth2_user/authorize2', {response_type: 'code', client_id: 'client_id',  state: '', scope: 'user.metrics',  redirect_uri: '[your function api endpoint]/v1/register/auth'});
//         await this.db.set('/auth/response', response);
//         return response
//     };
//
// }
// export const WithingsMeasModule = new WithingsMeasModule_Class();
