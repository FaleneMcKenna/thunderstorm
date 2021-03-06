import * as React from "react";
import {BaseComponent} from "@nu-art/thunderstorm/frontend";
import {
	OnPermissionsChanged,
	PermissionsFE
} from "./PermissionsModuleFE";

declare type Props = {
	url: string
}

declare type State = {
	hasPermissions: false
}

export class PermissionsComponent
	extends BaseComponent<Props, State>
	implements OnPermissionsChanged {

	__onPermissionsChanged() {
		this.forceUpdate();
	}

	render() {
		const {url} = this.props;
		if (PermissionsFE.isUserHasPermissions(url))
			return <>{this.props.children}</>;

		return null;
	}
}