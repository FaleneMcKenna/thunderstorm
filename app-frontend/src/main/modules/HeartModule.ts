import {
    _setTimeout,
    Module,
    Second
} from "@nu-art/ts-common";
import {
    Api_ListHeartMeas,
    Api_ListMeas,
    Api_MeasUpdate,
    Api_RegisterAuth,
    Api_RefreshModule,
    Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";

type Config = {}

type heartMeasures = { [product: string]: { [unitId: string]: any } };
export const RequestHeartKey = 'get-meas-heart';
export const RequestFetchHeartKey = 'fetch-meas-heart';
export const RequestKeyLogin = 'login';
export const RequestKeyRefresh = 'refresh';


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
            .createRequest<Api_ListMeas>(HttpMethod.GET, RequestHeartKey)
            .setRelativeUrl("/v1/heart/list")
            .setUrlParams(unit)
            .setOnError(() => {
                this.logWarning('Something is wrong');
            })
            .execute(response => {
                this.heartMeasures[unit.product] = this.heartMeasures[unit.product] || {};
                this.heartMeasures[unit.product][unit.unitId] = response.body.measuregrps;
            });
    }

    getHeartMeas(unit: Unit) {
        return this.heartMeasures[unit.product]?.[unit.unitId];
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

export const HeartModule = new HeartModule_Class();