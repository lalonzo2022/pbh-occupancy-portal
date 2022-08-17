import { DetailsList, IColumn, SelectionMode } from "@fluentui/react/lib/DetailsList";
import * as React from "react";
import { OccupancyTables } from '../../api';
import HealthService from "../../components/HealthService";
import AuthorizationPanel from '../../components/AuthorizationPanel';

type AuthPanelState = {
	open: boolean;
	auth?: OccupancyTables.Ren_authorization;
}

export const AuthorizationsTable: React.FC<{ authorizations?: OccupancyTables.Ren_authorization[] }> = (props) => {

	const [ auth_panel, setAuthPanel ] = React.useState<AuthPanelState>({ open: false });

	const columns: IColumn[] = [
		{
			key: 'ren_name',
			name: 'Authorization Name',
			fieldName: 'ren_name',
			isRowHeader: true,
			isResizable: true,
			minWidth: 100
		},
		{
			key: '_ren_service_value',
			name: 'Service',
			fieldName: '_ren_service_value',
			isResizable: true,
			minWidth: 100,
			onRender: (auth: OccupancyTables.Ren_authorization) => {
				return <HealthService id={auth._ren_service_value || ''} formatter={(hs) => hs.ren_servicecode}/>;
			}
		},
		{
			key: 'ren_startdate',
			name: 'Start Date',
			fieldName: 'ren_startdate',
			minWidth: 100
		},
		{
			key: 'ren_enddate',
			name: 'End Date',
			fieldName: 'ren_enddate',
			minWidth: 100
		},
		{
			key: 'ren_units',
			name: 'Units',
			fieldName: 'ren_units',
			minWidth: 100
		}
	];

	return <>
		<DetailsList
			columns={columns}
			items={props.authorizations || []}
			selectionMode={SelectionMode.single}
			onItemInvoked={(item) => {
				console.log(item);
			  setAuthPanel({ open: true, auth: item }) }}
		/>
		<AuthorizationPanel
		  auth={auth_panel.auth}
			isOpen={auth_panel.open}
			onDismiss={() => setAuthPanel({ open: false, auth: auth_panel.auth })}
		/>
		</>;
}

export default AuthorizationsTable;