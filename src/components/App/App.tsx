import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
//import { IInputs } from "../../../OccupancyControl";
import ApiContext from '../../contexts/ApiContext';
import XrmContext from '../../contexts/XrmContext';
import FacilityContext from '../../contexts/FacilityContext';
import SelectedManifestContext from '../../contexts/SelectedManifestContext';
import SelectedManifestPanel from '../SelectedManifestPanel';
import { MessageBar, MessageBarType, Stack, StackItem } from "@fluentui/react";
import { ApiType, OccupancyTables } from "../../api";
import { useState } from "react";
import ManifestCalendar from "../ManifestCalendar";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000, // Query data is always valid for at least 5 seconds
		}
	}
});

export type IAppProps = {
	context: any,
	facilityid: string,
	api: ApiType
}

export function App(props: IAppProps) {
	const [ selectedManifest, selectManifest ] = useState<OccupancyTables.Incident | undefined>(undefined);

	return (
		<QueryClientProvider client={queryClient}>
			<XrmContext.Provider value={props.context}>
				<ApiContext.Provider value={props.api}>
					<FacilityContext.Provider value={props.facilityid}>
						<SelectedManifestContext.Provider value={{ selectedManifest, selectManifest }}>
							<Stack styles={{ root: { width: '100%', height: 'calc(100vh - 300px)' }}}>
								<MessageBar
									messageBarType={MessageBarType.blocked}
									isMultiline={false}
									>
										<b>Occupancy App Placeholder</b> - You are seeing an in-development version of the Occupancy App using the {props.api} API.
								</MessageBar>
								<StackItem grow={1}>
									<ManifestCalendar />
								</StackItem>
								<StackItem>
									<SelectedManifestPanel />
								</StackItem>
							</Stack>
						</SelectedManifestContext.Provider>
					</FacilityContext.Provider>
				</ApiContext.Provider>
			</XrmContext.Provider>
		</QueryClientProvider>
	);
}

export default App;