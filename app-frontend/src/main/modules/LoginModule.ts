import {Module} from "@nu-art/ts-common";
import {
	Api_RegisterAuth,
	Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

export const RequestKeyLogin = 'login';

export class LoginModule_Class
	extends Module<Config> {

	login(unit: Unit) {
		HttpModule
			.createRequest<Api_RegisterAuth>(HttpMethod.POST, RequestKeyLogin)
			.setRelativeUrl("/v1/register/auth2")
			.setJsonBody(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute(response => {
				window.location.href = response;
			});
	}
}

export const LoginModule = new LoginModule_Class();