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
	Module,
	ImplementationMissingException,
	createReadableTimestampObject
} from "@nu-art/ts-common";
import {
	JiraModule,
	JiraProjectInfo
} from "./JiraModule"
import {
	ReportLogFile,
	Request_BugReport
} from "../..";
import {TicketDetails} from "./BugReportModule";

type Config = {
	jiraProject: JiraProjectInfo

}

class JiraBugReportIntegrator_Class
	extends Module<Config> {

	async openTicket(bugReport: Request_BugReport, logs: ReportLogFile[]): Promise<TicketDetails> {
		const description = logs.reduce((carry, el) => `${carry}${el.path}, `, `${bugReport.description}, `);
		if (!this.config.jiraProject)
			throw new ImplementationMissingException("missing Jira project in bug report configurations")

		const message = await JiraModule.postIssueRequest(this.config.jiraProject, {name: "Task"}, `Bug Report ${createReadableTimestampObject().pretty}`,
		                                                  description);
		return {platform: "jira", issueId: message.key};
	}
}

export const JiraBugReportIntegrator = new JiraBugReportIntegrator_Class();