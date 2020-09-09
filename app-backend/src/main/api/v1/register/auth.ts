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
	ApiResponse,
	ExpressRequest,
	ServerApi_Post
} from "@nu-art/thunderstorm/backend";
import {
	ApiWithBody,
	QueryParams
} from "@nu-art/thunderstorm";
import {WithingsAuthModule} from "@modules/WithingsAuthModule";

export type RequestAuthBody = {
	userid: number
	measurement: number
	//applications-scope-call
	//  1-user.metrics-getMeas; 2-user.metrics-getMeas; 4-user.metrics-getMeas; 16-users.activity-getAct/getIntraAct/getWorkout
	// 44-user.activity-getSleep/getSleepSummary; 46-user.info; 50-users.sleepevents; 51-users.sleepevents; 52-users.sleepevents
	startdate: number
	enddate: number
	appliMeasurement: number
}

type Api_RegisterAuth = ApiWithBody<'/v1/register/auth', RequestAuthBody, void>

class ServerApi_RegisterAuth
	extends ServerApi_Post<Api_RegisterAuth> {

	constructor() {
		super('auth')
	}

	protected async process(request: ExpressRequest, response: ApiResponse, queryParams: QueryParams, body: RequestAuthBody) {
		await WithingsAuthModule.auth(body)
		// use the data they provide to update the unit/db
	}
}

module.exports = new ServerApi_RegisterAuth()
