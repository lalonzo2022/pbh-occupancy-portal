import React from 'react'
import { render } from 'react-dom'
import DemoApp from './DemoApp'
import { App, IAppProps } from '../src/components/App';
import { ApiType } from "../src/api";



const context = React.createContext({});

let api: ApiType = ApiType.Mock;
let facilityid = "";
debugger;
if (parent.Xrm) {
    console.log("Running in Dynamics context");
    api = ApiType.Dynamics;
    facilityid = parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
} else if (window.location.pathname.indexOf("ren-occupancy") > -1) {
    console.log("Running in Portal context");
    api = ApiType.Portal;
    const input_facility = document.getElementById("facilityid") as HTMLInputElement | null;
    if (input_facility != null)  facilityid = input_facility.value;
}
else {
    api = ApiType.Mock;
    console.log("Running in Mock context");
    facilityid = "89a23872-0b14-ed11-b83d-00224823504d";
}

const props: IAppProps = {
  context,
  facilityid,
  api
};

document.addEventListener('DOMContentLoaded', function() {
  render(
    <App context={context} facilityid={facilityid} api={api}/>,
    document.getElementById("controlocupp")
  )
})
