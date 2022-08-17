import { OccupancyTables } from '../api';
import * as React from "react";
  
type SelectManifestType = {
	selectedManifest?: OccupancyTables.Incident;
	selectManifest: (manifest?: OccupancyTables.Incident) => void
}

export const SelectedManifestContext = React.createContext<SelectManifestType>({ selectManifest: () => {} });

export default SelectedManifestContext;
