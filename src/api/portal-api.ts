import { faker } from '@faker-js/faker';
import { IOccupancyApi } from './api';
import { OccupancyTables } from './dynamics-api';
import { sample } from './mock-api.helper';
import axios from "axios";

function randomInt(max: number): number {
	return faker.mersenne.rand(max);
}

function startOfMonth(month?: number): Date {
	const current = new Date();
	const startOfMonth = new Date(current.getFullYear(), month || current.getMonth(), 1);

	return startOfMonth;
}

function endOfMonth(month?: number): Date {
	const current = new Date();
	const endOfMonth = new Date(current.getFullYear(), (month || current.getMonth()) + 1, 0);

	return endOfMonth;
}


export const PortalApi: IOccupancyApi = {
	getPatient(contactid: string): Promise<OccupancyTables.Contact> {
		console.log('getPatient', contactid);
		return Promise.resolve(new OccupancyTables.Contact({
			contactid,
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			birthdate: faker.date.birthdate().toISOString(),
			ren_ssn: '123-45-6789',
			telephone1: faker.phone.number(),
			address1_line1: faker.address.streetAddress(),
			address1_city: faker.address.city(),
			address1_stateorprovince: faker.address.stateAbbr(),
			address1_country: faker.address.country(),
			address1_postalcode: faker.address.zipCode()
		}));
	},
	getAccount(accountid: string): Promise<OccupancyTables.Account> {
		console.log('getAccount', accountid);
		return Promise.resolve(new OccupancyTables.Account({
			accountid,
			name: faker.company.companyName()
		}));
	},
	getPolicy(ren_insurancepolicyid: string): Promise<OccupancyTables.Ren_insurancepolicy> {
		console.log('getPolicy', ren_insurancepolicyid);
		return Promise.resolve(new OccupancyTables.Ren_insurancepolicy({
			ren_insurancepolicyid,
			ren_groupnumber: 'GROUPNUM',
			ren_name: 'POLICYNUM',
			_ren_payer_value: 'payer-' + faker.random.numeric(3),
			// ren_relationtopatient: '910190000' // Self (Check this against what API actually returns!)
		}))
	},

	getPhysician(ren_physicianid: string): Promise<OccupancyTables.Ren_physician> {
		console.log('getPhysician', ren_physicianid);
		return Promise.resolve(new OccupancyTables.Ren_physician({
			ren_physicianid,
			ren_salutation: faker.name.prefix(),
			ren_firstname: faker.name.firstName(),
			ren_lastname: faker.name.lastName(),
			ren_jobtitle: 'Super Developer',
		}))

	},
	getManifests(ren_facilityid: string, start_date: Date, end_date?: Date): Promise<OccupancyTables.Incident[]> {
		console.log('getManifests', ren_facilityid, start_date, end_date);

		let results_api:any = [];

		return axios.get('https://prosperitysandbox.powerappsportals.com/ren-api/ren-incident')
		.then((response) => {
			results_api = response.data.results;
			return Promise.resolve(results_api);
		});
	},

	getHealthServices(ren_facilityid: string): Promise<OccupancyTables.Ren_service[]> {
		console.log('getHealthServices');
	
		let results_api:any = [];

		return axios.get('https://prosperitysandbox.powerappsportals.com/ren-api/ren-api-service')
		.then((response) => {
			results_api = response.data.results;
			return Promise.resolve(results_api);
		});
		
	},

	getServiceEvents(incidentid: string, start_date?: Date, end_date?: Date): Promise<OccupancyTables.Ren_serviceevent[]> {
		const mockSE = () => {
			const healthserviceid = sample(['dtxid', 'rtxid']);

			const _start_date = start_date || faker.date.between(startOfMonth(), new Date());
			const _end_date   = end_date   || faker.date.between(_start_date, endOfMonth());

			const _ren_authorization_value = undefined;
			const _ren_diagnosis_value = undefined;
			const ren_servicedate = faker.date.between(_start_date, _end_date).toISOString();

			return new OccupancyTables.Ren_serviceevent({
				statecode: 0,
				ren_serviceeventid: 'ren_serviceeventid-' + randomInt(1000),
				createdon: start_date ? start_date.toISOString() : new Date().toISOString(),
				_ren_healthservice_value: healthserviceid,
				_ren_episodeofcare_value: incidentid,
				ren_units: 1.00,
				_ren_authorization_value,
				ren_revcode: '123456',
				ren_hcpcscode: 'hcpcscode',
				statuscode: '0',
				_ren_diagnosis_value,
				ren_servicedate,
			});
		}

		const count = randomInt(20);
		let service_events = [];

		for (let i = 0 ; i < count ; i++ ) {
			service_events.push(mockSE());
		}

		return Promise.resolve(service_events);
	},

	getAuthorizations(incidentid: string, start_date?: Date, end_date?: Date): Promise<OccupancyTables.Ren_authorization[]> {
		console.log('getAuthorizations', incidentid, start_date, end_date);
		const mockAuth = () => {
			const _start_date = start_date || faker.date.between(startOfMonth(), new Date());
			const _end_date   = end_date   || faker.date.between(_start_date, endOfMonth());

			const ren_startdate = faker.date.between(_start_date, _end_date).toISOString();
			const ren_enddate = faker.date.between(ren_startdate, _end_date).toISOString();

			return new OccupancyTables.Ren_authorization({
				statecode: 0,
				createdon: new Date().toISOString(),
				ren_obtainedbyname: 'Mr. Obtainable',
				ren_notes: 'Notes visible to user ' + faker.hacker.phrase(),
				statuscode: '12345',
				_ren_service_value: sample(['dtxid', 'rtxid']),
				ren_units: 1.00,
				ren_startdate,
				ren_enddate,
				ren_name: `auth-${faker.random.alphaNumeric(4)}`,
				_ren_episodeofcare_value: incidentid,
				ren_nextreviewdate: faker.helpers.maybe(() => faker.date.soon().toISOString()),
				ren_dateobtained: faker.date.recent().toISOString(),
			});
		}

		const count = randomInt(20);
		let auths = [];

		for (let i = 0 ; i < count ; i++ ) {
			auths.push(mockAuth());
		}

		return Promise.resolve(auths);
	},

	getNetworkStatus(ren_facilityid: string, ren_payerid: string): Promise<OccupancyTables.Ren_networkstatus | undefined> {
		const mockNetworkStatus = () => {
			return new OccupancyTables.Ren_networkstatus({
				ren_name: faker.company.companyName(),
				ren_statecode: 0,
				ren_statuscode: 1,
				createdon: faker.date.recent().toISOString(),
				_ren_facility_value: ren_facilityid,
				_ren_payer_value: ren_payerid
			});
		}
		return Promise.resolve(faker.helpers.maybe(mockNetworkStatus));
	},

	createServiceEvent(ren_serviceevent: OccupancyTables.Ren_serviceevent): Promise<OccupancyTables.Ren_serviceevent> {
		console.log('createServiceEvent', ren_serviceevent);
		return Promise.resolve(ren_serviceevent);
	}
};

