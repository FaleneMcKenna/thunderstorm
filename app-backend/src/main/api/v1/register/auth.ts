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


type RequestBody<T extends 1 | 2 = 1 | 2> = {
	userid: number
	appli: T
	startdate: number
	enddate: number
} & InferResponseType[T]

type InferResponseType = {
    1: {},
    2: {}
}

type Api_RegisterAuth = ApiWithBody<'/v1/register/auth', RequestBody, void>

class ServerApi_RegisterAuth
	extends ServerApi_Post<Api_RegisterAuth> {

	constructor() {
		super('auth')
	}

	protected async process(request: ExpressRequest, response: ApiResponse, queryParams: QueryParams, body: RequestBody) {
	    switch (body.appli) {
          case 1:
              this.doSomething();
              break;
          case 2:
              this.doElse();
      }
		// use the data they provide to update the unit/db
	}

    private doSomething() {

    }

    private doElse() {

    }
}

module.exports = new ServerApi_RegisterAuth()
