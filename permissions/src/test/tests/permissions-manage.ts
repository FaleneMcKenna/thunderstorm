import {
	__scenario,
	ContextKey,
	__custom,
	TestException
} from "@nu-art/testelot";
import {
	cleanup,
	ConfigDB,
	setupDatabase,
	testConfig1,
	testLevel1,
	testLevel2
} from "./_core";
import {
	AccessLevelPermissionsDB,
	ApiPermissionsDB,
	DomainPermissionsDB,
	GroupPermissionsDB,
	UserPermissionsDB
} from "../_main";
import {ApiException} from "@nu-art/thunderstorm/backend";
import {generateHex} from "@nu-art/ts-common";


const apiPath = 'v1/assert/something';
const wrongApiPath = 'v1/assert/**something';
const contextKey = new ContextKey<ConfigDB>("config");
const contextKey1 = new ContextKey<ConfigDB>("config-1");
const uniqId1 = '84e1113a558e4fd1bff55f991457a98e';
const uniqId2 = '62cba3dbdabf4bf6864b69a785cb8487';
const uniqId3 = 'a46ec503ca2a4db3a71ede82de26d180';
const uniqId4 = 'fcdd95d2441143dba57e4ced7ad7c88b';
const uniqId5 = '726a6783ecc14401a1b87ba43e8abd86';
const userUuid1 = 'test1@intuitionrobotics.com';
const userUuid2 = 'test2@intuitionrobotics.com';


export function createApi() {
	const scenario = __scenario("Create api");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey));
	scenario.add(__custom(async (action, data) => {
		await ApiPermissionsDB.upsert({projectId: testConfig1.project._id, path: apiPath, accessLevelIds: []});
	})).setReadKey(contextKey).setLabel("Add a new api");
	return scenario;
}

export function failedCreateApi() {
	const scenario = __scenario("Expect fail to create api");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await ApiPermissionsDB.upsert({projectId: testConfig1.project._id, path: wrongApiPath, accessLevelIds: []});
	}).setReadKey(contextKey1).setLabel("fail to create a new api as expect").expectToFail(ApiException));
	return scenario;
}

export function checkAccessLevelsPropertyOfGroup() {
	const scenario = __scenario("Create group with accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const group = await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1});
		if (!group.__accessLevels || !group.__accessLevels.length || group.__accessLevels[0].value !== data.level.value) {
			throw new TestException("Didn't add __accessLevels to group");
		}
	}).setReadKey(contextKey1).setLabel('Group with __accessLevel has created'));
	return scenario;
}

export function checkUpdateOfGroupAccessLevelsProperty() {
	const scenario = __scenario("Update group accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const group = await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1});
		group.accessLevelIds = [];
		const updatedGroup = await GroupPermissionsDB.upsert(group);
		if (updatedGroup.__accessLevels && updatedGroup.__accessLevels.length) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group accessLevelIds has updated successfully'));
	return scenario;
}

export function checkUpdateOfGroupAccessLevelsPropertyToHigherValue() {
	const scenario = __scenario("Update group with adding higher accessLevel - same domain, expect to fail");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const group = await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1});
		const higherValueLevel = await AccessLevelPermissionsDB.upsert({...testLevel2, domainId: data.level.domainId});
		if (!group.accessLevelIds || !group.accessLevelIds.length) {
			throw new TestException("Didn't insert the group properly");
		}

		group.accessLevelIds.push(higherValueLevel._id);
		const updatedGroup = await GroupPermissionsDB.upsert(group);
		if (!updatedGroup.__accessLevels || updatedGroup.__accessLevels.length !== 1 || updatedGroup.__accessLevels[0].value !== testLevel2.value) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group accessLevelIds has updated successfully with the higher value').expectToFail(ApiException));
	return scenario;
}

