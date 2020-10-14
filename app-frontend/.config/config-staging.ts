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

export const config = {
	HttpModule: {
		// origin: "http://192.168.1.5:3000",
		origin: "https://us-central1-local-falene-ts.cloudfunctions.net/api",
		timeout: 30000,
		compress: false
	},
	ForceUpgrade: {
		assertVersionUrl: "/v1/version/assert"
	},
	LocaleModule: {
		defaultLocale: "en",
		locales: [
			{
				locale: "en",
				label: "Language_English",
				icon: "languages/en",
				texts: require(`./res/localization/en`)
			},
			{
				locale: "nl",
				label: "Language_Dutch",
				icon: "languages/nl",
				texts: require(`./res/localization/nl`)
			}
		]
	}
};