// TODO: Make the export dynamic based on which environment is using the app
export enum ApiType {
	Dynamics = 'dynamics',
	Mock = 'mock',
	Portal = 'portal'
}

export * from './mock-api';
export * from './dynamics-api';

import { useContext } from 'react';
import ApiContext from '../contexts/ApiContext';
import { IOccupancyApi } from './api';
import DynamicsApi from './dynamics-api';
import MockApi from './mock-api';
import PortalApi from './portal-api';

export default function useApi(): IOccupancyApi {
	const api = useContext(ApiContext);

	switch (api) {
		case ApiType.Dynamics:
			return DynamicsApi;
	
		case ApiType.Portal:
			return PortalApi;

		default:
			return MockApi;
	}
}