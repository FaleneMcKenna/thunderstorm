/*
 * A backend boilerplate with example apis
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

// tslint:disable-next-line:no-import-side-effect
import 'module-alias/register'
import {
	RouteResolver,
	Storm
} from "@nu-art/thunderstorm/backend";
import {Environment} from "./config";
import {Module} from "@nu-art/ts-common";
import {WithingsModule} from "@modules/WithingsModule";
import {NodeListener} from '@modules/NodeListener';
import functions from "firebase";

const packageJson = require("./package.json");
console.log(`Starting server v${packageJson.version} with env: ${Environment.name}`);

const modules: Module[] = [
	WithingsModule,
	NodeListener
];

const _exports = new Storm()
	.addModules(...modules)
	.setInitialRouteResolver(new RouteResolver(require, __dirname, "api"))
	.setInitialRoutePath("/api")
	.setEnvironment(Environment.name)
	.build(async () => {
	});
_exports.test = functions.database.ref('triggerGet').onWrite(() => {
	console.log('LOGGING STRING');
	console.log({
		firstProps: 'string prop',
		secondProps: {
			a: 'nested object prop',
			b: 10000
		}
	});
})
module.exports = _exports
