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
	generateHex,
	Module
} from "@nu-art/ts-common";
import {FirebaseModule} from "@nu-art/storm/firebase";

type Type = {
	id: number
	name: string,
	other?: string
}

type UniqueType = {
	id: number
}

type Config = {}
const testCollection = 'test-unique-type';

export class TestModule_Class
	extends Module<Config> {

	protected init(): void {
		this.startTest();
	}

	private startTest() {
		this.runAsync('Running test', async () => {
			const fs = FirebaseModule.createLocalAdminSession().getFirestore();
			const col = fs.getCollection<Type, UniqueType>(testCollection, ({id}) => ({id}));
			await fs.deleteCollection(testCollection);

			await col.insertAll([1, 2, 3, 4, 5].map(id => ({
				id,
				name: generateHex(8),
				other: `${generateHex(8)}_${id}`,
			})));

			await col.patch({id: 3, name: 'memeAlanBen'})
		})
	}
}

export const TestModule = new TestModule_Class();