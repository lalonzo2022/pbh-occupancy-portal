import React from 'react'
import { render } from 'react-dom'
import DemoApp from './DemoApp'
import { App, IAppProps } from '../src/components/App';
import { ApiType } from "../src/api";


//Ver. 0.1.0.22

const context = React.createContext({});

let api: ApiType = ApiType.Portal;
let facilityid = "89a23872-0b14-ed11-b83d-00224823504d";

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
