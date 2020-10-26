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
import {
	DB_Meas,
	Unit
} from "@app/app-shared";
import {WithingsAuthModule} from "@modules/WithingsAuthModule";

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
export const TokenCollection = 'tokens';

export type DB_Tokens = Unit & {
	accessToken: string
	refreshToken: string
	expirationTime: number
}

const MeasCollection = 'meas';


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
		if (this.config.accessToken)
			this.httpClient.setDefaultHeaders({Authorization: `Bearer ${this.config.accessToken}`});

		const session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		const firestore = session.getFirestore();
		this.tokens = firestore.getCollection<DB_Tokens>(TokenCollection, ["unitId", "product"]);
		this.meas = firestore.getCollection<DB_Meas>(MeasCollection, ['unitId', 'timestamp']);
	}

	async updateMeasurements(unit: Unit) {
		const resp: DB_Meas = await this.getMeasRequest(unit);
		const doc: DB_Meas = {
			unitId: unit.unitId,
			product: unit.product,
			timestamp: currentTimeMillies(), // This is in millie whereas they do seconds...for some reason =( should be something like resp.timestamp
			resp
		};
		await this.meas.upsert(doc);
	}
	async updateHeartMeas(unit: Unit) {
		const resp: DB_Meas = await this.getHeartRequest(unit);
		const doc: DB_Meas = {
			unitId: unit.unitId,
			product: unit.product,
			timestamp: currentTimeMillies(), // This is in millie whereas they do seconds...for some reason =( should be something like resp.timestamp
			resp
		};
		await this.meas.upsert(doc);
	}
	getHeartRequest = async (unit: Unit) => {
		await this.setHeaders(unit);
		const response = await this.httpClient.post('/v2/heart', {
			action: 'list',
			startdate: '1590969600',
			enddate: '1601769600'
		});
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
		const response = await this.httpClient.post('/v2/measure?action=getactivity', {
			action: 'getactivity',
			lastupdate: '1590969600'
		});
		await this.db.set('/data/meas/activity/response', response);
		return response;
	};

	getMeasIntraDayActivityRequest = async () => {
		const response = await this.httpClient.post('/v2/measure', {
			action: 'getintradayactivity',
			startdate: '1590969600',
			enddate: '1590969600'
		});
		await this.db.set('/data/meas/intradayactivity/response', response);
		return response;
	};

	getMeasWorkoutActivityRequest = async (data_fields = ['steps', 'distance', 'elevation', 'soft', 'moderate', 'intense', 'active', 'calories', 'totalcalories', 'hr_average', 'hr_min', 'hr_max']) => {
		const response = await this.httpClient.post('/v2/measure', {action: 'getworkout', lastupdate: '1590969600', data_fields: data_fields.join(',')});
		await this.db.set('/data/meas/workout/response', response);
		return response;
	};

	getMeasRequest = async (unit: Unit, category = '1', meastypes = ['1', '2', '3', '4', '5', '6', '7', '8']) => {
		await this.setHeaders(unit);
		// Withings API writes in seconds 1590969600000 --> Mon Jun 01 2020 02:00:00 GMT+0200 (Central European Summer Time)
		const resp = await this.httpClient.get('/measure', {
			action: 'getmeas',
			meastypes: meastypes.join(','),
			category,
			lastupdate: '1500969600'
		});

		await this.db.set('/data/meas/response', resp);
		return resp;
	};

	getNotifyRequest = async () => {
		const response = await this.httpClient.post('/notify', {
			action: 'get',
			callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'
		});
		await this.db.set('/data/notify/response', response);
		return response;
	};
	getNotifyListRequest = async () => {
		const response = await this.httpClient.post('/notify', {action: 'list'});
		await this.db.set('/data/notify/list', response);
		return response;
	};
	getNotifySubscribeRequest = async () => {
		const response = await this.httpClient.post('/notify', {
			action: 'subscribe',
			callbackUrl: 'https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/auth'
		});
		await this.db.set('/data/notify/subscribe', response);
		return response;
	};
	postNotifyUpdateRequest = async () => {
		const response = await this.httpClient.post('/notify', {
			action: 'update',
			callbackUrl: 'https%3A%2F%2Fus-central1-local-falene-ts.cloudfunctions.net%2Fapi',
			appli: ['1', '4'],
			comment: ''
		});
		await this.db.set('/data/notify/update', response);
		return response;
	};

	getRefreshToken = async (client_id: string, client_secret: string, refresh_token: WithingsRefreshToken) => {
		const response = await this.httpClient.post('/oauth2', {
			action: 'requesttoken',
			grant_type: 'refresh_token',
			client_id: client_id,
			client_secret: client_secret,
			refresh_token: WithingsRefreshToken
		});
		await this.db.set('/auth/refreshToken', response);
		return response;
	};
	private resolveAccessToken = async (body: UriOptions & CoreOptions) => {
		const token = await this.resolveAccessTokenImpl(body);
		if (!token)
			return;

		// this.httpClient.setDefaultHeaders({Authorization: `Bearer ${token}`});
	};

	private async resolveAccessTokenImpl(body: UriOptions & CoreOptions): Promise<string | undefined> {
		const unitId = body.body?.unitId; // put hardcoded value
		const product = body.body?.product; // put hardcoded value
		if (!product || !unitId)
			return;
		return await this.getAccessToken(unitId, product);
	}

	private async getAccessToken(unitId: string, product: string) {
		const doc = await this.tokens.queryUnique({where: {unitId, product}});
		if (!doc)
		// throw new ApiException(404, 'Missing auth token');
			return;

		return doc.accessToken;
	}

	private async setHeaders(unit: Unit) {
		const doc = await WithingsAuthModule.getUnitTokenDoc(unit);
		// Probably here need to request new access token, as in call the refresh as long as we did login at start
		if (!doc)
			return;

		this.httpClient.setDefaultHeaders({Authorization: `Bearer ${doc.access_token}`});
	}
}

export const WithingsModule = new WithingsModule_Class();