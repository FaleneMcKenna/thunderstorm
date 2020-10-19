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
	ServerApi_Get
} from "@nu-art/thunderstorm/backend";
import {ApiWithQuery} from "@nu-art/thunderstorm";
import {WithingsAuthModule} from "@modules/WithingsAuthModule";

export type AssertParams = { code: string, state: string };
export type Api_ListMeas = ApiWithQuery<string, void, AssertParams>

class ServerApi_RegisterAuth2
	extends ServerApi_Get<Api_ListMeas> {

	constructor() {
		super('assert');
	}

	protected async process(request: ExpressRequest, response: ApiResponse, queryParams: AssertParams, body: void) {
		console.log(queryParams,body);
		await WithingsAuthModule.assert(queryParams, response);
	}
}

module.exports = new ServerApi_RegisterAuth2();
