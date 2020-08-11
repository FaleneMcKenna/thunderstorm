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


class WithingsModule_Class
	extends Module<Config> {
	private httpClient = new HttpClient("https://wbsapi.withings.net/v2");
	private db!: DatabaseWrapper;

	protected init(): void {
		const token = this.config.accessToken;
		if (!token)
			throw new ImplementationMissingException('Missing Access Token in the config. Please add and then restart the server');

		this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`})
		this.db = FirebaseModule.createAdminSession().getDatabase();
	}

	// createBody = () => {
	// 	return {
	// 		"status": 0,
	// 		"body": {
	// 			"series": [
	// 				{
	// 					"deviceid": "string",
	// 					"model": 0,
	// 					"ecg": {
	// 						"signalid": 0,
	// 						"afib": 0
	// 					},
	// 					"bloodpressure": {
	// 						"diastole": 0,
	// 						"systole": 0
	// 					},
	// 					"heart_rate": 0,
	// 					"timestamp": 0
	// 				}
	// 			],
	// 			"offset": 0,
	// 			"more": true
	// 		}
	// 	};
	// };
	getHeartRequest = async () => {
		const response = await this.httpClient.get('/heart?action=list');
		await this.db.set('/data/heart/response',response);
		return response};
	getSleepRequest = async ()/*: Promise<ResponseGetSleep>*/ => {
		const response = await this.httpClient.get('/sleep?action=get');
		await this.db.set('/data/sleep/response',response);
		return response
	};

	getSleepSummaryRequest = async () => {
		const response = await this.httpClient.get('/sleep?action=getsummary');
		await this.db.set('/data/sleep/summary/response',response);
		return response
	};

	getMeasActivityRequest = async () => {
		const response = await this.httpClient.get('/measure?action=getactivity');
		await this.db.set('/data/meas/activity/response',response);
		return response
	};

	getMeasIntraDayActivityRequest = async () => {
		const response = await this.httpClient.get('/measure?action=getintradayactivity');
		await this.db.set('/data/meas/intradayactivity/response',response);
		return response
	};
	getMeasWorkoutActivityRequest = async () => {
		const response = await this.httpClient.get('/measure?action=getworkouts');
		await this.db.set('/data/meas/workout/response',response);
		return response
	};

}

export const WithingsModule = new WithingsModule_Class();