export function checkPatchOfGroupAccessLevelsProperty() {
	const scenario = __scenario("Patch group accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const group = await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1, customFields: []});
		group.accessLevelIds = [];
		const updatedGroup = await GroupPermissionsDB.patch(group);
		if (updatedGroup.__accessLevels && updatedGroup.__accessLevels.length) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group accessLevelIds has updated successfully'));
	return scenario;
}

export function checkPatchOfGroupAccessLevelsPropertyToHigherValue() {
	const scenario = __scenario("Patch group with adding higher accessLevel - same domain, expect to fail");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const group = await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1, customFields: []});
		const higherValueLevel = await AccessLevelPermissionsDB.upsert({...testLevel2, domainId: data.level.domainId});
		if (!group.accessLevelIds || !group.accessLevelIds.length) {
			throw new TestException("Didn't insert the group properly");
		}

		group.accessLevelIds.push(higherValueLevel._id);
		const updatedGroup = await GroupPermissionsDB.patch(group);
		if (!updatedGroup.__accessLevels || updatedGroup.__accessLevels.length !== 1 || updatedGroup.__accessLevels[0].value !== testLevel2.value) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group accessLevelIds has updated successfully with the higher value').expectToFail(ApiException));
	return scenario;
}

export function checkUpdateOfUserAccessLevelsPropertyToHigherValue() {
	const scenario = __scenario("Update user with higher accessLevel - same domain, expect to fail");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const user = await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1});
		const higherValueLevel = await AccessLevelPermissionsDB.upsert({...testLevel2, domainId: data.level.domainId});
		if (!user.accessLevelIds) {
			throw new TestException("Didn't insert the user properly");
		}

		user.accessLevelIds.push(higherValueLevel._id);
		const updatedUser = await UserPermissionsDB.upsert(user);
		if (!updatedUser.__accessLevels || updatedUser.__accessLevels.length !== 1 || updatedUser.__accessLevels[0].value !== testLevel2.value) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User accessLevelIds has updated successfully with the higher value').expectToFail(ApiException));
	return scenario;
}

export function checkGroupAccessLevelsAfterUpdatingLevelDocument() {
	const scenario = __scenario("Check group access level after updating level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1});
		const newLevelValue = 353;
		data.level.value = newLevelValue;
		await AccessLevelPermissionsDB.upsert(data.level);
		const group = await GroupPermissionsDB.queryUnique({_id: uniqId1});

		if (!group.__accessLevels || group.__accessLevels.length !== 1 || group.__accessLevels[0].value !== newLevelValue) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group __accessLevels has updated successfully by updating level document'));
	return scenario;
}

export function checkUserAccessLevelsAfterUpdatingLevelDocument() {
	const scenario = __scenario("Check user access level after updating level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1});
		const newLevelValue = 353;
		data.level.value = newLevelValue;
		await AccessLevelPermissionsDB.upsert(data.level);
		const user = await UserPermissionsDB.queryUnique({uuid: userUuid1});

		if (!user.__accessLevels || user.__accessLevels.length !== 1 || user.__accessLevels[0].value !== newLevelValue) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User __accessLevels has updated successfully by updating level document'));
	return scenario;
}

export function checkPatchOfUserAccessLevelsPropertyToHigherValue() {
	const scenario = __scenario("Patch user with higher accessLevel - same domain, expect to fail");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const user = await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1, customFields: [], groupIds: []});
		const higherValueLevel = await AccessLevelPermissionsDB.upsert({...testLevel2, domainId: data.level.domainId});
		if (!user.accessLevelIds) {
			throw new TestException("Didn't insert the user properly");
		}

		user.accessLevelIds.push(higherValueLevel._id);
		const updatedUser = await UserPermissionsDB.patch(user);
		if (!updatedUser.__accessLevels || updatedUser.__accessLevels.length !== 1 || updatedUser.__accessLevels[0].value !== testLevel2.value) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User accessLevelIds has updated successfully with the higher value').expectToFail(ApiException));
	return scenario;
}

