/*
 * Permissions management system, define access level for each of
 * your server apis, and restrict users by giving them access levels
 *
 * Copyright (C) 2020 Adam van der Kruk aka TacB0sS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    ImplementationMissingException,
    Module,
} from "@nu-art/ts-common";
import {HttpClient} from "../to-move/HttpClient";
import {FirebaseModule, DatabaseWrapper} from "@nu-art/firebase/backend";

type Config = ClientIds & {
    accessToken: string
    refreshToken: string
}

export type WithingsAuthCode = {
    grant_type: "code"
    client_id: string
    state: string
    scope: string
    redirect_uri: string
}

type ClientIds = {
    client_id: string
    client_secret: string
}

export type WithingsAccessToken = ClientIds & {
    grant_type: "authorization_code"
    code: WithingsAuthCode
    redirect_uri: string
};

export type WithingsRefreshToken = ClientIds & {
    grant_type: "refresh_token"
    refresh_token: string
};

export type ResponseGetMeas = {};

class WithingsMeasModule_Class
    extends Module<Config> {
    private httpClient = new HttpClient("https://wbsapi.withings.net/measure?action=getmeas");
    private db!: DatabaseWrapper;

    protected init(): void {
        const token = this.config.accessToken;
        if (!token)
            throw new ImplementationMissingException('Missing access token in the config. Please add and restart the server');

        this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`})
        this.db = FirebaseModule.createAdminSession().getDatabase();
    }

    createBody = () => {
        return {
            "status": 0,
            "body": {
                "updatetime": "string",
                "timezone": "string",
                "measuregrps": [
                    {
                        "grpid": 0,
                        "attrib": 0,
                        "date": 0,
                        "created": 0,
                        "category": 0,
                        "deviceid": "string",
                        "measures": [
                            {
                                "value": 0,
                                "type": 0,
                                "unit": 0,
                                "algo": 0,
                                "fm": 0,
                                "fw": 0
                            }
                        ],
                        "comment": "string"
                    }
                ],
                "more": true,
                "offset": 0
            }
        };
    };


    getMeasRequest = async () => {
        const resp = await this.httpClient;
        await this.db.set('/data/meas/response',resp);
        return resp
    };

}

export const WithingsMeasModule = new WithingsMeasModule_Class();