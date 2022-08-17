import { Callout, Persona, PersonaSize } from '@fluentui/react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import useApi, { OccupancyTables } from '../../api';
import SelectedManifestContext from '../../contexts/SelectedManifestContext';

type PatientInfoCellProps = {
	manifest?: OccupancyTables.Incident;
}

export const PatientInfoCell: React.FC<PatientInfoCellProps> = (props) => {
	const api = useApi();
	const personaId = useId();
	const { manifest } = props;
	const patientid = manifest?._ren_patient_value;
	const { selectedManifest, selectManifest } = React.useContext(SelectedManifestContext);

	const myManifestSelected = selectedManifest && ( selectedManifest?.incidentid === manifest?.incidentid );

	const [isCalloutVisible, setCalloutVisible] = useState(myManifestSelected);

	const onHoverEvent = (mouseInArea: boolean) => {
		setCalloutVisible(mouseInArea);
	}

	let classes: string[] = [];

	if (selectedManifest && manifest?.incidentid === selectedManifest?.incidentid) {
		classes.push('selected');
	}

	if (patientid) {
		const patientQ = useQuery(['patient', patientid], () => api.getPatient(patientid));

		if (patientQ.data) {
			const patient = patientQ.data;

			const PatientDetail = () => 
				<pre>
					{manifest?.title}<br />
					{patient.firstname} {patient.lastname}<br />
					Birthday: {patient.birthdate}<br />
					SSN: {patient.ren_ssn}<br />
					<br />
					Start Date: {manifest?.ren_startofcare}<br />
					Discharge Date: {manifest?.ren_endofcare}<br />
					<br />
					Insurance company details here<br />
					<br />
					Patient Address also here
				</pre>;

			return <div className={classes.join(' ')}>
				<Persona
					id={personaId}
					text={`${patient.firstname} ${patient.lastname}`}
					size={PersonaSize.size48}
					secondaryText={patient.birthdate}
					tertiaryText={patient.telephone1}
					onMouseOver={() => onHoverEvent(true) }
					onMouseLeave={ () => onHoverEvent(false) }
					onClick={ () => selectManifest(manifest) }
					/>
				{isCalloutVisible && (
					<Callout
						onDismiss={() => setCalloutVisible(false) }
						target={`#${personaId}`}
						>
							<PatientDetail />
						</Callout>
				)}
			</div>;
		}

		return <pre>Patient not found ({patientid})</pre>;
	}

	return <pre>No Patient associated with manifest</pre>
}

export default PatientInfoCell;