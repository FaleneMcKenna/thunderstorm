/**
 * Created by tacb0ss on 27/07/2018.
 */
module.exports = {
	HttpModule: {
		// origin: "http://192.168.1.5:3000",
		origin: "http://localhost:3333",
		timeout: 10000
	},
	frontend: {
		// origin: "http://192.168.1.5:3010",
		origin: "http://localhost:5010",
	},
	LocalizationModule: {
		defaultLocale: "en",
		locales: {
			"en": {
				label: "Language_English",
				icon: "languages/en",
			},
			"nl": {
				label: "Language_Dutch",
				icon: "languages/nl"
			}
		},
		languages: {
			"en": require(`./res/localization/en`),
			"nl": require(`./res/localization/nl`),
		}
	}
};
