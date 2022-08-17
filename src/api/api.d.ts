import { OccupancyTables } from './dynamics-api';
/* How this works:
	- API provides a common interface for fetching data either through the Dynamics webAPI or through custom portal endpoints, depending on where this app is run.
	- Authentication is implied through the existing session in both cases, so security is not our concern.
*/

export interface IOccupancyApi {
	getPatient(contactid: string): Promise<OccupancyTables.Contact>;
	getAccount(accountid: string): Promise<OccupancyTables.Account>;
	getPolicy(ren_insurancepolicyid: string): Promise<OccupancyTables.Ren_insurancepolicy>;
	getPhysician(ren_physicianid: string): Promise<OccupancyTables.Ren_physician>;

	getManifests(ren_facilityid: string, start_date: Date, end_date?: Date): Promise<OccupancyTables.Incident[]>;
	getHealthServices(ren_facilityid: string): Promise<OccupancyTables.Ren_service[]>;
	getServiceEvents(incidentid: string, start_date?: Date, end_date?: Date): Promise<OccupancyTables.Ren_serviceevent[]>;
	getAuthorizations(incidentid: string, start_date?: Date, end_date?: Date): Promise<OccupancyTables.Ren_authorization[]>;
	getNetworkStatus(ren_facilityid: string, ren_payerid: string): Promise<OccupancyTables.Ren_networkstatus | undefined>;

	createServiceEvent(ren_serviceevent: OccupancyTables.Ren_serviceevent): Promise<OccupancyTables.Ren_serviceevent>;
}
