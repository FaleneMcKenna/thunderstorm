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
	currentTimeMillies,
	Module,
} from "@nu-art/ts-common";
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
export const TokenCollection = 'tokens';

export type Unit = {
	unitId: string
	product: string
};
export type DB_Tokens = Unit & {
	accessToken: string
	refreshToken: string
	expirationTime: number
}

const MeasCollection = 'meas';

export type DB_Meas = {
	unitId: string
	product: string
	timestamp: number
	// need to add the rest of the data you should be saving
}

class WithingsModule_Class
	extends Module<Config> {
	private db!: DatabaseWrapper;
	private httpClient: HttpClient;
	private tokens!: FirestoreCollection<DB_Tokens>;
	private meas!: FirestoreCollection<DB_Meas>;

	constructor() {
		super();
		this.httpClient = new HttpClient("https://wbsapi.withings.net").addMiddleware(this.resolveAccessToken);
	}

	protected init(): void {
		if(this.config.accessToken)
			this.httpClient.setDefaultHeaders({Authorization: `Bearer ${this.config.accessToken}`});

		const session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		const firestore = session.getFirestore();
		this.tokens = firestore.getCollection<DB_Tokens>(TokenCollection, ["unitId", "product"]);
		this.meas = firestore.getCollection<DB_Meas>(MeasCollection, ['unitId', 'timestamp']);
	}
	async updateMeasurements(unit: Unit) {
		const meas: DB_Meas = await this.getMeasRequest(unit);
		await this.meas.upsert(meas);
	}

	getHeartRequest = async () => {
		const response = await this.httpClient.post('/v2/heart', {action: 'list', startdate: '1590969600', enddate: '1601769600'});
		await this.db.set('/data/heart/response', response);
		return response;
	};
	getSleepRequest = async ()/*: Promise<ResponseGetSleep>*/ => {
		const response = await this.httpClient.post('/v2/sleep', {startdate: '1590969600', enddate: '1601769600'});
		await this.db.set('/data/sleep/response', response);
		return response;
	};

	getSleepSummaryRequest = async () => {
		const response = await this.httpClient.post('/v2/sleep', {action: 'getsummary', lastupdate: '1590969600'});
		await this.db.set('/data/sleep/summary/response', response);
		return response;
	};

	getMeasActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure?action=getactivity', {action: 'getactivity', lastupdate: '1590969600'});
		await this.db.set('/data/meas/activity/response', response);
		return response;
	};

	getMeasIntraDayActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure', {action: 'getintradayactivity', startdate: '1590969600', enddate: '1590969600'});
		await this.db.set('/data/meas/intradayactivity/response', response);
		return response;
	};

	getMeasWorkoutActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure', {action: 'getworkout', lastupdate: '1590969600'});
		await this.db.set('/data/meas/workout/response', response);
		return response;
	};

	getMeasRequest = async (unit: Unit) => {
		const resp = await this.httpClient.post('/measure', {action: 'getmeas', meastypes: [1, 5, 6, 8], category: '1', lastupdate: '1590969600'});
		const doc: DB_Meas = {
			unitId: unit.unitId,
			product: unit.product,
			timestamp: currentTimeMillies() // should be something like resp.timestamp
			///..... the rest
		};
		await this.meas.upsert(doc);

		await this.db.set('/data/meas/response', resp);
		return resp;
	};

	getNotifyRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'get', callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'});
		await this.db.set('/data/notify/response', response);
		return response;
	};
	getNotifyListRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'list'});
		await this.db.set('/data/notify/list', response);
		return response;
	};
	getNotifySubscribeRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'subscribe', callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'});
		await this.db.set('/data/notify/subscribe', response);
		return response;
	};
	postNotifyUpdateRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'update', callbackUrl: 'https%3A%2F%2Fus-central1-local-falene-ts.cloudfunctions.net%2Fapi', appli: '1', comment: ''});
		await this.db.set('/data/notify/update', response);
		return response;
	};

	getAccessToken = async () => {
		const response = await this.httpClient.post('/oauth2', {action: 'access_token', grant_type: 'authorization_code', client_id: '', client_secret: '', code: '', redirect_uri: ''});
		await this.db.set('/auth/accessToken', response);
		return response;
	};

	getRefreshToken = async () => {
		const response = await this.httpClient.post('/oauth2', {action: 'requesttoken', grant_type: 'refresh_token', client_id: '', client_secret: '', refresh_token: ''});
		await this.db.set('/auth/refreshToken', response);
		return response;
	};

	private resolveAccessToken = async (body: UriOptions & CoreOptions) => {
		const token = await this.resolveAccessTokenImpl(body);
		if (!token)
			return;

		this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`});
	};

	private async resolveAccessTokenImpl(body: UriOptions & CoreOptions): Promise<string | undefined> {
		const unitId = body.body.unitId; // put hardcoded value
		const product = body.body.product; // put hardcoded value
		if (!product||!unitId)
			return;
		const doc = await this.tokens.queryUnique({where: {unitId, product}});
		if (!doc)
			// throw new ApiException(404, 'Missing auth token');
			return ;

		return doc.accessToken;
	}
}

export const WithingsModule = new WithingsModule_Class();