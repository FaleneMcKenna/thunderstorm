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

/**
 * Created by tacb0ss on 19/09/2018.
 */
import * as firebase from 'firebase/app'
import {Logger} from "@nu-art/ts-common";
import {FirebaseConfig} from "../..";

export abstract class FirebaseSession
	extends Logger {
	app!: firebase.app.App;

	protected config: FirebaseConfig;
	protected sessionName: string;

	constructor(sessionName: string, config: FirebaseConfig) {
		super(`firebase: ${sessionName}`);
		this.sessionName = sessionName;
		this.config = config;
	}

	abstract connect(): void ;

	abstract getProjectId(): string;
}

