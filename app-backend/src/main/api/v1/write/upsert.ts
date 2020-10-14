import {
    ApiResponse,
    ServerApi_Post,
} from "@nu-art/thunderstorm/backend";


import {auditBy,} from "@nu-art/ts-common";
import {ApiWithBody} from "@nu-art/thunderstorm";

import {ExpressRequest} from "@nu-art/thunderstorm/backend";
import {WithingsModule} from "@modules/WithingsModule";
import {RequestAuthBody} from "../register/auth";

type Api_MeasUpdate = ApiWithBody<'/v1/write/upsert', RequestAuthBody, void>

class MeasFirestore_Update
    extends ServerApi_Post<Api_MeasUpdate> {

    constructor() {
        super("update");
    }

    protected async process(request: ExpressRequest, response: ApiResponse, queryParams: {}) {

        await WithingsModule.updateMeasurements(auditBy("user.userId"));
    }
}

module.exports = new MeasFirestore_Update();