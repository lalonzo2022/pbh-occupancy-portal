import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useContext } from "react";
import useApi, { OccupancyTables } from "../../api";
import FacilityContext from "../../contexts/FacilityContext";

type Props = {
	id?: string;
	formatter?: (health_service: OccupancyTables.Ren_service) => string | undefined;
}

const default_formatter = (health_service: OccupancyTables.Ren_service) => {
	return `${health_service.ren_name} (${health_service.ren_servicecode})`
}

export const HealthService: React.FC<Props> = ({ id, formatter = default_formatter }) => {
	const api = useApi();
	const facility = useContext(FacilityContext);
	const health_services = useQuery(['healthservices', { facility }], () => api.getHealthServices(facility));

	if (id && health_services.data) {
		const matching_service = health_services.data.find( (s) => s.id === id );

		if (matching_service) {
		return (
				<span>
					{ formatter(matching_service) }
				</span>
			);
		}
	}

	return (
		<span>
			<em>{id}</em>
		</span>
	);
}

export default HealthService;