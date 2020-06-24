import * as React from "react";
import {Component} from "react";
import {
	Adapter,
	AdapterBuilder,
	MenuComponent,
	ToastModule
} from "@nu-art/thunderstorm/frontend";
import {__stringify} from "@nu-art/ts-common";

export class Example_FlatSingleTypeMenu
	extends Component<{}> {

	render() {
		const adapter: Adapter = AdapterBuilder()
			.list()
			.singleRender((data: { item: string }) => <div>{data.item}</div>)
			.setData(['hi', 'bye', 'ciao', 'nice to meet', 'you'])
			.build()


		return <div>
			<div>
				<h2>Here is the same menu but as a component</h2>
				<MenuComponent adapter={adapter} onNodeClicked={(path: string, item: any) => ToastModule.toastInfo(`clicked on ${path}: ${__stringify(item)}`)}/>
			</div>
		</div>
	}
}
