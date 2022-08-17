import { Icon, IStackStyles, Link, Stack, StackItem, Text } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import useApi from '../../api';
import SelectedManifestContext from '../../contexts/SelectedManifestContext';
import { DateContext } from '../../contexts/DateContext';
import { AuthorizationsTable } from '../AuthorizationsTable';

export const SelectedManifestPanel: React.FC<{}> = (props) => {
	const api = useApi();
	const stackId = useId();
	const { selectedManifest: manifest, selectManifest } = React.useContext(SelectedManifestContext);
	const { date } = React.useContext(DateContext);
	const patientid = manifest?._ren_patient_value;
	const { data: patient } = useQuery(['patient', patientid], () => {
		if (patientid) {
			return api.getPatient(patientid)
		}
	});

	const primarypolicyid = manifest?._ren_primarypolicy_value;
	const { data: policy } = useQuery(['ren_insurancepolicy', primarypolicyid], () => api.getPolicy(primarypolicyid!), { enabled: !!primarypolicyid })

	const payerid = policy?._ren_payer_value;
	const { data: payer } = useQuery(['account', payerid], () => api.getAccount(payerid!), { enabled: !!payerid })

	const facilityid = manifest?._ren_facility_value;
	const { data: networkstatus } = useQuery(['networkstatus', { payer: payerid, facility: facilityid }], () => api.getNetworkStatus(facilityid!, payerid!), { enabled: !!(payerid && facilityid) });

	const { data: auths } = useQuery(['authorizations', manifest?.incidentid!, date.start, date.end], () => api.getAuthorizations(manifest?.incidentid!, date.start, date.end), { enabled: !!manifest })

	const stackStyles: IStackStyles = {
		root: [
			{
				margin: 10,
				display: (manifest) ? 'auto' : 'none'
			}
		]
	}

	if (patient) {
		
		const PatientDetail = () => 
			<pre>
				{patient.firstname} {patient.lastname}<br />
				Birthday: {patient.birthdate}<br />
				Patient Phone #: {patient.telephone1}<br />
				SSN: {patient.ren_ssn}<br />
				<br />
				Start Date: {manifest?.ren_startofcare}<br />
				Discharge Date: {manifest?.ren_endofcare}<br />
				<br />
				{ policy && (
					<>
						Insurance co: { payer?.name }<br />
						Member id: { policy.ren_name }<br />
						Group #: {policy.ren_groupnumber}<br />
						Precert Phone #: (no field for this)<br />
						<br />
					</>
				)}
				{ networkstatus && (
					<>
						IN NETWORK<br />
						<br />
					</>
				)}
				Dx Codes: (get from service events?)<br />
				<br />
				{patient.address1_line1}, {patient.address1_city} {patient.address1_stateorprovince} {patient.address1_postalcode}
			</pre>;

		return (
		<Stack
			styles={stackStyles}
			id={stackId}
			>
				<StackItem>
					<Stack horizontal horizontalAlign='space-between'>
						<Text variant='xLarge'>{manifest?.title}</Text>
						<Link onClick={ () => selectManifest(undefined) }>
							<Icon iconName='Cancel' />
						</Link>
					</Stack>
				</StackItem>
				<StackItem>
					<Stack horizontal>
						<StackItem>
							<PatientDetail />
						</StackItem>
						<StackItem grow>
							<Text variant='large'>Authorizations</Text>
							<AuthorizationsTable authorizations={auths} />
						</StackItem>
					</Stack>
				</StackItem>
		</Stack>
		);
	}

	// Render nothing if manifest not selected
	return <></>;

}

export default SelectedManifestPanel;