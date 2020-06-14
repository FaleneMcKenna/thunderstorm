/*
 * Thunderstorm is a full web app framework!
 *
 * Typescript & Express backend infrastructure that natively runs on firebase function
 * Typescript & React frontend infrastructure
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

import * as React from "react";
import {TreeNode} from "./types";
import {
	Collapsed,
	Expanded
} from "../treeicons";
import {MenuItemWrapper} from "../../modules/menu/MenuModule";
import {stopPropagation} from "../../utils/tools";
import {RendererMap} from "../../types/renderer-map";


export const GenericRenderer_Default = (rendererMap: RendererMap) => {

	const renderCollapse = (expanded: boolean) => {
		const Comp = expanded ? Expanded : Collapsed;
		return <Comp style={{color: "#00000050", verticalAlign: "text-top"}}/>
	};

	return (props: TreeNode) => {
		const itemWrapper = props.item as MenuItemWrapper<any, any>;
		const item = itemWrapper.item;
		const type = itemWrapper.type;
		// props.item=item;
		const MyRenderer = rendererMap[type as string];
		// @ts-ignore
		const hasChildren = itemWrapper.length;

		return (
			<div style={hasChildren && {display: 'flex', justifyContent: 'space-between'}}>
				<MyRenderer item={item}/>
				{hasChildren && <div
					id={props.path}
					onMouseDown={stopPropagation}
					onMouseUp={(e) => props.expandToggler(e, !props.expanded)}
					style={{cursor: "pointer", marginRight: 10}}
				>{renderCollapse(props.expanded)}</div>}
			</div>
		)
	};
};