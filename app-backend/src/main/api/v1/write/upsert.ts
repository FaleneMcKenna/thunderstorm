import {
	ApiResponse,
	ExpressRequest,
	ServerApi_Post,
} from "@nu-art/thunderstorm/backend";
// import {WithingsModule} from "@modules/WithingsModule";
import {FirebaseModule} from "@nu-art/firebase/backend";
import {
	Api_MeasUpdate,
	Unit
} from "@app/app-shared";


class MeasFirestore_Update
	extends ServerApi_Post<Api_MeasUpdate> {

	constructor() {
		super("upsert");
	}

	protected async process(request: ExpressRequest, response: ApiResponse, queryParams: {}, body: Unit) {
		const db = FirebaseModule.createAdminSession().getDatabase();
		await db.set("/notify/update", body);

		// await WithingsModule.updateMeasurements(auditBy("user.userId"));
	}
}

module.exports = new MeasFirestore_Update();