import {
	_setTimeout,
	Module,
	Second
} from "@nu-art/ts-common";
import {
	Api_ListHeart,
	Api_MeasUpdate,
	Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

type heartMeasures = { [product: string]: { [unitId: string]: any } };
export const RequestHeartKey = 'get-meas-heart';
export const RequestFetchHeartKey = 'fetch-meas-heart';
export const RequestKeyLogin = 'login';


export class HeartModule_Class
	extends Module<Config> {

	private heartMeasures: heartMeasures = {};

	fetchData(unit: Unit) {
		HttpModule
			.createRequest<Api_MeasUpdate>(HttpMethod.POST, RequestFetchHeartKey)
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
			.createRequest<Api_ListHeart>(HttpMethod.GET, RequestHeartKey)
			.setRelativeUrl("/v1/heart/list")
			.setUrlParams(unit)
			.setOnError(() => {
				this.logWarning('Something is wrong');
			})
			.execute(response => {
				console.log(response);
				// this.heartMeasures[unit.product] = this.heartMeasures[unit.product] || {};
				// this.heartMeasures[unit.product][unit.unitId] = response.body.measuregrps;
			});
	}

	getHeartMeas(unit: Unit) {
		return this.heartMeasures[unit.product]?.[unit.unitId];
	}
}

export const HeartModule = new HeartModule_Class();