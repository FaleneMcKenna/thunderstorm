import * as React from "react";
import {BaseComponent} from "../../core/BaseComponent";
import {
	Menu,
	Menu_Model,
	MenuBuilder,
	MenuListener,
	resolveRealPosition
} from "./MenuModule";
import {BadImplementationException} from "@nu-art/ts-common";
import {ReactNode} from "react";

type Props = {
	id: string
	iconOpen: ReactNode
	iconClosed: ReactNode
	menu: Menu<any>
}

export class MenuAndButton
	extends BaseComponent<Props, { isOpen: boolean, over: boolean }>
	implements MenuListener {

	ref = React.createRef<HTMLImageElement>();

	state = {
		isOpen: false,
		over: false
	};

	__onMenuHide = (id: string) => {
		if (this.props.id !== id)
			return;

		this.setState({isOpen: false});
	};

	__onMenuDisplay = (menu: Menu_Model) => {
		if (this.props.id !== menu.id)
			return;

		this.setState({isOpen: true});
	};

	render() {
		return <div className={'clickable'} onClick={this.open} style={{position: "relative", padding: 10}}>
			<div ref={this.ref}
			     onMouseOver={e => this.setState({over: true})}
			     onMouseOut={e => this.setState({over: false})}>
				{this.state.isOpen || this.state.over ? this.props.iconClosed : this.props.iconOpen}
			</div>
		</div>
	}

	open = () => {
		if (!this.ref.current)
			throw new BadImplementationException("Could not find image reference");

		new MenuBuilder(this.props.menu, resolveRealPosition(this.ref.current))
			.setId(this.props.id)
			.show()
	}
}