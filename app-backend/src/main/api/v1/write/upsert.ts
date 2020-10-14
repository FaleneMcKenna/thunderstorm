import {
    ApiResponse,
    ServerApi_Post,
} from "@nu-art/thunderstorm/backend";


import {ApiWithBody} from "@nu-art/thunderstorm";

import {ExpressRequest} from "@nu-art/thunderstorm/backend";
// import {WithingsModule} from "@modules/WithingsModule";
import {FirebaseModule} from "@nu-art/firebase/backend";

type Api_MeasUpdate = ApiWithBody<'/v1/write/upsert', Body, void>
type Body = {unitId: string, product: string};

class MeasFirestore_Update
    extends ServerApi_Post<Api_MeasUpdate> {

    constructor() {
        super("upsert");
    }

    protected async process(request: ExpressRequest, response: ApiResponse, queryParams: {}, body: Body) {
        const db = FirebaseModule.createAdminSession().getDatabase();
        await db.set("/notify/update", body)

        // await WithingsModule.updateMeasurements(auditBy("user.userId"));
    }
}

module.exports = new MeasFirestore_Update();