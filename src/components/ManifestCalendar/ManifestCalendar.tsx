import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useContext } from 'react';
import PatientInfoCell from '../PatientInfoCell';
import FullCalendar, { CalendarOptions, DateSelectArg, EventInput, EventSourceFunc } from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import useApi, { OccupancyTables } from '../../api';
import { ColCellContentArg, ResourceInput } from '@fullcalendar/resource-common';
import { Shimmer } from '@fluentui/react';
import XrmContext from '../../contexts/XrmContext';
import { SelectedManifestContext } from '../../contexts/SelectedManifestContext';
import { DateContext } from '../../contexts/DateContext';
import FacilityContext from '../../contexts/FacilityContext';

export const ManifestTable: React.FC<{}> = (props) => {
	const api = useApi();
	const facility = useContext(FacilityContext);
	const { selectedManifest, selectManifest } = useContext(SelectedManifestContext);
	const { date, setDate } = React.useContext(DateContext);

	const health_services = useQuery(['healthservices', { facility }], () => api.getHealthServices(facility));
	const manifests = useQuery(['manifests', { facility, date }], () => api.getManifests(facility, date.start, date.end), { staleTime: 5 * 60 * 1000 /* Manifests are valid for 5 minutes */ });

	const events: EventSourceFunc = ({ start, end }, success, fail) => {
		// Look up events for all manifests given the start and end date we get.
		// return event objects for all of them.
		let events: EventInput[] = [];
		let promises: Promise<EventInput[]>[] = [];

		if (manifests.data && health_services.data) {

			manifests.data.forEach( (manifest) => {
				health_services!.data.forEach( (health_service) => {
					const resourceId = `${manifest.id}--${health_service.id}`;

					promises.push(
						// TODO: We could send a single request to the api with all incidentids
						api.getServiceEvents(manifest!.incidentid!, start, end).then(
							(service_events) => {
								const event_items = service_events.map<EventInput>((service_event) => {
									return {
										id: service_event.ren_serviceeventid,
										resourceId,
										title: health_service.ren_servicecode,
										allDay: true,
										start: new Date(service_event.ren_servicedate!),
										end: new Date(service_event.ren_servicedate!),
									}
								});

								return event_items;
							}
						)
					);
				});
			});

			Promise.all(promises).then( some_events => {
				success(events.concat(...some_events));
			});
		}
	}

	const loading = health_services.status === 'loading' || manifests.status === 'loading';

	let resources: ResourceInput[] = [];
	
	if (manifests.data && health_services.data) {
		manifests.data.forEach( (manifest) =>
			health_services.data.forEach( (health_service) => {
				const resourceId = `${manifest.id}--${health_service.id}`;

				const resource: ResourceInput = {
					id: resourceId,
					title: manifest.title,
					incidentid: manifest.id,
					contactid: manifest._ren_patient_value,
					ren_healthservice: health_service.id,
					ren_primarypolicyid: manifest._ren_primarypolicy_value,
					ren_serviceid: health_service.ren_serviceid,
					ren_servicename: health_service.ren_name + ' (' + health_service.ren_servicecode + ')'
				}

				resources.push(resource);
			})
		);

		console.log('resources assigned1');
	}

	const select = (select: DateSelectArg) => {
		// Create service event
		console.log('select', select);

		const resourceProps = select.resource?.extendedProps;
		for (var d = select.start ; d < select.end ; d.setDate(d.getDate() + 1)) {
			let service_event = new OccupancyTables.Ren_serviceevent({
				ren_servicedate: d.toDateString(),
				ren_units: 1.00,
				_ren_episodeofcare_value: resourceProps!.incidentid,
				_ren_healthservice_value: resourceProps!.ren_healthservice,
			});

			api.createServiceEvent(service_event);
		}
	}

	// NOTE: We can't use TSX directly in cellContent, but this works for some reason.
	const patientInfoCell = (args: ColCellContentArg ) => {
		const { groupValue: manifestid } = args;

		const manifest = manifests.data?.find( (m) => m.incidentid === manifestid )

		return <PatientInfoCell manifest={manifest} />;
	}

	const calendarProps: CalendarOptions = {
		plugins: [ resourceTimelinePlugin, interactionPlugin ],
		initialView: "resourceTimelineMonth",
		initialDate: date.start,
		height: '100%',
		nowIndicator: true,
		resourceGroupField: 'incidentid',
		resourceGroupLabelClassNames: 'pbh-grouplabel',
		resourceAreaColumns: [
			{ field: 'incidentid', headerContent: 'Manifest', group: true, cellContent: patientInfoCell },
			{ field: 'ren_servicename', headerContent: 'Health Service' }//, cellContent: HealthServiceCell }
		],
		datesSet: (datesSet) => {
			if (datesSet.start.toUTCString() !== date.start.toUTCString()) {
				console.log('Setting dates', datesSet);
				if (selectedManifest) {
					console.log('closed manifest panel')
					selectManifest(undefined);
				}
				setDate({
					start: datesSet.start,
					end: datesSet.end
				})
			}
		},
		selectable: true,
		selectOverlap: false,
		select,
		resources,
		events
	}

	if (loading) {
		return <Shimmer />;
	}

	console.log('resources', resources);
	console.log('calendar', calendarProps);

	return <FullCalendar
		{ ...calendarProps }
		/>

	// Helpful filter
	// -url:https://browser.pipe.aria.microsoft.com/ -url:https://browser.events.data.microsoft.com/ -url:https://web.vortex.data.microsoft.com/
}

export default ManifestTable;