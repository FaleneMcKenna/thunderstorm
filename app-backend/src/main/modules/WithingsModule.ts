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

type Config = ClientIds & {
	accessToken: string
	refreshToken: string
	// auth: WithingsAuthCode
	// baseUrl?: string
	// access: WithingsAccessToken
	// refresh: WithingsRefreshToken
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

export type ResponseGetHeart = {};

class WithingsModule_Class
	extends Module<Config> {
	private httpClient = new HttpClient("https://wbsapi.withings.net/v2"); //heart?action=list

	protected init(): void {
		const token = this.config.accessToken;
		if (!token)
			throw new ImplementationMissingException('Missing access token in the config. Please add and restart the server');

		this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`})
	}

	createBody = () => {
		return {
			"status": 0,
			"body": {
				"series": [
					{
						"deviceid": "string",
						"model": 0,
						"ecg": {
							"signalid": 0,
							"afib": 0
						},
						"bloodpressure": {
							"diastole": 0,
							"systole": 0
						},
						"heart_rate": 0,
						"timestamp": 0
					}
				],
				"offset": 0,
				"more": true
			}
		};
	};

	postHeartRequest = async ()/*: Promise<ResponseGetHeart>*/ => {
		const resp = await this.httpClient.get('/heart?action=list');
		console.log(resp);
		return resp
	};

	// getHeartRequest = async (measurements: string): Promise<ResponseGetHeart> => {
	//     return this.executeGetRequest(`/poc-withings/heart/${measurements}`)
	// };

}

export const WithingsModule = new WithingsModule_Class();