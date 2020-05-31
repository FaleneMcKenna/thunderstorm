/*
 * Thunderstorm is a full web app framework!
 *
 * Typescript & Express backend infrastructure that natively runs on firebase function
 * Typescript & React frontend infrastructure
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
 * Created by tacb0ss on 27/07/2018.
 */
import {
	Locale,
	LocaleDef,
	StringKey
} from "./types";
import {
	Module,
	ImplementationMissingException
} from "@nu-art/ts-common";
import {format} from "util";

type Config = {
	defaultLocale: Locale,
	locales: LocaleDef[],
};

export class LocaleModule_Class
	extends Module<Config> {

	private activeLocale!: LocaleDef;
	private defaultLocale!: LocaleDef;

	protected init() {
		const defaultLocale = this.config.defaultLocale;
		if (!defaultLocale)
			throw new ImplementationMissingException("MUST set defaultLocale in the config data");

		this.activeLocale = this.setLanguage(defaultLocale);
	}

	public setLanguage(locale: Locale) {
		const localeDef = this.config.locales.find(_locale => _locale.locale === locale);
		if (!localeDef)
			throw new ImplementationMissingException(`Unsupported language: ${locale}`);

		return this.activeLocale = localeDef;
	}

	public getAvailableLanguages(): LocaleDef[] {
		return this.config.locales;
	}

	public get(key: StringKey, ...params: any[]) {
		let text = this.activeLocale.texts[key];

		if (!text)
			text = this.defaultLocale.texts[key];

		if (!text)
			return key;

		return format(text, params);
	}
}

export const LocaleModule = new LocaleModule_Class();