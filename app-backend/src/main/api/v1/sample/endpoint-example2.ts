import {ApiResponse, HttpMethod, ServerApi} from "@nu-art/server";

import * as express from "express";

class ServerApi_EndpointExample
	extends ServerApi {

	constructor() {
		super(HttpMethod.GET, "endpoint-example2");
	}

	protected process(req: express.Request, res: ApiResponse, response: any, body: string): void {
		res.text(200, "response data2");
	}
}

module.exports = new ServerApi_EndpointExample();
