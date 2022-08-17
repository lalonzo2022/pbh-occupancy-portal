import { Panel, Text } from "@fluentui/react"
import * as React from "react";
import { OccupancyTables } from "../../api"
import HealthService from "../HealthService/HealthService";

type Props = {
	auth?: OccupancyTables.Ren_authorization;
	isOpen: boolean;
	onDismiss: () => void;
}

export const AuthorizationPanel: React.FC<Props> = ({ auth, isOpen, onDismiss }) => {

	if (!auth) {
		return <></>;
	}

	return <Panel
		isLightDismiss
		isOpen={isOpen}
		onDismiss={onDismiss}
		closeButtonAriaLabel='Close'
		headerText={`Authorization: ${auth.ren_name}`}>
			<Text variant='large'>Service: <HealthService id={auth._ren_service_value} /></Text>
			<Text variant='large'>Start Date: {auth.ren_startdate}</Text>
			<Text variant='large'>End Date: {auth.ren_enddate}</Text>
			<Text variant='large'>Units: {auth.ren_units}</Text>
	</Panel>;
}

export default AuthorizationPanel;