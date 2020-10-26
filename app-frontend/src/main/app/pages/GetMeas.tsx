import {
	BaseComponent,
	OnRequestListener,
	TS_Input
} from "@nu-art/thunderstorm/frontend";
import * as React from "react";
import {
	Meas,
	Unit
} from "@app/app-shared";
import {
	MeasModule,
	RequestMeasKey
} from "@modules/MeasModule";
import {
	createReadableTimestampObject,
	generateHex
} from "@nu-art/ts-common";

type State = {
	unit: Unit
}

export class GetMeas
	extends BaseComponent<{}, State>
	implements OnRequestListener {

	constructor(props: {}) {
		super(props);
		this.state = {
			unit: {
				unitId: 'ir-qa-012',
				product: 'elliq'
				// measurement type, measType, category <- to avoid hard coding
				//timestamps to save start date and end date.
			}
		};
	}

	__onRequestCompleted = (key: string, success: boolean, requestData?: string | undefined) => {
		if (key !== RequestMeasKey)
			return;

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

			<div style={{cursor: 'pointer'}} onClick={() => MeasModule.getDataImpl(this.state.unit)}>GetData</div>

			{this.renderMeas()}
		</>;
	}

	private renderMeas = () => {
		const resp = MeasModule.getMeas(this.state.unit);
		console.log(resp);

		return <table>
			<tr>
				<th>Date</th>
				<th>Value</th>
			</tr>
			{resp?.map((r: Meas) => {
				const m = r?.measures?.[0];
				if(!m)
					return;

				return <tr key={generateHex(4)}>
					<td>{createReadableTimestampObject('DD-MM-YYYY hh:mm', r.created * 1000).pretty}</td>
					<td>{m.value*(10**(m.unit))}</td>
					{/*<div>{JSON.stringify(r.measures, null, 2)}</div>*/}
				</tr>;
			})}
		</table>;
	};
}