import * as React from "react";
import { ApiType } from "../api";

export const ApiContext = React.createContext<ApiType>(ApiType.Mock);

export default ApiContext;
