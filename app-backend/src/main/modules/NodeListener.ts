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

import {FirebaseFunctionModule} from "@nu-art/firebase/backend-functions";
import {WithingsModule} from "@modules/WithingsModule";

type TypeNode = {
	a: number
	b: string
};

type Params = {
	nodeName: string
	other: string
};

export class NodeListener_Class
	extends FirebaseFunctionModule<TypeNode> {

	constructor() {
		super(`/data/notify/update`);
		this.onFunctionReady = this.onFunctionReady.bind(this);
	}

	async processChanges(previousData: TypeNode, newData: TypeNode, params: Params): Promise<any> {
		console.log(previousData, newData, params.nodeName, params.other)
		const triggerResponse = await this.functions.onWrite('/data/notify/update');
		await WithingsModule.getMeasRequest('ir-qa-012');
		return triggerResponse

	}
}

export const NodeListener = new NodeListener_Class();
