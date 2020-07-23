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

import {Module} from "@nu-art/ts-common";
import {
	DB_MeasurementWithings,
	Paths
} from "../../shared/api";

import {
	FirebaseModule,
	FirestoreCollection,
	StorageWrapper
} from "@nu-art/firebase/backend";

type Config = {
	projectId: string
	bucket?: string,
}

export class AdminWithingsModule_Class
	extends Module<Config> {

	measurementWithings!: FirestoreCollection<DB_MeasurementWithings>;
	private storage!: StorageWrapper;

	protected init(): void {
		const sessAdmin = FirebaseModule.createAdminSession();
		const firestore = sessAdmin.getFirestore();
		this.measurementWithings = firestore.getCollection<DB_MeasurementWithings>('poc-withings', ['_id']);
		this.storage = sessAdmin.getStorage();
	}

	getFilesFirebase = async () => this.measurementWithings.getAll();

	downloadFiles = async (path: Paths) => {
		const bucket = await this.storage.getOrCreateBucket(this.config?.bucket);
		const file = await bucket.getFile(path.path);
		return file.getReadSecuredUrl("application/zip", 600000);
	}
}

export const AdminWithingsModule = new AdminWithingsModule_Class();