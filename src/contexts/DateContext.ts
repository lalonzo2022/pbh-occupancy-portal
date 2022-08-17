import { OccupancyTables } from '../api';
import * as React from "react";
  
export type DateType = {
		start: Date;
		end?: Date
};

type DateContextType = {
	date: DateType,
	setDate: (date: DateType) => void
}

let default_start = new Date();

default_start.setDate(1);
default_start.setHours(0, 0, 0, 0);

export const DateContext = React.createContext<DateContextType>({
	date: {
		start: default_start
	},
	setDate: (selected_date) => {},
});

export default DateContext;
