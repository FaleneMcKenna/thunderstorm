import {HttpClient} from "../to-move/HttpClient";
import {
	DatabaseWrapper,
	FirebaseModule,
	FirestoreCollection,
	FirestoreWrapper,
} from "@nu-art/firebase/backend";
import {
	currentTimeMillies,
	Module
} from "@nu-art/ts-common";
import {RequestAuthBody} from "../api/v1/register/auth";
import {AssertParams} from "api/v1/register/assert";
import {Unit} from "@app/app-shared";
import {ApiResponse} from "@nu-art/thunderstorm/backend";

export type DB_Unit = {
	unitId: string
	product: string
	access_token: string
	auth_code: string
	timestamp: number
}

export type AuthType = {
	code: string
	grant_type: string
	client_secret: string
	redirect_uri: string
	client_id: string
};

type Configs = {
	client_id: string
	state: string
	redirect_uri?: string
	client_secret: string
	feUrl?: string
}

const Unit_Collection = 'unit_tokens';

export class WithingsAuthModule_Class
	extends Module<Configs> {
	private httpClient = new HttpClient("https://");
	private db!: DatabaseWrapper;
	private firestore!: FirestoreWrapper;
	private unitCollection!: FirestoreCollection<DB_Unit>;

	protected init(): void {
		//TODO validate you have the right config

		let session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		this.firestore = session.getFirestore();
		this.unitCollection = this.firestore.getCollection<DB_Unit>(Unit_Collection, ['unitId', 'product']);
		this.getAuth('ir-qa-012', 'elliq').catch();
	}

	createBody: () => AuthType = () => {
		return {
			'grant_type': 'authorization_code',
			'client_id': '',
			'client_secret': '',
			'code': '',
			'redirect_uri': ''
		};
	};

	getAuth = async (unitId: string, product: string) => {
		// Here create request per "unit"
		// @ts-ignore
		// const key = this.getKey(unitId, product);
		// const response: { json: AuthType } = await this.httpClient.get('account.withings.com/oauth2_user/authorize2', {
		// 	response_type: 'code',
		// 	client_id: this.config.client_id,
		// 	state: this.config.state,
		// 	scope: 'user.metrics',
		// 	redirect_uri: this.config?.redirect_uri || encodeURI("https://us-central1-local-falene-ts.cloudfunctions.net/api")
		// });
		//
		return this.httpClient.buildUrl('account.withings.com/oauth2_user/authorize2', {
			response_type: 'code',
			client_id: this.config.client_id,
			state: JSON.stringify({unitId, product}),
			scope: 'user.metrics',
			redirect_uri: this.getEncodedRedirectUri()
		});
		// console.log(response);
		// await this.unitCollection.upsert({unitId, product, auth: response.json});
		// // await this.db.set('/auth/response', response);
		// return response
	};

	private getEncodedRedirectUri = () => encodeURI(this.config?.redirect_uri || "https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/assert");

	getAccessToken = async (code: string) => {
		const response = await this.httpClient.post('/oauth2', {
			action: 'access_token',
			grant_type: 'authorization_code',
			client_id: this.config.client_id,
			client_secret: this.config.client_secret,
			code,
			redirect_uri: this.getEncodedRedirectUri()
		});

		await this.db.set('/auth/accessToken', response);
		return response;
	};

	// getRefreshToken = async () => {
	// 	const response = await this.httpClient.post('/oauth2', {action: 'requesttoken', grant_type: 'refresh_token', client_id: this.config.client_id, client_secret: '', refresh_token: ''});
	// 	await this.db.set('/auth/refreshToken', response);
	// 	return response;
	// };

	getKey = (unitId: string, product: string) => `${unitId}_${product}`;

	async postRefresh() {
		const authResponse = await this.getAuth('ir-qa-012', 'elliq');
		const rsp = this.httpClient.post('wbsapi.withings.net/oauth2/token', {data: authResponse});
		await this.db.set('/auth/refreshToken', rsp);
		return rsp;
	}

	async registerAuth(body: RequestAuthBody) {
		switch (body.measurement) {
			case 1:
				await this.sendAuthenticationCode();
				break;
			case 2:
				await this.postRefresh();
		}
	}

	private async sendAuthenticationCode() {
		const response = await WithingsAuthModule.createBody();
		// @ts-ignore
		await this.db.set('/auth/authenticationCode', response);
		return response;
	}

	async assert(queryParams: AssertParams, response: ApiResponse) {
		const auth_code = queryParams.code;
		const unit: Unit = JSON.parse(queryParams.state);
		const access_token = await this.getAccessToken(queryParams.code);

		const doc: DB_Unit = {
			unitId: unit.unitId,
			product: unit.product,
			timestamp: currentTimeMillies(),
			access_token,
			auth_code
		};

		await this.unitCollection.upsert(doc);

		response.redirect(302, this.config.feUrl || 'https://local-falene-ts.firebaseapp.com');
	}
}

export const WithingsAuthModule = new WithingsAuthModule_Class();
