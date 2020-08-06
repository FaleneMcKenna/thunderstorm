import {
	ApiException,
	promisifyRequest
} from "@nu-art/thunderstorm/backend";
import {
	ErrorResponse,
	HttpMethod
} from "@nu-art/thunderstorm";
import {
	CoreOptions,
	UriOptions
} from "request";
import {
	__stringify,
	StringMap
} from "@nu-art/ts-common";
import {Headers} from 'request'

export class HttpClient {

	private defaultHeaders!: Headers;
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	setDefaultHeaders(defaultHeaders: Headers) {
		this.defaultHeaders = defaultHeaders
	}

	get(path: string, _params?: StringMap, headers?: Headers) {
		let url = `${this.baseUrl}${path}`;

		let nextOperator = "?"
		if (url.indexOf("?") !== -1)
			nextOperator = "&";

		if (_params)
			url = Object.keys(_params).reduce((fullUrl: string, paramKey: string) => {
				const param: string | undefined = _params[paramKey];
				if (!param)
					return url;

				const temp = `${fullUrl}${nextOperator}${paramKey}=${encodeURIComponent(param)}`;
				nextOperator = "&";
				return temp;
			}, url);

		const request: UriOptions & CoreOptions = {
			headers: {...this.defaultHeaders, headers},
			uri: `${url}`,
			method: HttpMethod.GET,
			json: true
		};
		return this.executeRequest(request);
	}

	post(path: string, body: any, headers?: Headers) {
		const request: UriOptions & CoreOptions = {
			headers: {...this.defaultHeaders, headers},
			uri: `${this.baseUrl}${path}`,
			body,
			method: HttpMethod.POST,
			json: true
		};
		return this.executeRequest(request);

	}

	put(path: string, body: any, headers?: Headers) {
		const request: UriOptions & CoreOptions = {
			headers: {...this.defaultHeaders, headers},
			uri: `${this.baseUrl}${path}`,
			body,
			method: HttpMethod.PUT,
			json: true
		};
		return this.executeRequest(request);
	}

	private async executeRequest(body: UriOptions & CoreOptions) {
		const response = await promisifyRequest(body, false);
		const statusCode = response.statusCode;
		if (statusCode >= 200 && statusCode < 300)
			return response.toJSON().body;

		const errorResponse: ErrorResponse<any> = response.body;
		if (!errorResponse)
			throw new ApiException(statusCode, `Http request failed without error message: ${__stringify(body, true)}`)

		throw new ApiException<any>(statusCode, `Http request failed: ${errorResponse} \n For Request: ${__stringify(body, true)}`);
	}
}