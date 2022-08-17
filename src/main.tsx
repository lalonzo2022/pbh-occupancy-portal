import React from 'react'
import { render } from 'react-dom'
import DemoApp from './DemoApp'
import { App, IAppProps } from '../src/components/App';
import { ApiType } from "../src/api";



const context = React.createContext({});

let api: ApiType = ApiType.Mock;
let facilityid = "";

if (parent.Xrm) {
    console.log("Running in Dynamics context");
    api = ApiType.Dynamics;
    facilityid = parent.Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
} else {
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
