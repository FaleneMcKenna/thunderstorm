// /*
//  * Permissions management system, define access level for each of
//  * your server apis, and restrict users by giving them access levels
//  *
//  * Copyright (C) 2020 Adam van der Kruk aka TacB0sS
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// import {
//     ImplementationMissingException,
//     Module,
// } from "@nu-art/ts-common";
// import {HttpClient} from "../to-move/HttpClient";
// import {FirebaseModule, DatabaseWrapper} from "@nu-art/firebase/backend";
//
// type Config = ClientIds & {
//     accessToken: string
//     refreshToken: string
// }
//
// export type WithingsAuthCode = {
//     grant_type: "code"
//     client_id: string
//     state: string
//     scope: string
//     redirect_uri: string
// }
//
// type ClientIds = {
//     client_id: string
//     client_secret: string
// }
//
// export type WithingsAccessToken = ClientIds & {
//     grant_type: "authorization_code"
//     code: WithingsAuthCode
//     redirect_uri: string
// };
//
// export type WithingsRefreshToken = ClientIds & {
//     grant_type: "refresh_token"
//     refresh_token: string
// };
// export type CallbackURL = {
//     redirect_uri: string
// };
//
// export type ResponseGetNotify = {};
//
// class NotifyModule_Class
//     extends Module<Config> {
//     private httpClient = new HttpClient("https://wbsapi.withings.net/notify?action=");
//     //'Authorization: Bearer [access_token]' 'https://wbsapi.withings.net/notify?action=get&callbackurl=[STRING]&appli=[INT]'
//     private db!: DatabaseWrapper;
//
//     protected init(): void {
//         const token = this.config.accessToken;
//         if (!token)
//             throw new ImplementationMissingException('Missing access token in the config. Please add and restart the server');
//
//         this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`})
//         this.db = FirebaseModule.createAdminSession().getDatabase();
//     }
//
//     createBody = () => {
//         return {
//             "status": 0,
//             "body": {
//                 "profiles": [
//                     {
//                         "appli": 0,
//                         "callbackurl": "string",
//                         "expires": "string",
//                         "comment": "string"
//                     }
//                 ]
//             }
//         };
//     };
//
//     getNotifyRequest = async () => {
//         const response = await this.httpClient.get('get');
//         await this.db.set('/data/notify/response',response);
//         return response
//     };
//     getNotifyListRequest = async () => {
//         const response = await this.httpClient.get('list');
//         await this.db.set('/data/notify/list',response);
//         return response
//     };
//     getNotifySubscribeRequest = async () => {
//         const response = await this.httpClient.get('subscribe');
//         await this.db.set('/data/notify/subscribe',response);
//         return response
//     };
//     getNotifyUpdateRequest = async () => {
//         const response = await this.httpClient.get('update');
//         await this.db.set('/data/notify/update',response);
//         return response
//     };
// }
//
// export const NotifyModule = new NotifyModule_Class();