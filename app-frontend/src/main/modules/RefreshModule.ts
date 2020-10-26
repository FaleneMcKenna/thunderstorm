import {Module} from "@nu-art/ts-common";
import {
    Api_RegisterAuth,
    Unit
} from "@app/app-shared";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";
import {Api_RefreshAuth} from "../../../../app-shared/src/main";

type Config = {}

export const RequestKeyRefresh = 'refresh';
export const RequestHeartKey = 'get-meas-heart';
export const RequestFetchHeartKey = 'fetch-meas-heart';
export const RequestKeyLogin = 'login';

export class RefreshModule_Class
    extends Module<Config> {

    refresh(unit: Unit) {
        HttpModule
            .createRequest<Api_RefreshAuth>(HttpMethod.POST, RequestKeyRefresh)
            .setRelativeUrl("/v1/register/refreshAuth")
            .setOnError(() => {
                this.logWarning('Something is wrong');
            })
            .execute(response => {
                window.location.href = response;
            });
    }
}

export const RefreshModule = new RefreshModule_Class();