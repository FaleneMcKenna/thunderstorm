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
import {DB_Object} from "@nu-art/firebase";
import {Auditable} from "@nu-art/ts-common";
import {Measurements_gen} from "../app-backend/modules/WithingsGetMeas";
import {Measurements_heart} from "../app-backend/modules/WithingsGetHeart";

export type MeasurementWithings = {
	name: string
	log: string[]
}

export type Request_MeasurementWithings = {
	subject: string;
	description: string;
	reports: MeasurementWithings[]
	createIssue: boolean,
};

export declare type ReportMetaData = {
	description: string,
	path: string,
	minPath: string
}
export type DB_MeasurementWithings = DB_Object & Auditable & {
	subject: string;
	description: string
	reports: ReportLogFile[]
	bucket?: string
};

export type ReportLogFile = {
	name: string
	path: string
}

export type Paths = {
	path: string
}

export type SecuredUrl = {
	fileName: string
	securedUrl: string
	publicUrl: string
}

export type ApiGetLog = ApiWithQuery<string DB_MeasurementWithings[]>
export type ApiPostPath = ApiWithBody<'/v1/poc-withings/download-logs', Paths, SecuredUrl>
export type ApiMeasurementWithings = ApiWithBody<'/v1/poc-withings/report', Request_MeasurementWithings, void>