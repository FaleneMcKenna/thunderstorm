import {HttpClient} from "../to-move/HttpClient";
import {
	DatabaseWrapper,
	FirebaseModule,
	FirestoreCollection,
	FirestoreWrapper,
} from "@nu-art/firebase/backend";
import {
	currentTimeMillies,
	Module,
	Second
} from "@nu-art/ts-common";
import {RequestAuthBody} from "../api/v1/register/refreshAuth";
import {AssertParams} from "api/v1/register/assert";
import {ApiResponse} from "@nu-art/thunderstorm/backend";
import {Unit} from "@app/app-shared";

export type DB_Unit = {
	unitId: string
	product: string
	access_token: string
	refresh_token: string
	auth_code: string
	timestamp: number
	expires_in: number
	scope: string
}

type Oauth2Body = {
	userid: string
	access_token: string
	refresh_token: string
	scope: string
	expires_in: number
	token_type: "Bearer"
};

type OAuth2Resp = {
	status: number,
	error?: string
	body?: Oauth2Body
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
	private authClient = new HttpClient("https://account.withings.com");
	private withingsClient = new HttpClient("https://wbsapi.withings.net");
	private db!: DatabaseWrapper;
	private firestore!: FirestoreWrapper;
	private unitCollection!: FirestoreCollection<DB_Unit>;

	protected init(): void {
		//TODO validate you have the right config

		let session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		this.firestore = session.getFirestore();
		this.unitCollection = this.firestore.getCollection<DB_Unit>(Unit_Collection, ['unitId', 'product']);
		// this.getAuth(unit.unitId, unit.product).catch();
	}

	createBody: () => AuthType = () => {
		return {
			'grant_type': 'authorization_code',
			'client_id': this.config.client_id,
			'client_secret': this.config.client_secret,
			'code': '',
			'redirect_uri': ''
		};
	};

	getAuthUrl(unit: Unit): string {

		const params = {
			response_type: 'code',
			client_id: this.config.client_id,
			state: JSON.stringify(unit),
			scope: 'user.metrics',
			redirect_uri: encodeURI(this.getRedirectUri())
		};
		return this.authClient.buildUrl('/oauth2_user/authorize2', params);
	}

	private getRedirectUri = () => {
		return this.config?.redirect_uri || "https://us-central1-local-falene-ts.cloudfunctions.net/api/v1/register/assert";
	};

	getAccessToken = async (code: string) => {
		const response: OAuth2Resp = await this.withingsClient.post('/v2/oauth2', {
			action: 'requesttoken',
			grant_type: 'authorization_code',
			client_id: this.config.client_id,
			client_secret: this.config.client_secret,
			code,
			redirect_uri: this.getRedirectUri()
		});

		await this.db.set('/auth/accessToken', response);
		return response;
	};

	getKey = (unit: Unit) => `${unit.unitId}_${unit.product}`;
	getRefreshUrl(unit: Unit): string {
		const params = {
			action: 'requesttoken',
			client_id: this.config.client_id,
			client_secret: this.config.client_secret,
			state: JSON.stringify(unit),
			scope: 'user.metrics',
			grant_type: 'refresh_token',
			// refresh_token: auth.accessToken.body.refresh_token
			// refresh_token: this.Oauth2Body.refresh_token
		};
		return this.withingsClient.buildUrl('/v2/oauth2', params)
	}
	async postRefresh() {
		const authResponse = await this.getRefreshUrl({unitId: 'ir-qa-012', product: 'elliq'});
		const rsp = this.authClient.post('wbsapi.withings.net/oauth2', {data: authResponse});
		await this.db.set('/auth/accessToken', rsp);
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
		const resp = await this.getAccessToken(queryParams.code);
		const body = resp.body;

		// Not sure why
		const success = (body: Oauth2Body | undefined): body is Oauth2Body => !!(resp.status === 0 && body);
		if (success(body)) {
			const doc: DB_Unit = {
				unitId: unit.unitId,
				product: unit.product,
				timestamp: currentTimeMillies(),
				refresh_token: body.refresh_token,
				access_token: body.access_token,
				expires_in: body.expires_in * Second,
				scope: body.scope,
				auth_code
			};

			await this.unitCollection.upsert(doc);
		}

		response.redirect(302, (this.config.feUrl || 'https://local-falene-ts.firebaseapp.com') + (success(body) ? '' : '/failed'));
	}

	async getUnitTokenDoc(unit:Unit){
		return this.unitCollection.queryUnique({where:unit});
	}
}

export const WithingsAuthModule = new WithingsAuthModule_Class();
