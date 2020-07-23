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
    Module,
} from "@nu-art/ts-common";
import {
    ApiException,
    promisifyRequest
} from "@nu-art/thunderstorm/backend"
import {HttpMethod} from "@nu-art/thunderstorm"
import {
    CoreOptions,
    Headers,
    Response,
    UriOptions
} from 'request'

type Config = {
    auth: WithingsAuthCode
    baseUrl?: string
    access: WithingsAccessToken
    refresh: WithingsRefreshToken
}

type WithingsAuthCode = {
    grant_type: "code"
    client_id: client_id
    state: string
    scope: string
    redirect_uri: string
}

type WithingsAccessToken = {
    grant_type: "authorization_code"
    client_id: client_id
    client_secret: client_secret
    code: WithingsAuthCode
    redirect_uri: string
};

type WithingsRefreshToken = {
    grant_type: "refresh_token"
    client_id: client_id
    client_secret: client_secret
    refresh_token: string

};

export type ResponseGetMeas = {
};

export class WithingsGetMeas_Class
    extends Module<Config> {
    private headers!: Headers;
    private baseUrl = "https://wbsapi.withings.net/measure?action=getmeas";

    protected init(): void {
        if (this.config?.baseUrl)
            this.baseUrl = this.config?.baseUrl;

        this.headers = this.buildHeaders(this.config.auth, true);
    }

    buildHeaders = (WithingsAccessToken, check: boolean) => {
        const headers: Headers = {
            Authorization: `Bearer ${WithingsAccessToken}`
        };

        return headers;
    };

    createBody = () => {
        return {
            "status": 0,
            "body": {
                "updatetime": "string",
                "timezone": "string",
                "measuregrps": [],
                "more": true,
                "offset": 0
            }
        };
    };

    postMeasRequest = async (): Promise<ResponseGetMeas> => {
        return this.executePostRequest('/poc-withings', this.createBody();
    };

    getMeasRequest = async (measurements: string): Promise<ResponseGetMeas> => {
        return this.executeGetRequest(`/poc-withings/${measurements}`)
    };


    private async executePostRequest(url: string, body: any) {
        const request: UriOptions & CoreOptions = {
            headers: this.headers,
            uri: `${this.baseUrl}${url}`,
            body,
            method: HttpMethod.POST,
            json: true
        };
        return this.executeRequest(request);
    }

    private async executeGetRequest(url: string, _params?: { [k: string]: string }) {
        const params = _params && Object.keys(_params).map((key) => {
            return `${key}=${_params[key]}`;
        });

        let urlParams = "";
        if (params && params.length > 0)
            urlParams = `?${params.join("&")}`;

        const request: UriOptions & CoreOptions = {
            headers: this.headers,
            uri: `${this.baseUrl}${url}${urlParams}`,
            method: HttpMethod.GET,
            json: true
        };
        return this.executeRequest(request);
    }

    private handleResponse(response: Response) {
        if (`${response.statusCode}`[0] !== '2')
            throw new ApiException(response.statusCode, response.body)

        return response.toJSON().body;
    }

    private async executeRequest(body: UriOptions & CoreOptions) {
        const response = await promisifyRequest(body, false);
        return this.handleResponse(response);
    }
}

export const WithingsGetMeas = new WithingsGetMeas_Class();