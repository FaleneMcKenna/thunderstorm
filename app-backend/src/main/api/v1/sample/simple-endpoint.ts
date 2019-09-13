/*
 * A backend boilerplate with example apis
 *
 * Copyright (C) 2018  Adam van der Kruk aka TacB0sS
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
	ServerApi,
} from "@nu-art/storm/server";

import * as express from "express";
import {ParsedUrlQuery} from "querystring";
import {HttpMethod} from "@nu-art/ts-common";
import {CommonBodyReq} from "@shared/shared";

class ServerApi_EndpointExample
	extends ServerApi<CommonBodyReq> {

	constructor() {
		super(HttpMethod.POST, "another-endpoint");
	}

	protected async process(request: express.Request, response: ApiResponse, queryParams: ParsedUrlQuery, body: CommonBodyReq) {
		this.logInfoBold(`got id: ${body.message}`);
		response.text(200, "another endpoint");
	}
}

module.exports = new ServerApi_EndpointExample();
