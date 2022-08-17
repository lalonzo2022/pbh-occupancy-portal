import { IOccupancyApi } from "../api";
import { OccupancyTables } from "./OccupancyTables";
import { formatDate } from '../api.helper';

const webApi = new OccupancyTables.WebApi();

// TODO: Perhaps set the url before usage?
// NOTE: Not setting the url means this targets the current dynamics environment
webApi.setUrl('');

export const DynamicsApi: IOccupancyApi = {
	getManifests(facility_id: string, start_date: Date, end_date?: Date) {
		const entity = new OccupancyTables.Incident();
		const fetchXml = `<fetch top="50">
  <entity name="incident">
    <attribute name="ren_lastorentry" />
    <attribute name="ren_validatedby" />
    <attribute name="ren_countserviceevent" />
    <attribute name="ren_precert" />
    <attribute name="ren_totalunitsused" />
    <attribute name="ren_lastauthby" />
    <attribute name="ren_facility" />
    <attribute name="ren_totalunitsauthorized" />
    <attribute name="ren_patient" />
    <attribute name="ren_lastpaymentposted" />
    <attribute name="ren_secondarypolicy" />
    <attribute name="ren_firstauthon" />
    <attribute name="ren_validated" />
    <attribute name="ren_firstvobby" />
    <attribute name="ren_completedon" />
    <attribute name="ren_firstbillingon" />
    <attribute name="ren_primarypolicy" />
    <attribute name="ren_startofcare" />
    <attribute name="ren_thirdpolicy" />
    <attribute name="ren_lastauthon" />
    <attribute name="ren_endofcare" />
    <attribute name="ren_firstvobon" />
    <attribute name="ren_firstbillingby" />
    <attribute name="ren_firstauthby" />
    <link-entity name="ren_facility" from="ren_facilityid" to="ren_facility" alias="bb">
      <filter type="and">
        <condition attribute="ren_facilityid" uitype="ren_facility" operator="eq" value="${facility_id}" />
      </filter>
    </link-entity>
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0"/>
      <condition attribute="ren_startofcare" operator="on-or-after" value="${formatDate(start_date.toISOString())}" />
      ${ end_date ? `<condition attribute="ren_endofcare" operator="on-or-before" value="${formatDate(end_date.toISOString())}" />` : '' }
    </filter>
  </entity>
</fetch>`;

		return webApi.fetchXml<OccupancyTables.IIncidents>(entity, fetchXml).then(
      (incidents) => incidents.value.map(
        (e) => new OccupancyTables.Incident(e)
      ) );
	},

  getPatient(contactid: string) {
    const entity = new OccupancyTables.Contact({ contactid });

    return webApi.retrieve<OccupancyTables.Contact>(entity);
  },

  getAccount(accountid: string) {
    const entity = new OccupancyTables.Account({ accountid });
    return webApi.retrieve<OccupancyTables.Account>(entity);
  },

  getPolicy(ren_insurancepolicyid: string) {
    const entity = new OccupancyTables.Ren_insurancepolicy({ ren_insurancepolicyid });
    return webApi.retrieve<OccupancyTables.Ren_insurancepolicy>(entity);
  },

  getPhysician(ren_physicianid: string) {
    const entity = new OccupancyTables.Ren_physician({ ren_physicianid });
    return webApi.retrieve<OccupancyTables.Ren_physician>(entity);
  },

  getHealthServices(ren_facilityid: string) {
    const entity = new OccupancyTables.Ren_service();
    const fetchxml = `<fetch version="1.0" mapping="logical" returntotalrecordcount="true">
  <entity name="ren_service">
    <attribute name="statecode" />
    <attribute name="ren_serviceid" />
    <attribute name="ren_name" />
    <order attribute="ren_name" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
    <attribute name="ren_servicecode" />
    <link-entity name="ren_facility_ren_service" intersect="true" visible="false" to="ren_serviceid" from="ren_serviceid">
      <link-entity name="ren_facility" from="ren_facilityid" to="ren_facilityid" alias="bb">
        <filter type="and">
          <condition attribute="ren_facilityid" operator="eq" uitype="ren_facility" value="${ren_facilityid}" />
        </filter>
      </link-entity>
    </link-entity>
  </entity>
</fetch>`;

    return webApi.fetchXml<OccupancyTables.IRen_services>(entity, fetchxml).then(
      (ren_services) => ren_services.value.map(
        (e) => new OccupancyTables.Ren_service(e)
      )
    );
  },

  getServiceEvents(incidentid, start_date?, end_date?) {
    const entity = new OccupancyTables.Ren_serviceevent();
    const fetchxml = `<fetch version="1.0" mapping="logical" returntotalrecordcount="true" no-lock="false">
  <entity name="ren_serviceevent">
    <attribute name="statecode" />
    <attribute name="ren_serviceeventid" />
    <attribute name="createdon" />
    <attribute name="ren_healthservice" />
    <attribute name="ren_units" />
    <attribute name="ren_authorization" />
    <attribute name="ren_revcode" />
    <attribute name="ren_hcpcscode" />
    <order attribute="ren_name" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
    <attribute name="statuscode" />
    <attribute name="ren_diagnosis" />
    <attribute name="ren_servicedate" />
    <attribute name="ren_service" />
    <link-entity name="incident" from="incidentid" to="ren_episodeofcare" alias="bb">
      <filter type="and">
        <condition attribute="incidentid" operator="eq" uitype="incident" value="${incidentid}" />
        ${ start_date ? `<condition attribute="ren_servicedate" operator="on-or-after" value="${formatDate(start_date.toISOString())}" />` : '' }
        ${ end_date ? `<condition attribute="ren_servicedate" operator="on-or-before" value="${formatDate(end_date.toISOString())}" />` : '' }
      </filter>
    </link-entity>
  </entity>
</fetch>`;

    return webApi.fetchXml<OccupancyTables.IRen_serviceevents>(entity, fetchxml).then(
      (ren_serviceevents) => ren_serviceevents.value.map(
        (e) => new OccupancyTables.Ren_serviceevent(e)
      )
    );
  },

  getAuthorizations(incidentid, start_date?, end_date?) {
    const entity = new OccupancyTables.Ren_authorization();
    const fetchxml = `<fetch no-lock="true" returntotalrecordcount="true">
  <entity name="ren_authorization">
    <attribute name="statecode" />
    <attribute name="ren_authorizationid" />
    <attribute name="createdon" />
    <attribute name="ren_obtainedby" />
    <attribute name="ren_notes" />
    <attribute name="statuscode" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
    <attribute name="ren_service" />
    <attribute name="ren_units" />
    <attribute name="ren_startdate" />
    <attribute name="ren_enddate" />
    <attribute name="ren_name" />
    <order attribute="ren_name" descending="false" />
    <attribute name="ren_episodeofcare" />
    <attribute name="ren_nextreviewdate" />
    <attribute name="ren_dateobtained" />
    <link-entity name="incident" from="incidentid" to="ren_episodeofcare" alias="bb">
      <filter type="and">
        <condition attribute="incidentid" operator="eq" uitype="incident" value="${incidentid}" />
        ${ start_date ? `<condition attribute="ren_startdate" operator="on-or-after" value="${formatDate(start_date.toISOString())}" />` : '' }
        ${ end_date ? `<condition attribute="ren_enddate" operator="on-or-before" value="${formatDate(end_date.toISOString())}" />` : '' }
      </filter>
    </link-entity>
  </entity>
</fetch>`;

    return webApi.fetchXml<OccupancyTables.IRen_authorizations>(entity, fetchxml).then(
      (ren_authorizations) => ren_authorizations.value.map(
        (e) => new OccupancyTables.Ren_authorization(e)
      )
    );
  },

  getNetworkStatus(ren_facilityid, ren_payerid) {
    const entity = new OccupancyTables.Ren_networkstatus();
    const fetchxml = `<fetch distinct="true" returntotalrecordcount="true">
  <entity name="ren_networkstatus">
    <attribute name="ren_name" />
    <attribute name="statecode" />
    <attribute name="ren_networkstatusid" />
    <attribute name="createdon" />
    <attribute name="ren_facility" />
    <filter type="and">
      <condition attribute="statuscode" operator="eq" value="1" />
    </filter>
    <attribute name="createdby" />
    <attribute name="ren_payer" />
    <link-entity name="ren_facility" from="ren_facilityid" to="ren_facility" alias="bb">
      <filter type="and">
        <condition attribute="ren_facilityid" operator="eq" uitype="ren_facility" value="${ren_facilityid}" />
        <condition attribute="ren_payerid" operator="eq" uitype="ren_payer" value="${ren_payerid}" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

    return webApi.fetchXml<OccupancyTables.IRen_networkstatuss>(entity, fetchxml).then(
      (ren_networkstatuss) => new OccupancyTables.Ren_networkstatus(ren_networkstatuss.value[0])
    );
  },

  createServiceEvent(ren_serviceevent) {
    return webApi.create<OccupancyTables.Ren_serviceevent>(ren_serviceevent, false, true);
  }


}

export default DynamicsApi;