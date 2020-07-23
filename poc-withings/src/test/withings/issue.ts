/*
 * Permissions management system, define access level for each of
 * your server apis, and restrict users by giving them access levels
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
import {
    __custom,
    __scenario
} from "@nu-art/testelot";
import {WithingsGetMeas} from "../../main/app-backend/modules/WithingsGetMeas";
import {
    assert,
    generateHex,
    StringMap
} from "@nu-art/ts-common";

const JSZip = require('jszip');

const baseProject = {
	id: "10030",
	key: "EAT"
};

export const issueScenario = __scenario('Issue');
const mySummary = generateHex(16);
let key: string;
let id: string;
const createIssue = __custom(async () => {
	const resp = await WithingsGetMeas.postIssueRequest(baseProject, {name: "Task"}, mySummary, "buggy!");
	key = resp.key;
}).setLabel('Create Issue');

const readIssue = __custom(async () => {
	const resp = await WithingsGetMeas.getIssueRequest(key);
	assert(`Summary doesn't match`, mySummary, resp.fields.summary)
}).setLabel('Retrieve issue');

const attachFile = __custom(async () => {
	const zip = new JSZip();
	zip.file('test.txt', generateHex(100));
	const buffer = await zip.generateAsync({type: "nodebuffer"});
	await WithingsGetMeas.addIssueAttachment(key, buffer)
}).setLabel('Retrieve issue');

const getIssueTypes = __custom(async () => {
	const resp = await WithingsGetMeas.getIssueTypes(baseProject.key);
	console.log(resp)
}).setLabel('Get Issue type');

const addComment = __custom(async () => {
	const resp = await WithingsGetMeas.addCommentRequest(id, "updating Alan's unit comments");
	console.log(resp)
}).setLabel('Add comment type');

const searchBySummary = __custom(async () => {
	const map: StringMap = {["cf[10056]"]: "ELQ190112180035"};
	const resp = await WithingsGetMeas.getIssueByCustomField(baseProject.key, map);
	id = resp.issues[0].key;
	console.log(id)
}).setLabel('search by summary');

const editFixedVersions = __custom(async () => {
	const fixedVersions = {
		fixVersions:
			[
				{
					name: "V26-1"
				}
			],
	};
	const resp = await WithingsGetMeas.editIssue(id, fixedVersions);
	console.log(resp)
}).setLabel('edit an issue');

issueScenario.add(addComment);

