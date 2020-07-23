import {
	addItemToArray,
	BeLogged,
	LogLevel,
	LogLevelOrdinal,
	Module
} from "@nu-art/ts-common";
import {HttpModule} from "@nu-art/thunderstorm/frontend";
import {HttpMethod} from "@nu-art/thunderstorm";
import {
	ApiMeasurementWithings,
	Request_MeasurementWithings
} from "../../shared/api";
import {
	LogClient_MeasurementWithings,
	LogClient_DefaultMeasurementWithings
} from "../core/logger/LogClient_MeasurementWithings";

export const RequestKey_MeasurementWithingsApi = "MeasurementWithings";

export class MeasurementWithingsModule_Class
	extends Module {

	private readonly reports: LogClient_MeasurementWithings[] = [];

	constructor() {
		super();
		addItemToArray(this.reports, LogClient_DefaultMeasurementWithings);
		addItemToArray(this.reports, new LogClient_MeasurementWithings("info")
			.setFilter(level => LogLevelOrdinal.indexOf(level) >= LogLevelOrdinal.indexOf(LogLevel.Info)));
	}

	protected init(): void {
		this.reports.forEach(report => BeLogged.addClient(report));
	}

	sendMeasurementWithings = () => {
		const body: Request_MeasurementWithings = {

			reports: this.reports.map(report => ({log: report.buffers, name: report.name})),

		};

		HttpModule
			.createRequest<ApiMeasurementWithings>(HttpMethod.POST, RequestKey_MeasurementWithingsApi)
			.setJsonBody(body)
			.setRelativeUrl("/v1/poc-withings/measurements")
			.setOnError(`Error updating the measurements`)
			.setOnSuccessMessage(`Measurements succeed`)
			.execute();
	};
}

export const MeasurementWithingsModule = new MeasurementWithingsModule_Class();