export function checkGroupAccessLevelsAfterPatchingLevelDocument() {
	const scenario = __scenario("Check group access level after patching level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [data.level._id], _id: uniqId1, customFields: []});
		const newLevelValue = 353;
		data.level.value = newLevelValue;
		await AccessLevelPermissionsDB.patch(data.level);
		const group = await GroupPermissionsDB.queryUnique({_id: uniqId1});

		if (!group.__accessLevels || group.__accessLevels.length !== 1 || group.__accessLevels[0].value !== newLevelValue) {
			throw new TestException("Didn't update group __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('Group __accessLevels has updated successfully by updating level document'));
	return scenario;
}

export function checkUserAccessLevelsAfterPatchingLevelDocument() {
	const scenario = __scenario("Check user access level after patching level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1, customFields: []});
		const newLevelValue = 353;
		data.level.value = newLevelValue;
		await AccessLevelPermissionsDB.patch(data.level);
		const user = await UserPermissionsDB.queryUnique({uuid: userUuid1});

		if (!user.__accessLevels || user.__accessLevels.length !== 1 || user.__accessLevels[0].value !== newLevelValue) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User __accessLevels has updated successfully by updating level document'));
	return scenario;
}

export function checkAccessLevelsPropertyOfUser() {
	const scenario = __scenario("Create user with accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const user = await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1});
		if (!user.__accessLevels || !user.__accessLevels.length || user.__accessLevels[0].value !== data.level.value) {
			throw new TestException("Didn't add __accessLevels to user");
		}
	}).setReadKey(contextKey1).setLabel('User with __accessLevel has created'));
	return scenario;
}

export function checkUpdateOfUserAccessLevelsProperty() {
	const scenario = __scenario("Update user accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const user = await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1});
		user.accessLevelIds = [];
		const updatedUser = await UserPermissionsDB.upsert(user);
		if (updatedUser.__accessLevels && updatedUser.__accessLevels.length) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User accessLevelIds has updated successfully'));
	return scenario;
}

export function checkPatchOfUserAccessLevelsProperty() {
	const scenario = __scenario("Patch user accessLevelIds");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const user = await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [data.level._id], _id: uniqId1, customFields: [], groupIds: []});
		user.accessLevelIds = [];
		const updatedUser = await UserPermissionsDB.patch(user);
		if (updatedUser.__accessLevels && updatedUser.__accessLevels.length) {
			throw new TestException("Didn't update user __accessLevels");
		}
	}).setReadKey(contextKey1).setLabel('User accessLevelIds has updated successfully'));
	return scenario;
}

export function createTowGroups() {
	const scenario = __scenario("Create two groups");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group one', accessLevelIds: [uniqId3], _id: uniqId1});
		await GroupPermissionsDB.upsert({label: 'test group two', accessLevelIds: [], _id: uniqId2});
	}).setLabel('Two groups created'));
	return scenario;
}

export function createGroupWithLegalCustomField() {
	const scenario = __scenario("Create group with legal customFields");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group one', customFields: [{UnitId: generateHex(500), Production: 'false'}], _id: uniqId1});
	}).setLabel('Group was created with legal customFields'));
	return scenario;
}

export function failToCreateGroupWithIllegalCustomField() {
	const scenario = __scenario("Fail to create group with illegal customFields");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group one', customFields: [{UnitId: generateHex(501), Production: 'false'}], _id: uniqId1});
	}).setLabel('Group created was failed because of illegal customFields')
	  .expectToFail(ApiException));
	return scenario;
}

export function failedCreateTwoGroupsWithSameName() {
	const scenario = __scenario("Expect Fail to create permissions group with the same name");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test group', accessLevelIds: [uniqId3], _id: uniqId1});
		await GroupPermissionsDB.upsert({label: 'test group', accessLevelIds: [], _id: uniqId2});
	}).setLabel('Fail to create two groups with the same name, as expected')
	  .expectToFail(ApiException));
	return scenario;
}

export function failedCreateGroupWithDuplicateAccessLevel() {
	const scenario = __scenario("Expect Fail to bind duplicate levels to group");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await GroupPermissionsDB.upsert({label: 'test', accessLevelIds: [uniqId3, uniqId3], _id: uniqId1});
	}).setLabel('Fail to bind duplicate levels to group, as expected')
	  .expectToFail(ApiException));
	return scenario;
}

