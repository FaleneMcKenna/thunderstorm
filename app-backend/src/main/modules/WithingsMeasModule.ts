import {
    Module,
} from "@nu-art/ts-common";
import {HttpClient} from "../to-move/HttpClient";
import {
    DatabaseWrapper,
    FirebaseModule
} from "@nu-art/firebase/backend";
import {response} from "express";

class WithingsMeasModule {
    private httpClient = new HttpClient("https://");
    private db!: DatabaseWrapper;

    createBody = () => {
        return {
            'grant_type': 'authorization_code',
            'client_id': '',
            'client_secret':'',
            'code': '',
            'redirect_uri': ''
        };
    };

    getAuth = async () => {
        const response = await this.httpClient.get('account.withings.com/oauth2_user/authorize2', {response_type: 'code', client_id: 'client_id',  state: '', scope: 'user.metrics',  redirect_uri: '"https%3A%2F%2Fus-central1-local-falene-ts.cloudfunctions.net%2Fapi"'});
        await this.db.set('/auth/response', response);
        return response
    };

    postRefresh = () => {
        const rsp = this.httpClient.post('wbsapi.withings.net/oauth2/token', {data: response.json})
        return rsp

    };

}
