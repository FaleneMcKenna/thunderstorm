import {Module} from "@nu-art/ts-common";
import {
	Api_RefreshAuth,
	Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

export const RequestKeyRefresh = 'refresh';

export class RefreshModule_Class
	extends Module<Config> {

	refresh(unit: Unit) {
		HttpModule
			.createRequest<Api_RefreshAuth>(HttpMethod.POST, RequestKeyRefresh)
			.setRelativeUrl("/v1/register/refreshAuth")
			.setJsonBody(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute();
	}
}

export const RefreshModule = new RefreshModule_Class();