import * as React from "react";
import {GenericSelect} from "@nu-art/thunderstorm/app-frontend/components/GenericSelect";
import {unitStyle} from "../ui/SelectStyle";

const iconClose = require('@res/images/icon__arrowClose.svg');
const iconOpen = require('@res/images/icon__arrowOpen.svg');

type State = {
	selectedOption?: Option
}

type Option = {
	title: string
	value: number
}

const options: Option[] = [
	{
		title: "one",
		value: 1
	},
	{
		title: "two",
		value: 2
	}
];

export class GenericSelectPlayground extends React.Component<{}, State> {

	constructor(props: {}) {
		super(props);
		this.state = {
			selectedOption: undefined
		}
	}

	render(){
		return <GenericSelect<Option>
			iconClose={iconClose}
			iconOpen={iconOpen}
			selectedOption={this.state.selectedOption}
			options={options}
			onChange={(o: Option) => {
				console.log(`selected ${o.title}`);
				this.setState({selectedOption: o});
			}}
			styles={unitStyle}
			presentation={(o) => o.title}
		/>
	}
}