export default PortalApi;




function DatosDemo_services(){

	let result:any=[
		{"ren_serviceid":"eceb33eb-dcf7-ec11-bb3d-000d3a1fae79", "ren_name":"Detox", "ren_servicecode":"DTX", "statecode": 0},
		{"ren_serviceid":"6d7bcd0c-6bee-ec11-bb3d-0022482e3da3", "ren_name":"Residential Treatment", "ren_servicecode":"RTX", "statecode": 0},
		{"ren_serviceid":"500b1ae0-fcf6-ec11-bb3d-000d3a4f99fc", "ren_name":"Special Effects", "ren_servicecode":"FX", "statecode": 0}
	]

	return result;

}


function DatosDemo_incidents(){

	let result:any=[
		{"incidentid":"4775c77d-0b14-ed11-b83d-00224823504d", "title":"Beack McBeachyson  - ", "_ren_patient_value":"1199e05a-0b14-ed11-b83d-00224823504d", "_ren_primarypolicy_value":"4675c77d-0b14-ed11-b83d-00224823504d", "ren_startofcare":"", "ren_endofcare":"", "_ren_facility_value": "89a23872-0b14-ed11-b83d-00224823504d"},
		{"incidentid":"698e3e2e-bc18-ed11-b83e-000d3a9b031d", "title":"Carlos H Lopez J  - ", "_ren_patient_value":"dccd7fdf-2f13-ed11-b83d-002248235d39", "_ren_primarypolicy_value":"78396e44-3013-ed11-b83d-002248235d39",  "ren_startofcare":"", "ren_endofcare":"", "_ren_facility_value": "89a23872-0b14-ed11-b83d-00224823504d"},
		{"incidentid":"4aa9341b-2118-ed11-b83e-000d3a9b031d", "title":"David Duchovny  - ", "_ren_patient_value":"aab3da4d-a20e-ed11-82e5-0022481c61be", "_ren_primarypolicy_value":"49a9341b-2118-ed11-b83e-000d3a9b031d", "ren_startofcare":"", "ren_endofcare":"", "_ren_facility_value": "89a23872-0b14-ed11-b83d-00224823504d"}
	]

	return result;

}

/* 
fetch('https://prosperitysandbox.powerappsportals.com/ren-api/ren-api-service')
.then(response => response.json())
.then(data => health_services_p = data);

fetch('https://prosperitysandbox.powerappsportals.com/ren-api/ren-incident')
.then(response => response.json())
.then(data => manifests_p = data); 
*/