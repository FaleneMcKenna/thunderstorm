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
	ApiWithBody,
	ApiWithQuery
} from "@nu-art/thunderstorm";

export type Meas = {
	attrib: number
	category: number
	comment: null | string
	created: number
	date: number
	deviceid: null | string
	grpid: number
	hash_deviceid: null | string
	measures: {
		algo: number
		fm: number
		type: number
		unit: number
		value: number
	}[]
}

export type DB_Meas = {
	unitId: string
	product: string
	timestamp: number
	resp: Meas
	// need to add the rest of the data you should be saving
}
export type Unit = {
	unitId: string
	product: string
}
export type Api_MeasUpdate = ApiWithBody<'/v1/write/upsert', Unit, void>
export type Api_RegisterAuth = ApiWithBody<'/v1/register/auth2', Unit, string>
export type Api_RefreshAuth = ApiWithBody<'/v1/register/refreshAuth', Unit, void>
export type Api_ListMeas = ApiWithQuery<'/v1/measurements/get', Meas[], Unit>
export type Api_ListHeart = ApiWithQuery<'/v1/heart/list', any, Unit>

