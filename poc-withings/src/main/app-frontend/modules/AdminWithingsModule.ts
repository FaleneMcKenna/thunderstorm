
import {Module} from "@nu-art/ts-common";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";
import {
    ApiGetLog,
    ApiPostPath,
    DB_MeasurementWithings,
    Paths
} from "../../shared/api";

export const RequestKey_GetLog = "GetLog";
export const RequestKey_PostPath = "PostPath";

export class AdminWithingsModule_Class
	extends Module {

	constructor() {
		super();
	}

	private logs: DB_MeasurementWithings[] = [];

	public retrieveLogs = () => {
		this.logInfo("getting logs from firestore...");
		HttpModule
			.createRequest<ApiGetLog>(HttpMethod.GET, RequestKey_GetLog)
			.setRelativeUrl("/v1/poc-withings/get-logs")
			.setOnError(`Error getting new message from backend`)
			.execute(async response => {
				this.logs = response
			});

		this.logInfo("continue... will receive an event once request is completed..");
	};

	public downloadLogs = (path: string) => {
		this.logInfo("downloading the logs to the client..");
		const bodyObject: Paths = {path: path};
		HttpModule
			.createRequest<ApiPostPath>(HttpMethod.POST, RequestKey_PostPath)
			.setJsonBody(bodyObject)
			.setRelativeUrl("/v1/poc-withings/download-logs")
			.setOnError(`Error getting new message from backend`)
			.execute();
	};

	public getLogs = () => this.logs
}

export const AdminWithingsModule = new AdminWithingsModule_Class();