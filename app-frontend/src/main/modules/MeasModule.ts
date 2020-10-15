import {Module} from "@nu-art/ts-common";
import {
	Api_ListMeas,
	Api_RegisterAuth,
	Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

type Measures = { [product: string]: { [unitId: string]: any } };
export const RequestMeasKey = 'get-meas';
export const RequestKeyLogin = 'login';

export class MeasModule_Class
	extends Module<Config> {

	private measures: Measures = {};

	getData(unit: Unit) {
		HttpModule
			.createRequest<Api_ListMeas>(HttpMethod.GET, RequestMeasKey)
			.setRelativeUrl("/v1/measurements/get")
			.setUrlParams(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute(response => {
				this.measures[response.product] = this.measures[response.product] || {};
				this.measures[response.product][response.unitId] = response;
			});
	}

	getMeas(unit: Unit) {
		return this.measures[unit.product]?.[unit.unitId];
	}

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

export const MeasModule = new MeasModule_Class();