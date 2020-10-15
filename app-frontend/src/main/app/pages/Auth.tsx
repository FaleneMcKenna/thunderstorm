import {
	BaseComponent,
	OnRequestListener,
	TS_Input
} from "@nu-art/thunderstorm/frontend";
import * as React from "react";
import {Unit} from "@app/app-shared";
import {LoginModule} from "@modules/LoginModule";

type State = {
	unit: Unit
}

export class Auth
	extends BaseComponent<{}, State>
	implements OnRequestListener {

	constructor(props: {}) {
		super(props);
		this.state = {
			unit: {
				unitId: 'ir-qa-012',
				product: 'elliq'
			}
		};
	}

	__onRequestCompleted = (key: string, success: boolean, requestData?: string | undefined) => {
		this.forceUpdate();
	};

	render() {
		return <>
			<TS_Input
				id={'unitId'}
				value={this.state.unit.unitId}
				onChange={(value, id) => {
					this.setState(state => {
						const unit = state.unit;

						unit.unitId = value;
						return state;
					});
				}}
			/>
			<TS_Input
				id={'product'}
				value={this.state.unit.product}
				onChange={(value, id) => {
					this.setState(state => {
						const unit = state.unit;

						unit.product = value;
						return state;
					});
				}}
			/>

			<div style={{cursor: 'pointer'}} onClick={() => LoginModule.login(this.state.unit)}>Login</div>
		</>;
	}
}