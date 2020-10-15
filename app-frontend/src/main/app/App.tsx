/*
 * A typescript & react boilerplate with api call example
 *
 * Copyright (C) 2020 Adam van der Kruk aka TacB0sS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import {
	BaseComponent,
	RoutingModule,
	WrapperProps
} from "@nu-art/thunderstorm/frontend";
import {GetMeas} from "./pages/GetMeas";
import {Auth} from "./pages/Auth";

const RouteKey_Home = 'meas';
const RouteKey_Login = 'login';

function registerRoutes() {
	RoutingModule.clearRoutes();

	RoutingModule.addRoute(RouteKey_Home, "/measurement", GetMeas);
	//home route should be declared last
	RoutingModule.addRoute(RouteKey_Login, "/", Auth).setLabel('Login').setExact(false);
}

export class App
	extends BaseComponent<WrapperProps> {

	public static dropBlocker<T>(ev: React.DragEvent<T>) {
		ev.preventDefault();
		ev.stopPropagation();
	};

	render() {
		registerRoutes();
		return (
			<div onDrop={App.dropBlocker} onDragOver={App.dropBlocker}>
				{RoutingModule.getRoutesMap()}
			</div>);
	}
}