export function checkInsertUserIfNotExist() {
	const scenario = __scenario("Check insertIfNotExist by doesn't exist user");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.insertIfNotExist(userUuid1);
		await UserPermissionsDB.queryUnique({uuid: userUuid1});
	}).setLabel('Insert not exist user'));
	return scenario;
}

export function checkInsertUserIfNotExistByExistUser() {
	const scenario = __scenario("Check insertIfNotExist function by exist user");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, groupIds: [], accessLevelIds: [uniqId3], _id: uniqId1});
		await UserPermissionsDB.insertIfNotExist(userUuid1);
		await UserPermissionsDB.queryUnique({uuid: userUuid1});
	}).setLabel('Skip insert exist user'));
	return scenario;
}

export function createTowUsers() {
	const scenario = __scenario("Create two users");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, groupIds: [], accessLevelIds: [uniqId3], _id: uniqId1});
		await UserPermissionsDB.upsert({uuid: userUuid2, groupIds: [uniqId4, uniqId5], accessLevelIds: [], _id: uniqId2});
	}).setLabel('Two users created'));
	return scenario;
}

export function failedCreateUserWithDuplicateAccessLevel() {
	const scenario = __scenario("Expect Fail to bind duplicate levels to user");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, accessLevelIds: [uniqId3, uniqId3], _id: uniqId1});
	}).setLabel('Fail to bind duplicate levels to user, as expected')
	  .expectToFail(ApiException));
	return scenario;
}

export function failedCreateUserWithDuplicateGroups() {
	const scenario = __scenario("Expect Fail to bind duplicate groups to user");
	scenario.add(cleanup());
	scenario.add(__custom(async (action, data) => {
		await UserPermissionsDB.upsert({uuid: userUuid1, groupIds: [uniqId2, uniqId2], _id: uniqId1});
	}).setLabel('Fail to bind duplicate groups to user, as expected')
	  .expectToFail(ApiException));
	return scenario;
}

export function createApiWithAccessLevel() {
	const scenario = __scenario("Create api with access levels");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey));
	scenario.add(__custom(async (action, data) => {
		await ApiPermissionsDB.upsert({path: apiPath, accessLevelIds: [data.level._id], projectId: data.project._id});
	}).setReadKey(contextKey).setLabel('Created api with access levels'));
	return scenario;
}

export function tryDeleteDomainAssociatedWithAccessLevel() {
	const scenario = __scenario("Try delete domain associated with level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await DomainPermissionsDB.deleteUnique(data.domain._id);
	}).setReadKey(contextKey1).setLabel('Expect to fail deleting domain associated with level').expectToFail(ApiException));
	return scenario;
}

export function tryDeleteAccessLevelAssociatedWithGroup() {
	const scenario = __scenario("Try delete access level associated with group");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const levelId = data.level._id;
		await GroupPermissionsDB.upsert({_id: uniqId1, accessLevelIds: [levelId], label: "group-test"});
		await AccessLevelPermissionsDB.deleteUnique(levelId);
	}).setReadKey(contextKey1).setLabel('Expect to fail deleting access level associated with group').expectToFail(ApiException));
	return scenario;
}

export function tryDeleteAccessLevelAssociatedWithApi() {
	const scenario = __scenario("Try delete access level associated with api");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		const levelId = data.level._id;
		await ApiPermissionsDB.upsert({_id: uniqId1, accessLevelIds: [levelId], projectId: data.project._id, path: apiPath});
		await AccessLevelPermissionsDB.deleteUnique(levelId);
	}).setReadKey(contextKey1).setLabel('Expect to fail deleting access level associated with api').expectToFail(ApiException));
	return scenario;
}

export function checkDeleteAccessLevelsDocument() {
	const scenario = __scenario("Check delete access level");
	scenario.add(cleanup());
	scenario.add(setupDatabase(testConfig1, testLevel1).setWriteKey(contextKey1));
	scenario.add(__custom(async (action, data) => {
		await AccessLevelPermissionsDB.deleteUnique(data.level._id);
	}).setReadKey(contextKey1).setLabel('Access level deleted successfully'));
	return scenario;
}