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

import {__custom} from "@nu-art/test/Testelot";
import {main} from "../../main/main";
import {HttpServer} from "@nu-art/server/http-server/HttpServer";


export function startServer(config: object) {
	return __custom(async () => {
		return await main(config);
	}).setLabel("starting server");
}

export function endServer() {
	return __custom(async () => {
		return await Promise.all(
			[
				HttpServer.terminate(),
			])
	}).setLabel("starting server");

}