import {FirebaseScheduledFunction} from "@nu-art/firebase/backend-functions";

export class NotifyScheduler_Class
	extends FirebaseScheduledFunction {

	constructor() {
		super("scheduler for Notify");
		this.setSchedule('every 2 minutes');
	}

	// onScheduledEvent = async (): Promise<any> => {
	//     console.log("Upsert new collected Data");
	//     await WithingsModule.getMeasRequest('ir-qa-012');
	//     //const timerId = setInterval(() => WithingsModule.getMeasRequest('ir-qa-012'), 2000);
	//      return WithingsModule.getMeasRequest('ir-qa-012')
	// };
	onScheduledEvent = async (): Promise<any> => {
		console.log("Update Node to trigger the measurements");

	};
}

export const NotifyScheduler = new NotifyScheduler_Class();