import {
	_setTimeout,
	Module,
	Second
} from "@nu-art/ts-common";
import {
	Api_ListMeas,
	Api_MeasUpdate,
	Api_RegisterAuth,
	Meas,
	Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

type Measures = {
	[product: string]: {
		[unitId: string]: Meas[]
	}
};
export const RequestMeasKey = 'get-meas';
export const RequestFetchMeasKey = 'fetch-meas';
export const RequestKeyLogin = 'login';
export const RequestKeyRefresh = 'refresh';

export class MeasModule_Class
	extends Module<Config> {

	private measures: Measures = {};

	fetchData(unit: Unit) {
		HttpModule
			.createRequest<Api_MeasUpdate>(HttpMethod.POST, RequestFetchMeasKey)
			.setRelativeUrl("/v1/write/upsert")
			.setJsonBody(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute();
	}

	getData(unit: Unit) {
		this.fetchData(unit);
		_setTimeout(() => {
			this.getDataImpl(unit);
		}, 2 * Second);
	}

	getDataImpl(unit: Unit) {
		HttpModule
			.createRequest<Api_ListMeas>(HttpMethod.GET, RequestMeasKey)
			.setRelativeUrl("/v1/measurements/get")
			.setUrlParams(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute(response => {
				this.measures[unit.product] = this.measures[unit.product] || {};
				this.measures[unit.product][unit.unitId] = response as unknown as Meas[];
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