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
import {Module,} from "@nu-art/ts-common";
import {HttpClient} from "../to-move/HttpClient";
import {
	DatabaseWrapper,
	FirebaseModule,
	FirestoreCollection
} from "@nu-art/firebase/backend";
import {
	CoreOptions,
	UriOptions
} from "request";
import {ApiException} from "@nu-art/thunderstorm/backend";

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
export const TokenCollection = 'tokens'

export type Unit = {
	unitId: string
	product: string
};
export type DB_Tokens = Unit & {
	accessToken: string
	refreshToken: string
	expirationTime: number
}

class WithingsModule_Class
	extends Module<Config> {
	private db!: DatabaseWrapper;
	private httpClient: HttpClient;
	private tokens!: FirestoreCollection<DB_Tokens>;

	constructor() {
		super();
		this.httpClient = new HttpClient("https://wbsapi.withings.net").addMiddleware(this.resolveAccessToken);
	}

	protected init(): void {
		let session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		this.tokens = session.getFirestore().getCollection<DB_Tokens>(TokenCollection, ["unitId", "product"])
	}

	getHeartRequest = async () => {
		const response = await this.httpClient.post('/v2/heart', {action: 'list'});
		await this.db.set('/data/heart/response', response);
		return response
	};
	getSleepRequest = async ()/*: Promise<ResponseGetSleep>*/ => {
		const response = await this.httpClient.post('/v2/sleep', {startdate: '', enddate: ''});
		await this.db.set('/data/sleep/response', response);
		return response
	};

	getSleepSummaryRequest = async () => {
		const response = await this.httpClient.post('/v2/sleep', {action: 'getsummary', lastupdate: ''});
		await this.db.set('/data/sleep/summary/response', response);
		return response
	};

	getMeasActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure?action=getactivity', {action: 'getactivity', lastupdate: ''});
		await this.db.set('/data/meas/activity/response', response);
		return response
	};

	getMeasIntraDayActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure', {action: 'getintradayactivity'});
		await this.db.set('/data/meas/intradayactivity/response', response);
		return response
	};
	getMeasWorkoutActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure', {action: 'getworkout', lastupdate: ''});
		await this.db.set('/data/meas/workout/response', response);
		return response
	};
	getMeasRequest = async () => {
		const resp = await this.httpClient.post('/measure', {action: 'getmeas'});
		await this.db.set('/data/meas/response', resp);
		return resp
	};

	getNotifyRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'get', callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'});
		await this.db.set('/data/notify/response', response);
		return response
	};
	getNotifyListRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'list'});
		await this.db.set('/data/notify/list', response);
		return response
	};
	getNotifySubscribeRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'subscribe', callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'});
		await this.db.set('/data/notify/subscribe', response);
		return response
	};
	postNotifyUpdateRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'update', callbackUrl: 'https%3A%2F%2Fus-central1-local-falene-ts.cloudfunctions.net%2Fapi', appli: '1', comment: ''});
		await this.db.set('/data/notify/update', response);
		return response
	};

	getAccessToken = async () => {
		const response = await this.httpClient.post('/oauth2', {action: 'access_token', grant_type: 'authorization_code', client_id: '', client_secret: '', code: '', redirect_uri: ''});
		await this.db.set('/auth/accessToken', response);
		return response
	};

	getRefreshToken = async () => {
		const response = await this.httpClient.post('/oauth2', {action: 'requesttoken', grant_type: 'refresh_token', client_id: '', client_secret: '', refresh_token: ''});
		await this.db.set('/auth/refreshToken', response);
		return response
	};

	private resolveAccessToken = async (body: UriOptions & CoreOptions) => {
		const token = await this.resolveAccessTokenImpl(body)

		this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`});
	};

	private async resolveAccessTokenImpl(body: UriOptions & CoreOptions): Promise<string> {
		const unitId = body.body.unitId; // put hardcoded value
		const product = body.body.product; // put hardcoded value
		const doc = await this.tokens.queryUnique({where: {unitId, product}})
		if (!doc)
			throw new ApiException(404, 'Missing auth token');

		return doc.accessToken;
	}
}

export const WithingsModule = new WithingsModule_Class();