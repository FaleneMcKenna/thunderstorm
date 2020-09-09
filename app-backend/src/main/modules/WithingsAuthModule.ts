import {HttpClient} from "../to-move/HttpClient";
import {
	DatabaseWrapper,
	FirebaseModule,
	FirestoreCollection,
	FirestoreWrapper
} from "@nu-art/firebase/backend";
import {Module} from "@nu-art/ts-common";
import {RequestAuthBody} from "../api/v1/register/auth";

type DB_Unit = {
	unitId: string
	product: string
	auth: AuthType
}

export type AuthType = {
	code: string
	grant_type: string
	client_secret: string
	redirect_uri: string
	client_id: string
};

const Unit_Collection = 'units';

export class WithingsAuthModule_Class
	extends Module {
	private httpClient = new HttpClient("https://");
	private db!: DatabaseWrapper;
	private firestore!: FirestoreWrapper;
	private unitCollection!: FirestoreCollection<DB_Unit>;

	protected init(): void {
		let session = FirebaseModule.createAdminSession();
		this.db = session.getDatabase();
		this.firestore = session.getFirestore()
		this.unitCollection = this.firestore.getCollection<DB_Unit>(Unit_Collection, ['unitId'])
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
		const key = this.getKey(unitId, product);
		const response: { json: AuthType } = await this.httpClient.get('account.withings.com/oauth2_user/authorize2', {
			response_type: 'code',
			client_id: 'client_id',
			state: '',
			scope: 'user.metrics',
			redirect_uri: '"https%3A%2F%2Fus-central1-local-falene-ts.cloudfunctions.net%2Fapi"'
		});
		await this.unitCollection.upsert({unitId, product, auth: response.json});
		// await this.db.set('/auth/response', response);
		return response
	};

	private getKey = (unitId: string, product: string) => `${unitId}_${product}`;

	async postRefresh() {
		const authResponse = await this.getAuth('ir-qa-012', 'elliq');
		const rsp = this.httpClient.post('wbsapi.withings.net/oauth2/token', {data: authResponse.json});
		await this.db.set('/auth/refreshToken', rsp);
		return rsp
	}

	async auth(body: RequestAuthBody) {
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
		return response
	}
}

export const WithingsAuthModule = new WithingsAuthModule_Class();
