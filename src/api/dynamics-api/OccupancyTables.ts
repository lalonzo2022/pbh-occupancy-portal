// This file was automatically generated from the XrmToolbox utility "Typescript Helper Class Utility"
// Please use this to regenerate as needed. DO NOT MODIFY THIS FILE!

/** Checked Entities:
 * - ren_authorization
 * - contact
 * - account
 * - ren_facility
 * - ren_service
 * - ren_insurancepolicy
 * - incident
 * - ren_serviceevent
 * - ren_networkstatus
 * - ren_diagnosis
 * - ren_physician
 */


/** @description Occupancy API 
*/
declare global {
	interface Window {
	  Xrm: any;
	}
  }

export module OccupancyTables {
	/** @description Specifies that Entities always have a url route and optionally have an id
	 */  
	
	
	export abstract class Entity {
		constructor(public route?: string, public id?: string) { }
	}

	/** @description Interface for retrieve multiple datasets in CRM
	 *  @type generic type that corresponds with the entity being returned
	 */ 
	export interface IRetrieveMultipleData<T> {
		'@odata.context': string,
		value: T[]
	}

	export interface IAttribName {
		name: string,
		api_name:string
	}

	/** @description Helper for utilizing parameters in the WebAPI service
	 */  
	export interface IParams {
		$select?: string;
		$filter?: string;
		$orderby?: string;
		$top?: string;
		$expand?: string;
		[key: string]: string | undefined;
	}
	export interface IWebApi {
		retrieve<T>(e: Entity, params?: IParams, formattedValues?: boolean): Promise<T>;
		retrieveNext<T>(e: Entity, nextLinkUrl: string, formattedValues?: boolean): Promise<T>;
		create<T>(e: Entity, formattedValues?: boolean, returnRecord?: boolean): Promise<T>;
		retrieveMultiple<T>(e: Entity, params?: IParams, formattedValues?: boolean, returnRecord?: boolean): Promise<T>;
		invokeAction<T>(name:string, params?: IParams, formattedValues?: boolean, returnRecord?: boolean): Promise<T>;
		update<T>(e: Entity, route: string, id: string, formattedValues?: boolean, returnRecord?: boolean): Promise<T>;
		remove<T>(e: Entity): Promise<T>;
		fetchXml<T>(e: Entity, fetchXml: string, formattedValues?: boolean): Promise<T>;
		setUrl(crmurl: string): void;
	}
	
	export interface IUtils {
		formatDate(dateVal: string): string;
		getFormattedValue(entity:any, attribute:string): string | undefined;
		isNullUndefinedEmpty(value: any): boolean;
		padLeadingZeros(num: number, precision: number): string;
		cleanGuid(guid: string, removeDashes?: boolean): string;
		reopenForm(entityName: string, entityId: string): void;
	}

	export class Utils implements IUtils {

		/** Helper method for formatting js date
			@param {string} dateVal date to be formatted, in ISO date format
		**/
		formatDate(dateVal: string):string {

			if (this.isNullUndefinedEmpty(dateVal)) {
				return "null";
			}

			var d = new Date(dateVal);
			var pad = this.padLeadingZeros;
			return (pad(d.getMonth() + 1, 2) + "/" +
				pad(d.getDate(), 2) + "/" +
				d.getFullYear() + " " +
				pad(d.getHours(), 2) + ":" +
				pad(d.getMinutes(), 2));
		}

		/**
		 * @description Retrieves the formatted value for an attribute
		 * @param {Entity} entity the entity containing the attribute
		 * @param {string} attribute name of the attribute being retrieved
		 */
		getFormattedValue(entity:any, attribute:string): string | undefined {
			var displayVal: string | undefined = undefined;

			if (entity[attribute] !== null) {
				displayVal = entity[attribute];

				var extendedField = attribute + "@OData.Community.Display.V1.FormattedValue";
				if (entity[extendedField] !== null) {
					displayVal = entity[extendedField];
				}
			}
			return displayVal;
		}

		/**
		 * Format a number string with leading zeroz
		 * @param num
		 * @param precision
		 */
		padLeadingZeros (num:number, precision:number):string {
			var s = "000000000" + num;
			return s.substr(s.length - precision);
		}

		/**
		 * check to see if a value is null or empty
		 */
		isNullUndefinedEmpty(value: any): boolean {
			if (value === undefined) {
				return true;
			}
			if (value === null) {
				return true;
			}
			if (typeof (value) == 'string') {
				if (value.length == 0) {
					return true;
				}
			}
			return false;
		}
		/**
		 * Clean brackets and dashes from a guid
		 */
		cleanGuid(guid: string, removeDashes?: boolean): string {
			guid = guid.replace("{", "").replace("}", "");

			if (removeDashes === true) {
				guid = guid.replace(/-/g, "");
			}
			return guid;
		}
		/**
		 * Re-opens the form causing a true refresh
		 */
		reopenForm(entityName: string, entityId: string): void {
			parent.Xrm.Utility.openEntityForm(entityName, entityId);
		}
	}

	/** @description A WebAPI Service for Dynamics CRM  
	 * @property {string} BaseUrl The CRM org url + WebAPI endpoint 
	 * @return {object} WebAPI Service
	 */  
	export class WebApi implements IWebApi {
		private BaseUrl!: string; 

		constructor() { }

		/** @description Required method that constructs the BaseUrl for the Service 
		 * @param {string} crmurl The crm org url 
		 **/  
		setUrl(crmurl: string) {
			this.BaseUrl = crmurl + "/api/data/v9.0/";
		}

		/** @description Performs a CRM WebAPI Retrieve
		 * @param {object} e The entity being retrieved 
		 * @param {object} params The optional parameters for the retrieve
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @return {object} Http GET Promise
		 */  
		retrieve<T>(e: Entity, params?: IParams, formattedValues?: boolean): Promise<T> {
			// lets url be a concatenation of base url, entity route, and the entity id wrapped in CRM's flavor of WebAPI
			let url = this.BaseUrl + e.route + "(" + e.id + ")";
			// handles params if there are any
			if (params != undefined) url = this.addParams(url, params);
			if (formattedValues === true) {
				return fetch(url, this.fetchHeaders(formattedValues)).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
			else {
				return fetch(url).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
		    }
		}

		/** @description Performs a CRM WebAPI Retrieve for a nextLink URL on expanded attributes or collections
		 * @param {object} e The entity being retrieved 
		 * @param {string} nextLinkUrl the URL for the next retrieve 
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @return {object} Http GET Promise
		 */
		retrieveNext<T>(e: Entity, nextLinkUrl: string, formattedValues?: boolean) {
			// handles params if there are any
			if (formattedValues === true) {
				return fetch(nextLinkUrl, this.fetchHeaders(formattedValues)).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
			else {
				return fetch(nextLinkUrl).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
		}

		/** @description Performs a CRM WebAPI Create
		 * @param {object} e The entity being created 
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @param {boolean} returnRecord optional flag indicating whether to return an the updated record
		 * @return {object} Http POST Promise
		 */  
		create<T>(e: Entity, formattedValues?: boolean, returnRecord?: boolean) {
			// lets url be a concatenation of base url and route
			let url = this.BaseUrl + e.route;
			delete e.route;

			return fetch(url, { ...this.fetchHeaders(formattedValues, returnRecord), method: 'POST', body: JSON.stringify(e) }).
				then(response => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json() as Promise<T>;
				});
		}

		/**
		* Call a custom action from WebAPI and retrieve the output values
		* @param actionName schema name of the action
		* @param params optional Input params as an object, if defined.
		* @param formattedValues optional flag indicating whether to return formatted attibutes values
		* @param returnRecord optional flag indicating whether to return the Outparam values
		*/
		invokeAction<T>(actionName: string, params?: IParams, formattedValues?: boolean, returnRecord?: boolean): Promise<T> {
				// lets url be a concatenation of base url and route
				let url = this.BaseUrl + actionName;

				return fetch(url, { ...this.fetchHeaders(formattedValues, returnRecord), method: 'POST', body: JSON.stringify(params) }).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
		}
    
		/** @description Performs a CRM WebAPI RetrieveMultiple
		 * @param {object} e The entity being retrieved 
		 * @param {object} params The optional parameters for the retrieve
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @return {object} Http GET Promise
		 **/ 
		retrieveMultiple<T>(e: Entity, params?: IParams, formattedValues?: boolean) {
			let url = this.BaseUrl + e.route;
			if (params != undefined) url = this.addParams(url, params);
			if (formattedValues === true) {
				return fetch(url, this.fetchHeaders(formattedValues)).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
			else {
			    return fetch(url).
						then(response => {
							if (!response.ok) {
								throw new Error(response.statusText);
							}
							return response.json() as Promise<T>;
						});
		    }
		}

		/** @description Performs a CRM WebAPI Update
		* @param {object} e The entity being updated
		* @param {string} route the base route for the enity webapi query string
		* @param {string} id the ID of the entity being updated
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @param {boolean} returnRecord optional flag indicating whether to return an the updated record
		* @return {object} Http PATCH Promise
		 */  
		update<T>(e: Entity, route: string, id: string, formattedValues?: boolean, returnRecord?: boolean ) {
			// ensure that no curly braces included
			id = new Utils().cleanGuid(id);
			delete e.route;
			let url = this.BaseUrl + route + "(" + id + ")";

			return fetch(url, { method: 'PATCH', body: JSON.stringify(e), ...this.fetchHeaders(formattedValues, returnRecord) }).
				then(response => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json() as Promise<T>;
				});
		}

		/** @description Performs a CRM WebAPI call using FetchXml as a query 
		 * @param {object} e The entity being updated
		 * @param {string} fetchXML fetch query being passed
		 * @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		 * @return {object} Http PATCH Promise
		 */
		fetchXml<T>(e: Entity, fetchXml: string, formattedValues?: boolean) {
			// encode the fetch XML string so we can pass via a URL
			var fetchXmlEncoded = encodeURIComponent(fetchXml);
			
			let url = this.BaseUrl + e.route + "?fetchXml=" + fetchXmlEncoded;

			if (formattedValues === true) {
				return fetch(url, this.fetchHeaders(formattedValues)).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
			else {
				return fetch(url).
					then(response => {
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						return response.json() as Promise<T>;
					});
			}
		}

		/** @description Performs a CRM WebAPI Delete
		 * @param {object} e The entity being deleted 
		 * @return {object} Http DELETE Promise
		 */  
		remove<T>(e: Entity) {
			let url = this.BaseUrl + e.route;
			return fetch(url, { method: 'DELETE' }).
				then(response => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json() as Promise<T>;
				});
		}

		/** @description Adds together parameters in an oData string
		 * @param {string} url The url string without params
		 * @param {object} params The parameters to be added to the url string
		 * @return {string} The url string with parameters
		 */  
		addParams(url: string, params: IParams): string {
			const paramKeys = Object.keys(params);

			url += "?";

			paramKeys.forEach((v, k) => {
				if (k == 0 || k == paramKeys.length)
					url += v + '=' + params[v];
				else
					url += '&' + v + '=' + params[v];
			});

			return url;
		}

		/** @description build the additional headers configuration element that will be passed on the HTTP call
		* @param {boolean} formattedValues optional flag indicating whether to return formatted attibutes values
		* @param {boolean} returnRecord optional flag indicating whether to return an the updated record
		**/
		fetchHeaders(formattedValues?:boolean, returnRecord?:boolean): RequestInit {
			var config: { headers: { [key: string]: string } } = {
				headers: {
					'OData-MaxVersion': '4.0',
					'OData-Version': '4.0',
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8',
				}
			};

			// check for the optional arguments 
			var prefer = [];
			if (formattedValues === true) {
				prefer.push('odata.include-annotations="*"');
			}

			if (returnRecord === true) {
				prefer.push('return=representation');
			}

			if (prefer.length > 0) {
				config.headers['Prefer'] = prefer.join(",");
			}
			return config;
		} 
	}


	//** @description AUTO GENERATED CLASSES FOR Account
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Account */
	export interface IAccounts extends IRetrieveMultipleData<IAccount> {}

	//** @description WebAPI interface for Account */
	export interface IAccount {
		[key: string]: string | number | undefined;
		
		address2_postalcode?: string
		address1_longitude?: number
		aging90?: number
		address2_county?: string
		defaultpricelevelidname?: string
		slainvokedidname?: string
		masteraccountidname?: string
		_modifiedby_value?: string
		creditlimit_base?: number
		marketingonly?: string
		ownershipcode?: string
		entityimageid?: string
		statuscode?: string
		address2_longitude?: number
		address2_line3?: string
		aging60_base?: number
		industrycode?: string
		address1_telephone2?: string
		transactioncurrencyidname?: string
		address1_upszone?: string
		processid?: string
		marketcap?: number
		openrevenue_date?: string
		openrevenue?: number
		address2_city?: string
		emailaddress2?: string
		emailaddress1?: string
		customersizecode?: string
		adx_createdbyipaddress?: string
		address1_country?: string
		statecode?: number
		accountratingcode?: string
		modifiedbyname?: string
		revenue?: number
		address1_shippingmethodcode?: string
		exchangerate?: number
		aging30_base?: number
		_defaultpricelevelid_value?: string
		businesstypecode?: string
		address1_line2?: string
		_preferredserviceid_value?: string
		address1_postofficebox?: string
		_msa_managingpartnerid_value?: string
		_ownerid_value?: string
		openrevenue_state?: number
		numberofemployees?: number
		shippingmethodcode?: string
		address1_utcoffset?: number
		address2_stateorprovince?: string
		territoryidname?: string
		telephone1?: string
		preferredappointmenttimecode?: string
		donotpostalmail?: string
		address1_stateorprovince?: string
		address2_shippingmethodcode?: string
		modifiedon?: string
		territorycode?: string
		marketcap_base?: number
		_modifiedbyexternalparty_value?: string
		accountclassificationcode?: string
		createdon?: string
		preferredcontactmethodcode?: string
		accountid?: string
		revenue_base?: number
		address2_utcoffset?: number
		aging60?: number
		originatingleadidname?: string
		preferredappointmentdaycode?: string
		paymenttermscode?: string
		preferredserviceidname?: string
		address1_county?: string
		_primarycontactid_value?: string
		stageid?: string
		address1_telephone3?: string
		msa_managingpartneridname?: string
		_preferredequipmentid_value?: string
		entityimage_url?: string
		primarytwitterid?: string
		address2_line2?: string
		address1_addresstypecode?: string
		adx_modifiedbyipaddress?: string
		_owninguser_value?: string
		_transactioncurrencyid_value?: string
		_slaid_value?: string
		opendeals_state?: number
		address1_city?: string
		owningbusinessunitname?: string
		_slainvokedid_value?: string
		fax?: string
		_createdbyexternalparty_value?: string
		donotbulkpostalmail?: string
		address2_composite?: string
		ren_expectedprefix?: string
		owneridtype?: string
		address1_name?: string
		address2_upszone?: string
		parentaccountidname?: string
		telephone3?: string
		aging90_base?: number
		aging30?: number
		entityimage_timestamp?: number
		donotbulkemail?: string
		modifiedbyexternalpartyname?: string
		openrevenue_base?: number
		emailaddress3?: string
		address1_latitude?: number
		creditlimit?: number
		teamsfollowed?: number
		primarysatoriid?: string
		address2_country?: string
		telephone2?: string
		createdbyexternalpartyname?: string
		lastusedincampaign?: string
		accountnumber?: string
		address1_line3?: string
		adx_createdbyusername?: string
		primarycontactidname?: string
		timespentbymeonemailandmeetings?: string
		address1_primarycontactname?: string
		donotphone?: string
		msdyn_gdproptout?: string
		address2_freighttermscode?: string
		address2_postofficebox?: string
		ren_accounttype?: string
		donotsendmm?: string
		_msdyn_segmentid_value?: string
		preferredequipmentidname?: string
		_parentaccountid_value?: string
		opendeals?: number
		msdyn_salesaccelerationinsightidname?: string
		_territoryid_value?: string
		slaname?: string
		address1_composite?: string
		ftpsiteurl?: string
		isprivate?: string
		sic?: string
		_masterid_value?: string
		address2_line1?: string
		_owningbusinessunit_value?: string
		lastonholdtime?: string
		address1_telephone1?: string
		address2_fax?: string
		description?: string
		address2_addresstypecode?: string
		websiteurl?: string
		stockexchange?: string
		_originatingleadid_value?: string
		address1_addressid?: string
		_owningteam_value?: string
		preferredsystemuseridname?: string
		address1_freighttermscode?: string
		address2_latitude?: number
		merged?: string
		traversedpath?: string
		address2_addressid?: string
		onholdtime?: number
		address1_line1?: string
		donotfax?: string
		owneridname?: string
		address2_telephone1?: string
		address2_telephone2?: string
		address2_telephone3?: string
		_preferredsystemuserid_value?: string
		address2_name?: string
		msdyn_segmentidname?: string
		customertypecode?: string
		donotemail?: string
		_createdby_value?: string
		createdbyname?: string
		accountcategorycode?: string
		tickersymbol?: string
		address2_primarycontactname?: string
		creditonhold?: string
		opendeals_date?: string
		address1_fax?: string
		followemail?: string
		name?: string
		_msdyn_salesaccelerationinsightid_value?: string
		participatesinworkflow?: string
		adx_modifiedbyusername?: string
		sharesoutstanding?: number
		address1_postalcode?: string

  }
  
  //** Collection of Attribute structures for Account */
  export class AccountAttributes {
		public static LogicalName:string = "account"
		
		address2_postalcode: IAttribName = { name:"address2_postalcode", api_name:"address2_postalcode" } 
		address1_longitude: IAttribName = { name:"address1_longitude", api_name:"address1_longitude" } 
		aging90: IAttribName = { name:"aging90", api_name:"aging90" } 
		address2_county: IAttribName = { name:"address2_county", api_name:"address2_county" } 
		defaultpricelevelidname: IAttribName = { name:"defaultpricelevelidname", api_name:"defaultpricelevelidname" } 
		slainvokedidname: IAttribName = { name:"slainvokedidname", api_name:"slainvokedidname" } 
		masteraccountidname: IAttribName = { name:"masteraccountidname", api_name:"masteraccountidname" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		creditlimit_base: IAttribName = { name:"creditlimit_base", api_name:"creditlimit_base" } 
		marketingonly: IAttribName = { name:"marketingonly", api_name:"marketingonly" } 
		ownershipcode: IAttribName = { name:"ownershipcode", api_name:"ownershipcode" } 
		entityimageid: IAttribName = { name:"entityimageid", api_name:"entityimageid" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		address2_longitude: IAttribName = { name:"address2_longitude", api_name:"address2_longitude" } 
		address2_line3: IAttribName = { name:"address2_line3", api_name:"address2_line3" } 
		aging60_base: IAttribName = { name:"aging60_base", api_name:"aging60_base" } 
		industrycode: IAttribName = { name:"industrycode", api_name:"industrycode" } 
		address1_telephone2: IAttribName = { name:"address1_telephone2", api_name:"address1_telephone2" } 
		transactioncurrencyidname: IAttribName = { name:"transactioncurrencyidname", api_name:"transactioncurrencyidname" } 
		address1_upszone: IAttribName = { name:"address1_upszone", api_name:"address1_upszone" } 
		processid: IAttribName = { name:"processid", api_name:"processid" } 
		marketcap: IAttribName = { name:"marketcap", api_name:"marketcap" } 
		openrevenue_date: IAttribName = { name:"openrevenue_date", api_name:"openrevenue_date" } 
		openrevenue: IAttribName = { name:"openrevenue", api_name:"openrevenue" } 
		address2_city: IAttribName = { name:"address2_city", api_name:"address2_city" } 
		emailaddress2: IAttribName = { name:"emailaddress2", api_name:"emailaddress2" } 
		emailaddress1: IAttribName = { name:"emailaddress1", api_name:"emailaddress1" } 
		customersizecode: IAttribName = { name:"customersizecode", api_name:"customersizecode" } 
		adx_createdbyipaddress: IAttribName = { name:"adx_createdbyipaddress", api_name:"adx_createdbyipaddress" } 
		address1_country: IAttribName = { name:"address1_country", api_name:"address1_country" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		accountratingcode: IAttribName = { name:"accountratingcode", api_name:"accountratingcode" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		revenue: IAttribName = { name:"revenue", api_name:"revenue" } 
		address1_shippingmethodcode: IAttribName = { name:"address1_shippingmethodcode", api_name:"address1_shippingmethodcode" } 
		exchangerate: IAttribName = { name:"exchangerate", api_name:"exchangerate" } 
		aging30_base: IAttribName = { name:"aging30_base", api_name:"aging30_base" } 
		defaultpricelevelid: IAttribName = { name:"defaultpricelevelid", api_name:"_defaultpricelevelid_value" } 
		businesstypecode: IAttribName = { name:"businesstypecode", api_name:"businesstypecode" } 
		address1_line2: IAttribName = { name:"address1_line2", api_name:"address1_line2" } 
		preferredserviceid: IAttribName = { name:"preferredserviceid", api_name:"_preferredserviceid_value" } 
		address1_postofficebox: IAttribName = { name:"address1_postofficebox", api_name:"address1_postofficebox" } 
		msa_managingpartnerid: IAttribName = { name:"msa_managingpartnerid", api_name:"_msa_managingpartnerid_value" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		openrevenue_state: IAttribName = { name:"openrevenue_state", api_name:"openrevenue_state" } 
		numberofemployees: IAttribName = { name:"numberofemployees", api_name:"numberofemployees" } 
		shippingmethodcode: IAttribName = { name:"shippingmethodcode", api_name:"shippingmethodcode" } 
		address1_utcoffset: IAttribName = { name:"address1_utcoffset", api_name:"address1_utcoffset" } 
		address2_stateorprovince: IAttribName = { name:"address2_stateorprovince", api_name:"address2_stateorprovince" } 
		territoryidname: IAttribName = { name:"territoryidname", api_name:"territoryidname" } 
		telephone1: IAttribName = { name:"telephone1", api_name:"telephone1" } 
		preferredappointmenttimecode: IAttribName = { name:"preferredappointmenttimecode", api_name:"preferredappointmenttimecode" } 
		donotpostalmail: IAttribName = { name:"donotpostalmail", api_name:"donotpostalmail" } 
		address1_stateorprovince: IAttribName = { name:"address1_stateorprovince", api_name:"address1_stateorprovince" } 
		address2_shippingmethodcode: IAttribName = { name:"address2_shippingmethodcode", api_name:"address2_shippingmethodcode" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		territorycode: IAttribName = { name:"territorycode", api_name:"territorycode" } 
		marketcap_base: IAttribName = { name:"marketcap_base", api_name:"marketcap_base" } 
		modifiedbyexternalparty: IAttribName = { name:"modifiedbyexternalparty", api_name:"_modifiedbyexternalparty_value" } 
		accountclassificationcode: IAttribName = { name:"accountclassificationcode", api_name:"accountclassificationcode" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		preferredcontactmethodcode: IAttribName = { name:"preferredcontactmethodcode", api_name:"preferredcontactmethodcode" } 
		accountid: IAttribName = { name:"accountid", api_name:"accountid" } 
		revenue_base: IAttribName = { name:"revenue_base", api_name:"revenue_base" } 
		address2_utcoffset: IAttribName = { name:"address2_utcoffset", api_name:"address2_utcoffset" } 
		aging60: IAttribName = { name:"aging60", api_name:"aging60" } 
		originatingleadidname: IAttribName = { name:"originatingleadidname", api_name:"originatingleadidname" } 
		preferredappointmentdaycode: IAttribName = { name:"preferredappointmentdaycode", api_name:"preferredappointmentdaycode" } 
		paymenttermscode: IAttribName = { name:"paymenttermscode", api_name:"paymenttermscode" } 
		preferredserviceidname: IAttribName = { name:"preferredserviceidname", api_name:"preferredserviceidname" } 
		address1_county: IAttribName = { name:"address1_county", api_name:"address1_county" } 
		primarycontactid: IAttribName = { name:"primarycontactid", api_name:"_primarycontactid_value" } 
		stageid: IAttribName = { name:"stageid", api_name:"stageid" } 
		address1_telephone3: IAttribName = { name:"address1_telephone3", api_name:"address1_telephone3" } 
		msa_managingpartneridname: IAttribName = { name:"msa_managingpartneridname", api_name:"msa_managingpartneridname" } 
		preferredequipmentid: IAttribName = { name:"preferredequipmentid", api_name:"_preferredequipmentid_value" } 
		entityimage_url: IAttribName = { name:"entityimage_url", api_name:"entityimage_url" } 
		primarytwitterid: IAttribName = { name:"primarytwitterid", api_name:"primarytwitterid" } 
		address2_line2: IAttribName = { name:"address2_line2", api_name:"address2_line2" } 
		address1_addresstypecode: IAttribName = { name:"address1_addresstypecode", api_name:"address1_addresstypecode" } 
		adx_modifiedbyipaddress: IAttribName = { name:"adx_modifiedbyipaddress", api_name:"adx_modifiedbyipaddress" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		transactioncurrencyid: IAttribName = { name:"transactioncurrencyid", api_name:"_transactioncurrencyid_value" } 
		slaid: IAttribName = { name:"slaid", api_name:"_slaid_value" } 
		opendeals_state: IAttribName = { name:"opendeals_state", api_name:"opendeals_state" } 
		address1_city: IAttribName = { name:"address1_city", api_name:"address1_city" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		slainvokedid: IAttribName = { name:"slainvokedid", api_name:"_slainvokedid_value" } 
		fax: IAttribName = { name:"fax", api_name:"fax" } 
		createdbyexternalparty: IAttribName = { name:"createdbyexternalparty", api_name:"_createdbyexternalparty_value" } 
		donotbulkpostalmail: IAttribName = { name:"donotbulkpostalmail", api_name:"donotbulkpostalmail" } 
		address2_composite: IAttribName = { name:"address2_composite", api_name:"address2_composite" } 
		ren_expectedprefix: IAttribName = { name:"ren_expectedprefix", api_name:"ren_expectedprefix" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		address1_name: IAttribName = { name:"address1_name", api_name:"address1_name" } 
		address2_upszone: IAttribName = { name:"address2_upszone", api_name:"address2_upszone" } 
		parentaccountidname: IAttribName = { name:"parentaccountidname", api_name:"parentaccountidname" } 
		telephone3: IAttribName = { name:"telephone3", api_name:"telephone3" } 
		aging90_base: IAttribName = { name:"aging90_base", api_name:"aging90_base" } 
		aging30: IAttribName = { name:"aging30", api_name:"aging30" } 
		entityimage_timestamp: IAttribName = { name:"entityimage_timestamp", api_name:"entityimage_timestamp" } 
		donotbulkemail: IAttribName = { name:"donotbulkemail", api_name:"donotbulkemail" } 
		modifiedbyexternalpartyname: IAttribName = { name:"modifiedbyexternalpartyname", api_name:"modifiedbyexternalpartyname" } 
		openrevenue_base: IAttribName = { name:"openrevenue_base", api_name:"openrevenue_base" } 
		emailaddress3: IAttribName = { name:"emailaddress3", api_name:"emailaddress3" } 
		address1_latitude: IAttribName = { name:"address1_latitude", api_name:"address1_latitude" } 
		creditlimit: IAttribName = { name:"creditlimit", api_name:"creditlimit" } 
		teamsfollowed: IAttribName = { name:"teamsfollowed", api_name:"teamsfollowed" } 
		primarysatoriid: IAttribName = { name:"primarysatoriid", api_name:"primarysatoriid" } 
		address2_country: IAttribName = { name:"address2_country", api_name:"address2_country" } 
		telephone2: IAttribName = { name:"telephone2", api_name:"telephone2" } 
		createdbyexternalpartyname: IAttribName = { name:"createdbyexternalpartyname", api_name:"createdbyexternalpartyname" } 
		lastusedincampaign: IAttribName = { name:"lastusedincampaign", api_name:"lastusedincampaign" } 
		accountnumber: IAttribName = { name:"accountnumber", api_name:"accountnumber" } 
		address1_line3: IAttribName = { name:"address1_line3", api_name:"address1_line3" } 
		adx_createdbyusername: IAttribName = { name:"adx_createdbyusername", api_name:"adx_createdbyusername" } 
		primarycontactidname: IAttribName = { name:"primarycontactidname", api_name:"primarycontactidname" } 
		timespentbymeonemailandmeetings: IAttribName = { name:"timespentbymeonemailandmeetings", api_name:"timespentbymeonemailandmeetings" } 
		address1_primarycontactname: IAttribName = { name:"address1_primarycontactname", api_name:"address1_primarycontactname" } 
		donotphone: IAttribName = { name:"donotphone", api_name:"donotphone" } 
		msdyn_gdproptout: IAttribName = { name:"msdyn_gdproptout", api_name:"msdyn_gdproptout" } 
		address2_freighttermscode: IAttribName = { name:"address2_freighttermscode", api_name:"address2_freighttermscode" } 
		address2_postofficebox: IAttribName = { name:"address2_postofficebox", api_name:"address2_postofficebox" } 
		ren_accounttype: IAttribName = { name:"ren_accounttype", api_name:"ren_accounttype" } 
		donotsendmm: IAttribName = { name:"donotsendmm", api_name:"donotsendmm" } 
		msdyn_segmentid: IAttribName = { name:"msdyn_segmentid", api_name:"_msdyn_segmentid_value" } 
		preferredequipmentidname: IAttribName = { name:"preferredequipmentidname", api_name:"preferredequipmentidname" } 
		parentaccountid: IAttribName = { name:"parentaccountid", api_name:"_parentaccountid_value" } 
		opendeals: IAttribName = { name:"opendeals", api_name:"opendeals" } 
		msdyn_salesaccelerationinsightidname: IAttribName = { name:"msdyn_salesaccelerationinsightidname", api_name:"msdyn_salesaccelerationinsightidname" } 
		territoryid: IAttribName = { name:"territoryid", api_name:"_territoryid_value" } 
		slaname: IAttribName = { name:"slaname", api_name:"slaname" } 
		address1_composite: IAttribName = { name:"address1_composite", api_name:"address1_composite" } 
		ftpsiteurl: IAttribName = { name:"ftpsiteurl", api_name:"ftpsiteurl" } 
		isprivate: IAttribName = { name:"isprivate", api_name:"isprivate" } 
		sic: IAttribName = { name:"sic", api_name:"sic" } 
		masterid: IAttribName = { name:"masterid", api_name:"_masterid_value" } 
		address2_line1: IAttribName = { name:"address2_line1", api_name:"address2_line1" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		lastonholdtime: IAttribName = { name:"lastonholdtime", api_name:"lastonholdtime" } 
		address1_telephone1: IAttribName = { name:"address1_telephone1", api_name:"address1_telephone1" } 
		address2_fax: IAttribName = { name:"address2_fax", api_name:"address2_fax" } 
		description: IAttribName = { name:"description", api_name:"description" } 
		address2_addresstypecode: IAttribName = { name:"address2_addresstypecode", api_name:"address2_addresstypecode" } 
		websiteurl: IAttribName = { name:"websiteurl", api_name:"websiteurl" } 
		stockexchange: IAttribName = { name:"stockexchange", api_name:"stockexchange" } 
		originatingleadid: IAttribName = { name:"originatingleadid", api_name:"_originatingleadid_value" } 
		address1_addressid: IAttribName = { name:"address1_addressid", api_name:"address1_addressid" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		preferredsystemuseridname: IAttribName = { name:"preferredsystemuseridname", api_name:"preferredsystemuseridname" } 
		address1_freighttermscode: IAttribName = { name:"address1_freighttermscode", api_name:"address1_freighttermscode" } 
		address2_latitude: IAttribName = { name:"address2_latitude", api_name:"address2_latitude" } 
		merged: IAttribName = { name:"merged", api_name:"merged" } 
		traversedpath: IAttribName = { name:"traversedpath", api_name:"traversedpath" } 
		address2_addressid: IAttribName = { name:"address2_addressid", api_name:"address2_addressid" } 
		onholdtime: IAttribName = { name:"onholdtime", api_name:"onholdtime" } 
		address1_line1: IAttribName = { name:"address1_line1", api_name:"address1_line1" } 
		donotfax: IAttribName = { name:"donotfax", api_name:"donotfax" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		address2_telephone1: IAttribName = { name:"address2_telephone1", api_name:"address2_telephone1" } 
		address2_telephone2: IAttribName = { name:"address2_telephone2", api_name:"address2_telephone2" } 
		address2_telephone3: IAttribName = { name:"address2_telephone3", api_name:"address2_telephone3" } 
		preferredsystemuserid: IAttribName = { name:"preferredsystemuserid", api_name:"_preferredsystemuserid_value" } 
		address2_name: IAttribName = { name:"address2_name", api_name:"address2_name" } 
		msdyn_segmentidname: IAttribName = { name:"msdyn_segmentidname", api_name:"msdyn_segmentidname" } 
		customertypecode: IAttribName = { name:"customertypecode", api_name:"customertypecode" } 
		donotemail: IAttribName = { name:"donotemail", api_name:"donotemail" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		accountcategorycode: IAttribName = { name:"accountcategorycode", api_name:"accountcategorycode" } 
		tickersymbol: IAttribName = { name:"tickersymbol", api_name:"tickersymbol" } 
		address2_primarycontactname: IAttribName = { name:"address2_primarycontactname", api_name:"address2_primarycontactname" } 
		creditonhold: IAttribName = { name:"creditonhold", api_name:"creditonhold" } 
		opendeals_date: IAttribName = { name:"opendeals_date", api_name:"opendeals_date" } 
		address1_fax: IAttribName = { name:"address1_fax", api_name:"address1_fax" } 
		followemail: IAttribName = { name:"followemail", api_name:"followemail" } 
		name: IAttribName = { name:"name", api_name:"name" } 
		msdyn_salesaccelerationinsightid: IAttribName = { name:"msdyn_salesaccelerationinsightid", api_name:"_msdyn_salesaccelerationinsightid_value" } 
		participatesinworkflow: IAttribName = { name:"participatesinworkflow", api_name:"participatesinworkflow" } 
		adx_modifiedbyusername: IAttribName = { name:"adx_modifiedbyusername", api_name:"adx_modifiedbyusername" } 
		sharesoutstanding: IAttribName = { name:"sharesoutstanding", api_name:"sharesoutstanding" } 
		address1_postalcode: IAttribName = { name:"address1_postalcode", api_name:"address1_postalcode" } 

	}

  /** @description Instantiates a Account Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Account extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "accounts";
		
			public address2_postalcode?: string;
			public address1_longitude?: number;
			public aging90?: number;
			public address2_county?: string;
			public defaultpricelevelidname?: string;
			public slainvokedidname?: string;
			public masteraccountidname?: string;
			public _modifiedby_value?: string;
			public creditlimit_base?: number;
			public marketingonly?: string;
			public ownershipcode?: string;
			public entityimageid?: string;
			public statuscode?: string;
			public address2_longitude?: number;
			public address2_line3?: string;
			public aging60_base?: number;
			public industrycode?: string;
			public address1_telephone2?: string;
			public transactioncurrencyidname?: string;
			public address1_upszone?: string;
			public processid?: string;
			public marketcap?: number;
			public openrevenue_date?: string;
			public openrevenue?: number;
			public address2_city?: string;
			public emailaddress2?: string;
			public emailaddress1?: string;
			public customersizecode?: string;
			public adx_createdbyipaddress?: string;
			public address1_country?: string;
			public statecode?: number;
			public accountratingcode?: string;
			public modifiedbyname?: string;
			public revenue?: number;
			public address1_shippingmethodcode?: string;
			public exchangerate?: number;
			public aging30_base?: number;
			public _defaultpricelevelid_value?: string;
			public businesstypecode?: string;
			public address1_line2?: string;
			public _preferredserviceid_value?: string;
			public address1_postofficebox?: string;
			public _msa_managingpartnerid_value?: string;
			public _ownerid_value?: string;
			public openrevenue_state?: number;
			public numberofemployees?: number;
			public shippingmethodcode?: string;
			public address1_utcoffset?: number;
			public address2_stateorprovince?: string;
			public territoryidname?: string;
			public telephone1?: string;
			public preferredappointmenttimecode?: string;
			public donotpostalmail?: string;
			public address1_stateorprovince?: string;
			public address2_shippingmethodcode?: string;
			public modifiedon?: string;
			public territorycode?: string;
			public marketcap_base?: number;
			public _modifiedbyexternalparty_value?: string;
			public accountclassificationcode?: string;
			public createdon?: string;
			public preferredcontactmethodcode?: string;
			public accountid?: string;
			public revenue_base?: number;
			public address2_utcoffset?: number;
			public aging60?: number;
			public originatingleadidname?: string;
			public preferredappointmentdaycode?: string;
			public paymenttermscode?: string;
			public preferredserviceidname?: string;
			public address1_county?: string;
			public _primarycontactid_value?: string;
			public stageid?: string;
			public address1_telephone3?: string;
			public msa_managingpartneridname?: string;
			public _preferredequipmentid_value?: string;
			public entityimage_url?: string;
			public primarytwitterid?: string;
			public address2_line2?: string;
			public address1_addresstypecode?: string;
			public adx_modifiedbyipaddress?: string;
			public _owninguser_value?: string;
			public _transactioncurrencyid_value?: string;
			public _slaid_value?: string;
			public opendeals_state?: number;
			public address1_city?: string;
			public owningbusinessunitname?: string;
			public _slainvokedid_value?: string;
			public fax?: string;
			public _createdbyexternalparty_value?: string;
			public donotbulkpostalmail?: string;
			public address2_composite?: string;
			public ren_expectedprefix?: string;
			public owneridtype?: string;
			public address1_name?: string;
			public address2_upszone?: string;
			public parentaccountidname?: string;
			public telephone3?: string;
			public aging90_base?: number;
			public aging30?: number;
			public entityimage_timestamp?: number;
			public donotbulkemail?: string;
			public modifiedbyexternalpartyname?: string;
			public openrevenue_base?: number;
			public emailaddress3?: string;
			public address1_latitude?: number;
			public creditlimit?: number;
			public teamsfollowed?: number;
			public primarysatoriid?: string;
			public address2_country?: string;
			public telephone2?: string;
			public createdbyexternalpartyname?: string;
			public lastusedincampaign?: string;
			public accountnumber?: string;
			public address1_line3?: string;
			public adx_createdbyusername?: string;
			public primarycontactidname?: string;
			public timespentbymeonemailandmeetings?: string;
			public address1_primarycontactname?: string;
			public donotphone?: string;
			public msdyn_gdproptout?: string;
			public address2_freighttermscode?: string;
			public address2_postofficebox?: string;
			public ren_accounttype?: string;
			public donotsendmm?: string;
			public _msdyn_segmentid_value?: string;
			public preferredequipmentidname?: string;
			public _parentaccountid_value?: string;
			public opendeals?: number;
			public msdyn_salesaccelerationinsightidname?: string;
			public _territoryid_value?: string;
			public slaname?: string;
			public address1_composite?: string;
			public ftpsiteurl?: string;
			public isprivate?: string;
			public sic?: string;
			public _masterid_value?: string;
			public address2_line1?: string;
			public _owningbusinessunit_value?: string;
			public lastonholdtime?: string;
			public address1_telephone1?: string;
			public address2_fax?: string;
			public description?: string;
			public address2_addresstypecode?: string;
			public websiteurl?: string;
			public stockexchange?: string;
			public _originatingleadid_value?: string;
			public address1_addressid?: string;
			public _owningteam_value?: string;
			public preferredsystemuseridname?: string;
			public address1_freighttermscode?: string;
			public address2_latitude?: number;
			public merged?: string;
			public traversedpath?: string;
			public address2_addressid?: string;
			public onholdtime?: number;
			public address1_line1?: string;
			public donotfax?: string;
			public owneridname?: string;
			public address2_telephone1?: string;
			public address2_telephone2?: string;
			public address2_telephone3?: string;
			public _preferredsystemuserid_value?: string;
			public address2_name?: string;
			public msdyn_segmentidname?: string;
			public customertypecode?: string;
			public donotemail?: string;
			public _createdby_value?: string;
			public createdbyname?: string;
			public accountcategorycode?: string;
			public tickersymbol?: string;
			public address2_primarycontactname?: string;
			public creditonhold?: string;
			public opendeals_date?: string;
			public address1_fax?: string;
			public followemail?: string;
			public name?: string;
			public _msdyn_salesaccelerationinsightid_value?: string;
			public participatesinworkflow?: string;
			public adx_modifiedbyusername?: string;
			public sharesoutstanding?: number;
			public address1_postalcode?: string;

		constructor(initData?: IAccount) {
			super("accounts");
			if (initData == undefined) { return; } 
      
			this.id = initData.accountid;
		
			this.address2_postalcode = initData.address2_postalcode;
			this.address1_longitude = initData.address1_longitude;
			this.aging90 = initData.aging90;
			this.address2_county = initData.address2_county;
			this.defaultpricelevelidname = initData.defaultpricelevelidname;
			this.slainvokedidname = initData.slainvokedidname;
			this.masteraccountidname = initData.masteraccountidname;
			this._modifiedby_value = initData._modifiedby_value;
			this.creditlimit_base = initData.creditlimit_base;
			this.marketingonly = initData.marketingonly;
			this.ownershipcode = initData.ownershipcode;
			this.entityimageid = initData.entityimageid;
			this.statuscode = initData.statuscode;
			this.address2_longitude = initData.address2_longitude;
			this.address2_line3 = initData.address2_line3;
			this.aging60_base = initData.aging60_base;
			this.industrycode = initData.industrycode;
			this.address1_telephone2 = initData.address1_telephone2;
			this.transactioncurrencyidname = initData.transactioncurrencyidname;
			this.address1_upszone = initData.address1_upszone;
			this.processid = initData.processid;
			this.marketcap = initData.marketcap;
			this.openrevenue_date = initData.openrevenue_date;
			this.openrevenue = initData.openrevenue;
			this.address2_city = initData.address2_city;
			this.emailaddress2 = initData.emailaddress2;
			this.emailaddress1 = initData.emailaddress1;
			this.customersizecode = initData.customersizecode;
			this.adx_createdbyipaddress = initData.adx_createdbyipaddress;
			this.address1_country = initData.address1_country;
			this.statecode = initData.statecode;
			this.accountratingcode = initData.accountratingcode;
			this.modifiedbyname = initData.modifiedbyname;
			this.revenue = initData.revenue;
			this.address1_shippingmethodcode = initData.address1_shippingmethodcode;
			this.exchangerate = initData.exchangerate;
			this.aging30_base = initData.aging30_base;
			this._defaultpricelevelid_value = initData._defaultpricelevelid_value;
			this.businesstypecode = initData.businesstypecode;
			this.address1_line2 = initData.address1_line2;
			this._preferredserviceid_value = initData._preferredserviceid_value;
			this.address1_postofficebox = initData.address1_postofficebox;
			this._msa_managingpartnerid_value = initData._msa_managingpartnerid_value;
			this._ownerid_value = initData._ownerid_value;
			this.openrevenue_state = initData.openrevenue_state;
			this.numberofemployees = initData.numberofemployees;
			this.shippingmethodcode = initData.shippingmethodcode;
			this.address1_utcoffset = initData.address1_utcoffset;
			this.address2_stateorprovince = initData.address2_stateorprovince;
			this.territoryidname = initData.territoryidname;
			this.telephone1 = initData.telephone1;
			this.preferredappointmenttimecode = initData.preferredappointmenttimecode;
			this.donotpostalmail = initData.donotpostalmail;
			this.address1_stateorprovince = initData.address1_stateorprovince;
			this.address2_shippingmethodcode = initData.address2_shippingmethodcode;
			this.modifiedon = initData.modifiedon;
			this.territorycode = initData.territorycode;
			this.marketcap_base = initData.marketcap_base;
			this._modifiedbyexternalparty_value = initData._modifiedbyexternalparty_value;
			this.accountclassificationcode = initData.accountclassificationcode;
			this.createdon = initData.createdon;
			this.preferredcontactmethodcode = initData.preferredcontactmethodcode;
			this.accountid = initData.accountid;
			this.revenue_base = initData.revenue_base;
			this.address2_utcoffset = initData.address2_utcoffset;
			this.aging60 = initData.aging60;
			this.originatingleadidname = initData.originatingleadidname;
			this.preferredappointmentdaycode = initData.preferredappointmentdaycode;
			this.paymenttermscode = initData.paymenttermscode;
			this.preferredserviceidname = initData.preferredserviceidname;
			this.address1_county = initData.address1_county;
			this._primarycontactid_value = initData._primarycontactid_value;
			this.stageid = initData.stageid;
			this.address1_telephone3 = initData.address1_telephone3;
			this.msa_managingpartneridname = initData.msa_managingpartneridname;
			this._preferredequipmentid_value = initData._preferredequipmentid_value;
			this.entityimage_url = initData.entityimage_url;
			this.primarytwitterid = initData.primarytwitterid;
			this.address2_line2 = initData.address2_line2;
			this.address1_addresstypecode = initData.address1_addresstypecode;
			this.adx_modifiedbyipaddress = initData.adx_modifiedbyipaddress;
			this._owninguser_value = initData._owninguser_value;
			this._transactioncurrencyid_value = initData._transactioncurrencyid_value;
			this._slaid_value = initData._slaid_value;
			this.opendeals_state = initData.opendeals_state;
			this.address1_city = initData.address1_city;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this._slainvokedid_value = initData._slainvokedid_value;
			this.fax = initData.fax;
			this._createdbyexternalparty_value = initData._createdbyexternalparty_value;
			this.donotbulkpostalmail = initData.donotbulkpostalmail;
			this.address2_composite = initData.address2_composite;
			this.ren_expectedprefix = initData.ren_expectedprefix;
			this.owneridtype = initData.owneridtype;
			this.address1_name = initData.address1_name;
			this.address2_upszone = initData.address2_upszone;
			this.parentaccountidname = initData.parentaccountidname;
			this.telephone3 = initData.telephone3;
			this.aging90_base = initData.aging90_base;
			this.aging30 = initData.aging30;
			this.entityimage_timestamp = initData.entityimage_timestamp;
			this.donotbulkemail = initData.donotbulkemail;
			this.modifiedbyexternalpartyname = initData.modifiedbyexternalpartyname;
			this.openrevenue_base = initData.openrevenue_base;
			this.emailaddress3 = initData.emailaddress3;
			this.address1_latitude = initData.address1_latitude;
			this.creditlimit = initData.creditlimit;
			this.teamsfollowed = initData.teamsfollowed;
			this.primarysatoriid = initData.primarysatoriid;
			this.address2_country = initData.address2_country;
			this.telephone2 = initData.telephone2;
			this.createdbyexternalpartyname = initData.createdbyexternalpartyname;
			this.lastusedincampaign = initData.lastusedincampaign;
			this.accountnumber = initData.accountnumber;
			this.address1_line3 = initData.address1_line3;
			this.adx_createdbyusername = initData.adx_createdbyusername;
			this.primarycontactidname = initData.primarycontactidname;
			this.timespentbymeonemailandmeetings = initData.timespentbymeonemailandmeetings;
			this.address1_primarycontactname = initData.address1_primarycontactname;
			this.donotphone = initData.donotphone;
			this.msdyn_gdproptout = initData.msdyn_gdproptout;
			this.address2_freighttermscode = initData.address2_freighttermscode;
			this.address2_postofficebox = initData.address2_postofficebox;
			this.ren_accounttype = initData.ren_accounttype;
			this.donotsendmm = initData.donotsendmm;
			this._msdyn_segmentid_value = initData._msdyn_segmentid_value;
			this.preferredequipmentidname = initData.preferredequipmentidname;
			this._parentaccountid_value = initData._parentaccountid_value;
			this.opendeals = initData.opendeals;
			this.msdyn_salesaccelerationinsightidname = initData.msdyn_salesaccelerationinsightidname;
			this._territoryid_value = initData._territoryid_value;
			this.slaname = initData.slaname;
			this.address1_composite = initData.address1_composite;
			this.ftpsiteurl = initData.ftpsiteurl;
			this.isprivate = initData.isprivate;
			this.sic = initData.sic;
			this._masterid_value = initData._masterid_value;
			this.address2_line1 = initData.address2_line1;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.lastonholdtime = initData.lastonholdtime;
			this.address1_telephone1 = initData.address1_telephone1;
			this.address2_fax = initData.address2_fax;
			this.description = initData.description;
			this.address2_addresstypecode = initData.address2_addresstypecode;
			this.websiteurl = initData.websiteurl;
			this.stockexchange = initData.stockexchange;
			this._originatingleadid_value = initData._originatingleadid_value;
			this.address1_addressid = initData.address1_addressid;
			this._owningteam_value = initData._owningteam_value;
			this.preferredsystemuseridname = initData.preferredsystemuseridname;
			this.address1_freighttermscode = initData.address1_freighttermscode;
			this.address2_latitude = initData.address2_latitude;
			this.merged = initData.merged;
			this.traversedpath = initData.traversedpath;
			this.address2_addressid = initData.address2_addressid;
			this.onholdtime = initData.onholdtime;
			this.address1_line1 = initData.address1_line1;
			this.donotfax = initData.donotfax;
			this.owneridname = initData.owneridname;
			this.address2_telephone1 = initData.address2_telephone1;
			this.address2_telephone2 = initData.address2_telephone2;
			this.address2_telephone3 = initData.address2_telephone3;
			this._preferredsystemuserid_value = initData._preferredsystemuserid_value;
			this.address2_name = initData.address2_name;
			this.msdyn_segmentidname = initData.msdyn_segmentidname;
			this.customertypecode = initData.customertypecode;
			this.donotemail = initData.donotemail;
			this._createdby_value = initData._createdby_value;
			this.createdbyname = initData.createdbyname;
			this.accountcategorycode = initData.accountcategorycode;
			this.tickersymbol = initData.tickersymbol;
			this.address2_primarycontactname = initData.address2_primarycontactname;
			this.creditonhold = initData.creditonhold;
			this.opendeals_date = initData.opendeals_date;
			this.address1_fax = initData.address1_fax;
			this.followemail = initData.followemail;
			this.name = initData.name;
			this._msdyn_salesaccelerationinsightid_value = initData._msdyn_salesaccelerationinsightid_value;
			this.participatesinworkflow = initData.participatesinworkflow;
			this.adx_modifiedbyusername = initData.adx_modifiedbyusername;
			this.sharesoutstanding = initData.sharesoutstanding;
			this.address1_postalcode = initData.address1_postalcode;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Contact
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Contact */
	export interface IContacts extends IRetrieveMultipleData<IContact> {}

	//** @description WebAPI interface for Contact */
	export interface IContact {
		[key: string]: string | number | undefined;
		
		_msdyn_segmentid_value?: string
		createdbyname?: string
		address3_postofficebox?: string
		contactid?: string
		address2_telephone3?: string
		address1_shippingmethodcode?: string
		teamsfollowed?: number
		_originatingleadid_value?: string
		adx_confirmremovepassword?: string
		aging60?: number
		msa_managingpartneridname?: string
		address2_upszone?: string
		creditlimit_base?: number
		merged?: string
		adx_createdbyipaddress?: string
		parentcustomeridtype?: string
		externaluseridentifier?: string
		pager?: string
		followemail?: string
		mobilephone?: string
		adx_profilealert?: string
		numberofchildren?: number
		address2_stateorprovince?: string
		adx_createdbyusername?: string
		msdyn_isminorwithparentalconsent?: string
		address2_line3?: string
		adx_preferredlanguageidname?: string
		aging30?: number
		address2_latitude?: number
		_ren_facility_value?: string
		fax?: string
		donotfax?: string
		adx_identity_logonenabled?: string
		address2_shippingmethodcode?: string
		address1_line3?: string
		_owningbusinessunit_value?: string
		address3_utcoffset?: number
		address3_county?: string
		transactioncurrencyidname?: string
		_parentcontactid_value?: string
		managername?: string
		msdyn_orgchangestatus?: string
		adx_identity_lastsuccessfullogin?: string
		address1_telephone3?: string
		address2_name?: string
		owningbusinessunitname?: string
		onholdtime?: number
		adx_profileisanonymous?: string
		assistantname?: string
		address3_postalcode?: string
		address1_freighttermscode?: string
		adx_identity_lockoutenddate?: string
		address1_postalcode?: string
		aging30_base?: number
		businesscard?: string
		address1_line1?: string
		department?: string
		isbackofficecustomer?: string
		createdbyexternalpartyname?: string
		yomifirstname?: string
		_defaultpricelevelid_value?: string
		preferredequipmentidname?: string
		shippingmethodcode?: string
		address3_primarycontactname?: string
		preferredappointmenttimecode?: string
		_adx_preferredlanguageid_value?: string
		preferredcontactmethodcode?: string
		address2_city?: string
		address2_country?: string
		traversedpath?: string
		ren_ssn?: string
		address3_freighttermscode?: string
		address3_telephone1?: string
		address3_telephone2?: string
		ftpsiteurl?: string
		annualincome?: number
		adx_identity_locallogindisabled?: string
		address1_county?: string
		address3_addressid?: string
		defaultpricelevelidname?: string
		_slainvokedid_value?: string
		parentcustomerid?: string
		modifiedbyname?: string
		donotemail?: string
		mastercontactidname?: string
		entityimageid?: string
		address3_line3?: string
		address3_country?: string
		address2_telephone1?: string
		address2_telephone2?: string
		msdyn_disablewebtracking?: string
		parentcustomeridname?: string
		isautocreate?: string
		emailaddress2?: string
		_owninguser_value?: string
		employeeid?: string
		address3_composite?: string
		msdyn_segmentidname?: string
		adx_profilealertdate?: string
		birthdate?: string
		address1_primarycontactname?: string
		address1_utcoffset?: number
		territorycode?: string
		createdon?: string
		address1_longitude?: number
		yomifullname?: string
		telephone2?: string
		donotpostalmail?: string
		address2_longitude?: number
		address2_line1?: string
		websiteurl?: string
		accountrolecode?: string
		emailaddress3?: string
		adx_identity_emailaddress1confirmed?: string
		emailaddress1?: string
		owneridtype?: string
		address1_fax?: string
		preferredsystemuseridname?: string
		_msa_managingpartnerid_value?: string
		description?: string
		address2_primarycontactname?: string
		address2_freighttermscode?: string
		leadsourcecode?: string
		_preferredsystemuserid_value?: string
		isprivate?: string
		_parent_contactid_value?: string
		address2_postofficebox?: string
		_accountid_value?: string
		address3_telephone3?: string
		firstname?: string
		_modifiedbyexternalparty_value?: string
		processid?: string
		address3_fax?: string
		subscriptionid?: string
		address2_addressid?: string
		governmentid?: string
		adx_modifiedbyipaddress?: string
		business2?: string
		middlename?: string
		haschildrencode?: string
		address1_city?: string
		adx_identity_passwordhash?: string
		_createdby_value?: string
		slaname?: string
		entityimage_timestamp?: number
		modifiedon?: string
		gendercode?: string
		address3_line1?: string
		_owningteam_value?: string
		msdyn_portaltermsagreementdate?: string
		adx_organizationname?: string
		_createdbyexternalparty_value?: string
		preferredserviceidname?: string
		_slaid_value?: string
		address3_upszone?: string
		aging90_base?: number
		ren_contacttype?: string
		adx_profilealertinstructions?: string
		address3_city?: string
		yomilastname?: string
		address3_latitude?: number
		adx_identity_securitystamp?: string
		customertypecode?: string
		adx_identity_accessfailedcount?: number
		address2_addresstypecode?: string
		address1_composite?: string
		entityimage_url?: string
		creditlimit?: number
		donotbulkemail?: string
		address2_postalcode?: string
		address3_line2?: string
		_transactioncurrencyid_value?: string
		company?: string
		_modifiedby_value?: string
		adx_identity_lockoutenabled?: string
		msdyn_isminor?: string
		educationcode?: string
		adx_identity_newpassword?: string
		address1_stateorprovince?: string
		telephone3?: string
		address2_utcoffset?: number
		statuscode?: string
		donotsendmm?: string
		lastusedincampaign?: string
		address1_country?: string
		address2_fax?: string
		address1_upszone?: string
		suffix?: string
		modifiedbyexternalpartyname?: string
		adx_publicprofilecopy?: string
		address3_shippingmethodcode?: string
		yomimiddlename?: string
		customersizecode?: string
		address1_telephone1?: string
		address1_telephone2?: string
		aging60_base?: number
		telephone1?: string
		address2_line2?: string
		paymenttermscode?: string
		adx_identity_username?: string
		ren_facilityname?: string
		address1_addressid?: string
		adx_timezone?: number
		address3_addresstypecode?: string
		familystatuscode?: string
		address2_county?: string
		spousesname?: string
		owneridname?: string
		address1_latitude?: number
		address2_composite?: string
		donotphone?: string
		adx_identity_twofactorenabled?: string
		parentcontactidname?: string
		creditonhold?: string
		stageid?: string
		address3_stateorprovince?: string
		childrensnames?: string
		_ownerid_value?: string
		exchangerate?: number
		_preferredserviceid_value?: string
		jobtitle?: string
		managerphone?: string
		adx_modifiedbyusername?: string
		lastonholdtime?: string
		adx_profilelastactivity?: string
		address1_name?: string
		address1_postofficebox?: string
		adx_profilemodifiedon?: string
		_masterid_value?: string
		businesscardattributes?: string
		address1_line2?: string
		timespentbymeonemailandmeetings?: string
		adx_identity_mobilephoneconfirmed?: string
		nickname?: string
		marketingonly?: string
		donotbulkpostalmail?: string
		callback?: string
		anniversary?: string
		parent_contactidname?: string
		preferredappointmentdaycode?: string
		address3_longitude?: number
		address3_name?: string
		fullname?: string
		lastname?: string
		originatingleadidname?: string
		salutation?: string
		accountidname?: string
		aging90?: number
		_preferredequipmentid_value?: string
		slainvokedidname?: string
		address1_addresstypecode?: string
		participatesinworkflow?: string
		msdyn_gdproptout?: string
		statecode?: number
		home2?: string
		assistantphone?: string
		annualincome_base?: number

  }
  
  //** Collection of Attribute structures for Contact */
  export class ContactAttributes {
		public static LogicalName:string = "contact"
		
		msdyn_segmentid: IAttribName = { name:"msdyn_segmentid", api_name:"_msdyn_segmentid_value" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		address3_postofficebox: IAttribName = { name:"address3_postofficebox", api_name:"address3_postofficebox" } 
		contactid: IAttribName = { name:"contactid", api_name:"contactid" } 
		address2_telephone3: IAttribName = { name:"address2_telephone3", api_name:"address2_telephone3" } 
		address1_shippingmethodcode: IAttribName = { name:"address1_shippingmethodcode", api_name:"address1_shippingmethodcode" } 
		teamsfollowed: IAttribName = { name:"teamsfollowed", api_name:"teamsfollowed" } 
		originatingleadid: IAttribName = { name:"originatingleadid", api_name:"_originatingleadid_value" } 
		adx_confirmremovepassword: IAttribName = { name:"adx_confirmremovepassword", api_name:"adx_confirmremovepassword" } 
		aging60: IAttribName = { name:"aging60", api_name:"aging60" } 
		msa_managingpartneridname: IAttribName = { name:"msa_managingpartneridname", api_name:"msa_managingpartneridname" } 
		address2_upszone: IAttribName = { name:"address2_upszone", api_name:"address2_upszone" } 
		creditlimit_base: IAttribName = { name:"creditlimit_base", api_name:"creditlimit_base" } 
		merged: IAttribName = { name:"merged", api_name:"merged" } 
		adx_createdbyipaddress: IAttribName = { name:"adx_createdbyipaddress", api_name:"adx_createdbyipaddress" } 
		parentcustomeridtype: IAttribName = { name:"parentcustomeridtype", api_name:"parentcustomeridtype" } 
		externaluseridentifier: IAttribName = { name:"externaluseridentifier", api_name:"externaluseridentifier" } 
		pager: IAttribName = { name:"pager", api_name:"pager" } 
		followemail: IAttribName = { name:"followemail", api_name:"followemail" } 
		mobilephone: IAttribName = { name:"mobilephone", api_name:"mobilephone" } 
		adx_profilealert: IAttribName = { name:"adx_profilealert", api_name:"adx_profilealert" } 
		numberofchildren: IAttribName = { name:"numberofchildren", api_name:"numberofchildren" } 
		address2_stateorprovince: IAttribName = { name:"address2_stateorprovince", api_name:"address2_stateorprovince" } 
		adx_createdbyusername: IAttribName = { name:"adx_createdbyusername", api_name:"adx_createdbyusername" } 
		msdyn_isminorwithparentalconsent: IAttribName = { name:"msdyn_isminorwithparentalconsent", api_name:"msdyn_isminorwithparentalconsent" } 
		address2_line3: IAttribName = { name:"address2_line3", api_name:"address2_line3" } 
		adx_preferredlanguageidname: IAttribName = { name:"adx_preferredlanguageidname", api_name:"adx_preferredlanguageidname" } 
		aging30: IAttribName = { name:"aging30", api_name:"aging30" } 
		address2_latitude: IAttribName = { name:"address2_latitude", api_name:"address2_latitude" } 
		ren_facility: IAttribName = { name:"ren_facility", api_name:"_ren_facility_value" } 
		fax: IAttribName = { name:"fax", api_name:"fax" } 
		donotfax: IAttribName = { name:"donotfax", api_name:"donotfax" } 
		adx_identity_logonenabled: IAttribName = { name:"adx_identity_logonenabled", api_name:"adx_identity_logonenabled" } 
		address2_shippingmethodcode: IAttribName = { name:"address2_shippingmethodcode", api_name:"address2_shippingmethodcode" } 
		address1_line3: IAttribName = { name:"address1_line3", api_name:"address1_line3" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		address3_utcoffset: IAttribName = { name:"address3_utcoffset", api_name:"address3_utcoffset" } 
		address3_county: IAttribName = { name:"address3_county", api_name:"address3_county" } 
		transactioncurrencyidname: IAttribName = { name:"transactioncurrencyidname", api_name:"transactioncurrencyidname" } 
		parentcontactid: IAttribName = { name:"parentcontactid", api_name:"_parentcontactid_value" } 
		managername: IAttribName = { name:"managername", api_name:"managername" } 
		msdyn_orgchangestatus: IAttribName = { name:"msdyn_orgchangestatus", api_name:"msdyn_orgchangestatus" } 
		adx_identity_lastsuccessfullogin: IAttribName = { name:"adx_identity_lastsuccessfullogin", api_name:"adx_identity_lastsuccessfullogin" } 
		address1_telephone3: IAttribName = { name:"address1_telephone3", api_name:"address1_telephone3" } 
		address2_name: IAttribName = { name:"address2_name", api_name:"address2_name" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		onholdtime: IAttribName = { name:"onholdtime", api_name:"onholdtime" } 
		adx_profileisanonymous: IAttribName = { name:"adx_profileisanonymous", api_name:"adx_profileisanonymous" } 
		assistantname: IAttribName = { name:"assistantname", api_name:"assistantname" } 
		address3_postalcode: IAttribName = { name:"address3_postalcode", api_name:"address3_postalcode" } 
		address1_freighttermscode: IAttribName = { name:"address1_freighttermscode", api_name:"address1_freighttermscode" } 
		adx_identity_lockoutenddate: IAttribName = { name:"adx_identity_lockoutenddate", api_name:"adx_identity_lockoutenddate" } 
		address1_postalcode: IAttribName = { name:"address1_postalcode", api_name:"address1_postalcode" } 
		aging30_base: IAttribName = { name:"aging30_base", api_name:"aging30_base" } 
		businesscard: IAttribName = { name:"businesscard", api_name:"businesscard" } 
		address1_line1: IAttribName = { name:"address1_line1", api_name:"address1_line1" } 
		department: IAttribName = { name:"department", api_name:"department" } 
		isbackofficecustomer: IAttribName = { name:"isbackofficecustomer", api_name:"isbackofficecustomer" } 
		createdbyexternalpartyname: IAttribName = { name:"createdbyexternalpartyname", api_name:"createdbyexternalpartyname" } 
		yomifirstname: IAttribName = { name:"yomifirstname", api_name:"yomifirstname" } 
		defaultpricelevelid: IAttribName = { name:"defaultpricelevelid", api_name:"_defaultpricelevelid_value" } 
		preferredequipmentidname: IAttribName = { name:"preferredequipmentidname", api_name:"preferredequipmentidname" } 
		shippingmethodcode: IAttribName = { name:"shippingmethodcode", api_name:"shippingmethodcode" } 
		address3_primarycontactname: IAttribName = { name:"address3_primarycontactname", api_name:"address3_primarycontactname" } 
		preferredappointmenttimecode: IAttribName = { name:"preferredappointmenttimecode", api_name:"preferredappointmenttimecode" } 
		adx_preferredlanguageid: IAttribName = { name:"adx_preferredlanguageid", api_name:"_adx_preferredlanguageid_value" } 
		preferredcontactmethodcode: IAttribName = { name:"preferredcontactmethodcode", api_name:"preferredcontactmethodcode" } 
		address2_city: IAttribName = { name:"address2_city", api_name:"address2_city" } 
		address2_country: IAttribName = { name:"address2_country", api_name:"address2_country" } 
		traversedpath: IAttribName = { name:"traversedpath", api_name:"traversedpath" } 
		ren_ssn: IAttribName = { name:"ren_ssn", api_name:"ren_ssn" } 
		address3_freighttermscode: IAttribName = { name:"address3_freighttermscode", api_name:"address3_freighttermscode" } 
		address3_telephone1: IAttribName = { name:"address3_telephone1", api_name:"address3_telephone1" } 
		address3_telephone2: IAttribName = { name:"address3_telephone2", api_name:"address3_telephone2" } 
		ftpsiteurl: IAttribName = { name:"ftpsiteurl", api_name:"ftpsiteurl" } 
		annualincome: IAttribName = { name:"annualincome", api_name:"annualincome" } 
		adx_identity_locallogindisabled: IAttribName = { name:"adx_identity_locallogindisabled", api_name:"adx_identity_locallogindisabled" } 
		address1_county: IAttribName = { name:"address1_county", api_name:"address1_county" } 
		address3_addressid: IAttribName = { name:"address3_addressid", api_name:"address3_addressid" } 
		defaultpricelevelidname: IAttribName = { name:"defaultpricelevelidname", api_name:"defaultpricelevelidname" } 
		slainvokedid: IAttribName = { name:"slainvokedid", api_name:"_slainvokedid_value" } 
		parentcustomerid: IAttribName = { name:"parentcustomerid", api_name:"parentcustomerid" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		donotemail: IAttribName = { name:"donotemail", api_name:"donotemail" } 
		mastercontactidname: IAttribName = { name:"mastercontactidname", api_name:"mastercontactidname" } 
		entityimageid: IAttribName = { name:"entityimageid", api_name:"entityimageid" } 
		address3_line3: IAttribName = { name:"address3_line3", api_name:"address3_line3" } 
		address3_country: IAttribName = { name:"address3_country", api_name:"address3_country" } 
		address2_telephone1: IAttribName = { name:"address2_telephone1", api_name:"address2_telephone1" } 
		address2_telephone2: IAttribName = { name:"address2_telephone2", api_name:"address2_telephone2" } 
		msdyn_disablewebtracking: IAttribName = { name:"msdyn_disablewebtracking", api_name:"msdyn_disablewebtracking" } 
		parentcustomeridname: IAttribName = { name:"parentcustomeridname", api_name:"parentcustomeridname" } 
		isautocreate: IAttribName = { name:"isautocreate", api_name:"isautocreate" } 
		emailaddress2: IAttribName = { name:"emailaddress2", api_name:"emailaddress2" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		employeeid: IAttribName = { name:"employeeid", api_name:"employeeid" } 
		address3_composite: IAttribName = { name:"address3_composite", api_name:"address3_composite" } 
		msdyn_segmentidname: IAttribName = { name:"msdyn_segmentidname", api_name:"msdyn_segmentidname" } 
		adx_profilealertdate: IAttribName = { name:"adx_profilealertdate", api_name:"adx_profilealertdate" } 
		birthdate: IAttribName = { name:"birthdate", api_name:"birthdate" } 
		address1_primarycontactname: IAttribName = { name:"address1_primarycontactname", api_name:"address1_primarycontactname" } 
		address1_utcoffset: IAttribName = { name:"address1_utcoffset", api_name:"address1_utcoffset" } 
		territorycode: IAttribName = { name:"territorycode", api_name:"territorycode" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		address1_longitude: IAttribName = { name:"address1_longitude", api_name:"address1_longitude" } 
		yomifullname: IAttribName = { name:"yomifullname", api_name:"yomifullname" } 
		telephone2: IAttribName = { name:"telephone2", api_name:"telephone2" } 
		donotpostalmail: IAttribName = { name:"donotpostalmail", api_name:"donotpostalmail" } 
		address2_longitude: IAttribName = { name:"address2_longitude", api_name:"address2_longitude" } 
		address2_line1: IAttribName = { name:"address2_line1", api_name:"address2_line1" } 
		websiteurl: IAttribName = { name:"websiteurl", api_name:"websiteurl" } 
		accountrolecode: IAttribName = { name:"accountrolecode", api_name:"accountrolecode" } 
		emailaddress3: IAttribName = { name:"emailaddress3", api_name:"emailaddress3" } 
		adx_identity_emailaddress1confirmed: IAttribName = { name:"adx_identity_emailaddress1confirmed", api_name:"adx_identity_emailaddress1confirmed" } 
		emailaddress1: IAttribName = { name:"emailaddress1", api_name:"emailaddress1" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		address1_fax: IAttribName = { name:"address1_fax", api_name:"address1_fax" } 
		preferredsystemuseridname: IAttribName = { name:"preferredsystemuseridname", api_name:"preferredsystemuseridname" } 
		msa_managingpartnerid: IAttribName = { name:"msa_managingpartnerid", api_name:"_msa_managingpartnerid_value" } 
		description: IAttribName = { name:"description", api_name:"description" } 
		address2_primarycontactname: IAttribName = { name:"address2_primarycontactname", api_name:"address2_primarycontactname" } 
		address2_freighttermscode: IAttribName = { name:"address2_freighttermscode", api_name:"address2_freighttermscode" } 
		leadsourcecode: IAttribName = { name:"leadsourcecode", api_name:"leadsourcecode" } 
		preferredsystemuserid: IAttribName = { name:"preferredsystemuserid", api_name:"_preferredsystemuserid_value" } 
		isprivate: IAttribName = { name:"isprivate", api_name:"isprivate" } 
		parent_contactid: IAttribName = { name:"parent_contactid", api_name:"_parent_contactid_value" } 
		address2_postofficebox: IAttribName = { name:"address2_postofficebox", api_name:"address2_postofficebox" } 
		accountid: IAttribName = { name:"accountid", api_name:"_accountid_value" } 
		address3_telephone3: IAttribName = { name:"address3_telephone3", api_name:"address3_telephone3" } 
		firstname: IAttribName = { name:"firstname", api_name:"firstname" } 
		modifiedbyexternalparty: IAttribName = { name:"modifiedbyexternalparty", api_name:"_modifiedbyexternalparty_value" } 
		processid: IAttribName = { name:"processid", api_name:"processid" } 
		address3_fax: IAttribName = { name:"address3_fax", api_name:"address3_fax" } 
		subscriptionid: IAttribName = { name:"subscriptionid", api_name:"subscriptionid" } 
		address2_addressid: IAttribName = { name:"address2_addressid", api_name:"address2_addressid" } 
		governmentid: IAttribName = { name:"governmentid", api_name:"governmentid" } 
		adx_modifiedbyipaddress: IAttribName = { name:"adx_modifiedbyipaddress", api_name:"adx_modifiedbyipaddress" } 
		business2: IAttribName = { name:"business2", api_name:"business2" } 
		middlename: IAttribName = { name:"middlename", api_name:"middlename" } 
		haschildrencode: IAttribName = { name:"haschildrencode", api_name:"haschildrencode" } 
		address1_city: IAttribName = { name:"address1_city", api_name:"address1_city" } 
		adx_identity_passwordhash: IAttribName = { name:"adx_identity_passwordhash", api_name:"adx_identity_passwordhash" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		slaname: IAttribName = { name:"slaname", api_name:"slaname" } 
		entityimage_timestamp: IAttribName = { name:"entityimage_timestamp", api_name:"entityimage_timestamp" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		gendercode: IAttribName = { name:"gendercode", api_name:"gendercode" } 
		address3_line1: IAttribName = { name:"address3_line1", api_name:"address3_line1" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		msdyn_portaltermsagreementdate: IAttribName = { name:"msdyn_portaltermsagreementdate", api_name:"msdyn_portaltermsagreementdate" } 
		adx_organizationname: IAttribName = { name:"adx_organizationname", api_name:"adx_organizationname" } 
		createdbyexternalparty: IAttribName = { name:"createdbyexternalparty", api_name:"_createdbyexternalparty_value" } 
		preferredserviceidname: IAttribName = { name:"preferredserviceidname", api_name:"preferredserviceidname" } 
		slaid: IAttribName = { name:"slaid", api_name:"_slaid_value" } 
		address3_upszone: IAttribName = { name:"address3_upszone", api_name:"address3_upszone" } 
		aging90_base: IAttribName = { name:"aging90_base", api_name:"aging90_base" } 
		ren_contacttype: IAttribName = { name:"ren_contacttype", api_name:"ren_contacttype" } 
		adx_profilealertinstructions: IAttribName = { name:"adx_profilealertinstructions", api_name:"adx_profilealertinstructions" } 
		address3_city: IAttribName = { name:"address3_city", api_name:"address3_city" } 
		yomilastname: IAttribName = { name:"yomilastname", api_name:"yomilastname" } 
		address3_latitude: IAttribName = { name:"address3_latitude", api_name:"address3_latitude" } 
		adx_identity_securitystamp: IAttribName = { name:"adx_identity_securitystamp", api_name:"adx_identity_securitystamp" } 
		customertypecode: IAttribName = { name:"customertypecode", api_name:"customertypecode" } 
		adx_identity_accessfailedcount: IAttribName = { name:"adx_identity_accessfailedcount", api_name:"adx_identity_accessfailedcount" } 
		address2_addresstypecode: IAttribName = { name:"address2_addresstypecode", api_name:"address2_addresstypecode" } 
		address1_composite: IAttribName = { name:"address1_composite", api_name:"address1_composite" } 
		entityimage_url: IAttribName = { name:"entityimage_url", api_name:"entityimage_url" } 
		creditlimit: IAttribName = { name:"creditlimit", api_name:"creditlimit" } 
		donotbulkemail: IAttribName = { name:"donotbulkemail", api_name:"donotbulkemail" } 
		address2_postalcode: IAttribName = { name:"address2_postalcode", api_name:"address2_postalcode" } 
		address3_line2: IAttribName = { name:"address3_line2", api_name:"address3_line2" } 
		transactioncurrencyid: IAttribName = { name:"transactioncurrencyid", api_name:"_transactioncurrencyid_value" } 
		company: IAttribName = { name:"company", api_name:"company" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		adx_identity_lockoutenabled: IAttribName = { name:"adx_identity_lockoutenabled", api_name:"adx_identity_lockoutenabled" } 
		msdyn_isminor: IAttribName = { name:"msdyn_isminor", api_name:"msdyn_isminor" } 
		educationcode: IAttribName = { name:"educationcode", api_name:"educationcode" } 
		adx_identity_newpassword: IAttribName = { name:"adx_identity_newpassword", api_name:"adx_identity_newpassword" } 
		address1_stateorprovince: IAttribName = { name:"address1_stateorprovince", api_name:"address1_stateorprovince" } 
		telephone3: IAttribName = { name:"telephone3", api_name:"telephone3" } 
		address2_utcoffset: IAttribName = { name:"address2_utcoffset", api_name:"address2_utcoffset" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		donotsendmm: IAttribName = { name:"donotsendmm", api_name:"donotsendmm" } 
		lastusedincampaign: IAttribName = { name:"lastusedincampaign", api_name:"lastusedincampaign" } 
		address1_country: IAttribName = { name:"address1_country", api_name:"address1_country" } 
		address2_fax: IAttribName = { name:"address2_fax", api_name:"address2_fax" } 
		address1_upszone: IAttribName = { name:"address1_upszone", api_name:"address1_upszone" } 
		suffix: IAttribName = { name:"suffix", api_name:"suffix" } 
		modifiedbyexternalpartyname: IAttribName = { name:"modifiedbyexternalpartyname", api_name:"modifiedbyexternalpartyname" } 
		adx_publicprofilecopy: IAttribName = { name:"adx_publicprofilecopy", api_name:"adx_publicprofilecopy" } 
		address3_shippingmethodcode: IAttribName = { name:"address3_shippingmethodcode", api_name:"address3_shippingmethodcode" } 
		yomimiddlename: IAttribName = { name:"yomimiddlename", api_name:"yomimiddlename" } 
		customersizecode: IAttribName = { name:"customersizecode", api_name:"customersizecode" } 
		address1_telephone1: IAttribName = { name:"address1_telephone1", api_name:"address1_telephone1" } 
		address1_telephone2: IAttribName = { name:"address1_telephone2", api_name:"address1_telephone2" } 
		aging60_base: IAttribName = { name:"aging60_base", api_name:"aging60_base" } 
		telephone1: IAttribName = { name:"telephone1", api_name:"telephone1" } 
		address2_line2: IAttribName = { name:"address2_line2", api_name:"address2_line2" } 
		paymenttermscode: IAttribName = { name:"paymenttermscode", api_name:"paymenttermscode" } 
		adx_identity_username: IAttribName = { name:"adx_identity_username", api_name:"adx_identity_username" } 
		ren_facilityname: IAttribName = { name:"ren_facilityname", api_name:"ren_facilityname" } 
		address1_addressid: IAttribName = { name:"address1_addressid", api_name:"address1_addressid" } 
		adx_timezone: IAttribName = { name:"adx_timezone", api_name:"adx_timezone" } 
		address3_addresstypecode: IAttribName = { name:"address3_addresstypecode", api_name:"address3_addresstypecode" } 
		familystatuscode: IAttribName = { name:"familystatuscode", api_name:"familystatuscode" } 
		address2_county: IAttribName = { name:"address2_county", api_name:"address2_county" } 
		spousesname: IAttribName = { name:"spousesname", api_name:"spousesname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		address1_latitude: IAttribName = { name:"address1_latitude", api_name:"address1_latitude" } 
		address2_composite: IAttribName = { name:"address2_composite", api_name:"address2_composite" } 
		donotphone: IAttribName = { name:"donotphone", api_name:"donotphone" } 
		adx_identity_twofactorenabled: IAttribName = { name:"adx_identity_twofactorenabled", api_name:"adx_identity_twofactorenabled" } 
		parentcontactidname: IAttribName = { name:"parentcontactidname", api_name:"parentcontactidname" } 
		creditonhold: IAttribName = { name:"creditonhold", api_name:"creditonhold" } 
		stageid: IAttribName = { name:"stageid", api_name:"stageid" } 
		address3_stateorprovince: IAttribName = { name:"address3_stateorprovince", api_name:"address3_stateorprovince" } 
		childrensnames: IAttribName = { name:"childrensnames", api_name:"childrensnames" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		exchangerate: IAttribName = { name:"exchangerate", api_name:"exchangerate" } 
		preferredserviceid: IAttribName = { name:"preferredserviceid", api_name:"_preferredserviceid_value" } 
		jobtitle: IAttribName = { name:"jobtitle", api_name:"jobtitle" } 
		managerphone: IAttribName = { name:"managerphone", api_name:"managerphone" } 
		adx_modifiedbyusername: IAttribName = { name:"adx_modifiedbyusername", api_name:"adx_modifiedbyusername" } 
		lastonholdtime: IAttribName = { name:"lastonholdtime", api_name:"lastonholdtime" } 
		adx_profilelastactivity: IAttribName = { name:"adx_profilelastactivity", api_name:"adx_profilelastactivity" } 
		address1_name: IAttribName = { name:"address1_name", api_name:"address1_name" } 
		address1_postofficebox: IAttribName = { name:"address1_postofficebox", api_name:"address1_postofficebox" } 
		adx_profilemodifiedon: IAttribName = { name:"adx_profilemodifiedon", api_name:"adx_profilemodifiedon" } 
		masterid: IAttribName = { name:"masterid", api_name:"_masterid_value" } 
		businesscardattributes: IAttribName = { name:"businesscardattributes", api_name:"businesscardattributes" } 
		address1_line2: IAttribName = { name:"address1_line2", api_name:"address1_line2" } 
		timespentbymeonemailandmeetings: IAttribName = { name:"timespentbymeonemailandmeetings", api_name:"timespentbymeonemailandmeetings" } 
		adx_identity_mobilephoneconfirmed: IAttribName = { name:"adx_identity_mobilephoneconfirmed", api_name:"adx_identity_mobilephoneconfirmed" } 
		nickname: IAttribName = { name:"nickname", api_name:"nickname" } 
		marketingonly: IAttribName = { name:"marketingonly", api_name:"marketingonly" } 
		donotbulkpostalmail: IAttribName = { name:"donotbulkpostalmail", api_name:"donotbulkpostalmail" } 
		callback: IAttribName = { name:"callback", api_name:"callback" } 
		anniversary: IAttribName = { name:"anniversary", api_name:"anniversary" } 
		parent_contactidname: IAttribName = { name:"parent_contactidname", api_name:"parent_contactidname" } 
		preferredappointmentdaycode: IAttribName = { name:"preferredappointmentdaycode", api_name:"preferredappointmentdaycode" } 
		address3_longitude: IAttribName = { name:"address3_longitude", api_name:"address3_longitude" } 
		address3_name: IAttribName = { name:"address3_name", api_name:"address3_name" } 
		fullname: IAttribName = { name:"fullname", api_name:"fullname" } 
		lastname: IAttribName = { name:"lastname", api_name:"lastname" } 
		originatingleadidname: IAttribName = { name:"originatingleadidname", api_name:"originatingleadidname" } 
		salutation: IAttribName = { name:"salutation", api_name:"salutation" } 
		accountidname: IAttribName = { name:"accountidname", api_name:"accountidname" } 
		aging90: IAttribName = { name:"aging90", api_name:"aging90" } 
		preferredequipmentid: IAttribName = { name:"preferredequipmentid", api_name:"_preferredequipmentid_value" } 
		slainvokedidname: IAttribName = { name:"slainvokedidname", api_name:"slainvokedidname" } 
		address1_addresstypecode: IAttribName = { name:"address1_addresstypecode", api_name:"address1_addresstypecode" } 
		participatesinworkflow: IAttribName = { name:"participatesinworkflow", api_name:"participatesinworkflow" } 
		msdyn_gdproptout: IAttribName = { name:"msdyn_gdproptout", api_name:"msdyn_gdproptout" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		home2: IAttribName = { name:"home2", api_name:"home2" } 
		assistantphone: IAttribName = { name:"assistantphone", api_name:"assistantphone" } 
		annualincome_base: IAttribName = { name:"annualincome_base", api_name:"annualincome_base" } 

	}

  /** @description Instantiates a Contact Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Contact extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "contacts";
		
			public _msdyn_segmentid_value?: string;
			public createdbyname?: string;
			public address3_postofficebox?: string;
			public contactid?: string;
			public address2_telephone3?: string;
			public address1_shippingmethodcode?: string;
			public teamsfollowed?: number;
			public _originatingleadid_value?: string;
			public adx_confirmremovepassword?: string;
			public aging60?: number;
			public msa_managingpartneridname?: string;
			public address2_upszone?: string;
			public creditlimit_base?: number;
			public merged?: string;
			public adx_createdbyipaddress?: string;
			public parentcustomeridtype?: string;
			public externaluseridentifier?: string;
			public pager?: string;
			public followemail?: string;
			public mobilephone?: string;
			public adx_profilealert?: string;
			public numberofchildren?: number;
			public address2_stateorprovince?: string;
			public adx_createdbyusername?: string;
			public msdyn_isminorwithparentalconsent?: string;
			public address2_line3?: string;
			public adx_preferredlanguageidname?: string;
			public aging30?: number;
			public address2_latitude?: number;
			public _ren_facility_value?: string;
			public fax?: string;
			public donotfax?: string;
			public adx_identity_logonenabled?: string;
			public address2_shippingmethodcode?: string;
			public address1_line3?: string;
			public _owningbusinessunit_value?: string;
			public address3_utcoffset?: number;
			public address3_county?: string;
			public transactioncurrencyidname?: string;
			public _parentcontactid_value?: string;
			public managername?: string;
			public msdyn_orgchangestatus?: string;
			public adx_identity_lastsuccessfullogin?: string;
			public address1_telephone3?: string;
			public address2_name?: string;
			public owningbusinessunitname?: string;
			public onholdtime?: number;
			public adx_profileisanonymous?: string;
			public assistantname?: string;
			public address3_postalcode?: string;
			public address1_freighttermscode?: string;
			public adx_identity_lockoutenddate?: string;
			public address1_postalcode?: string;
			public aging30_base?: number;
			public businesscard?: string;
			public address1_line1?: string;
			public department?: string;
			public isbackofficecustomer?: string;
			public createdbyexternalpartyname?: string;
			public yomifirstname?: string;
			public _defaultpricelevelid_value?: string;
			public preferredequipmentidname?: string;
			public shippingmethodcode?: string;
			public address3_primarycontactname?: string;
			public preferredappointmenttimecode?: string;
			public _adx_preferredlanguageid_value?: string;
			public preferredcontactmethodcode?: string;
			public address2_city?: string;
			public address2_country?: string;
			public traversedpath?: string;
			public ren_ssn?: string;
			public address3_freighttermscode?: string;
			public address3_telephone1?: string;
			public address3_telephone2?: string;
			public ftpsiteurl?: string;
			public annualincome?: number;
			public adx_identity_locallogindisabled?: string;
			public address1_county?: string;
			public address3_addressid?: string;
			public defaultpricelevelidname?: string;
			public _slainvokedid_value?: string;
			public parentcustomerid?: string;
			public modifiedbyname?: string;
			public donotemail?: string;
			public mastercontactidname?: string;
			public entityimageid?: string;
			public address3_line3?: string;
			public address3_country?: string;
			public address2_telephone1?: string;
			public address2_telephone2?: string;
			public msdyn_disablewebtracking?: string;
			public parentcustomeridname?: string;
			public isautocreate?: string;
			public emailaddress2?: string;
			public _owninguser_value?: string;
			public employeeid?: string;
			public address3_composite?: string;
			public msdyn_segmentidname?: string;
			public adx_profilealertdate?: string;
			public birthdate?: string;
			public address1_primarycontactname?: string;
			public address1_utcoffset?: number;
			public territorycode?: string;
			public createdon?: string;
			public address1_longitude?: number;
			public yomifullname?: string;
			public telephone2?: string;
			public donotpostalmail?: string;
			public address2_longitude?: number;
			public address2_line1?: string;
			public websiteurl?: string;
			public accountrolecode?: string;
			public emailaddress3?: string;
			public adx_identity_emailaddress1confirmed?: string;
			public emailaddress1?: string;
			public owneridtype?: string;
			public address1_fax?: string;
			public preferredsystemuseridname?: string;
			public _msa_managingpartnerid_value?: string;
			public description?: string;
			public address2_primarycontactname?: string;
			public address2_freighttermscode?: string;
			public leadsourcecode?: string;
			public _preferredsystemuserid_value?: string;
			public isprivate?: string;
			public _parent_contactid_value?: string;
			public address2_postofficebox?: string;
			public _accountid_value?: string;
			public address3_telephone3?: string;
			public firstname?: string;
			public _modifiedbyexternalparty_value?: string;
			public processid?: string;
			public address3_fax?: string;
			public subscriptionid?: string;
			public address2_addressid?: string;
			public governmentid?: string;
			public adx_modifiedbyipaddress?: string;
			public business2?: string;
			public middlename?: string;
			public haschildrencode?: string;
			public address1_city?: string;
			public adx_identity_passwordhash?: string;
			public _createdby_value?: string;
			public slaname?: string;
			public entityimage_timestamp?: number;
			public modifiedon?: string;
			public gendercode?: string;
			public address3_line1?: string;
			public _owningteam_value?: string;
			public msdyn_portaltermsagreementdate?: string;
			public adx_organizationname?: string;
			public _createdbyexternalparty_value?: string;
			public preferredserviceidname?: string;
			public _slaid_value?: string;
			public address3_upszone?: string;
			public aging90_base?: number;
			public ren_contacttype?: string;
			public adx_profilealertinstructions?: string;
			public address3_city?: string;
			public yomilastname?: string;
			public address3_latitude?: number;
			public adx_identity_securitystamp?: string;
			public customertypecode?: string;
			public adx_identity_accessfailedcount?: number;
			public address2_addresstypecode?: string;
			public address1_composite?: string;
			public entityimage_url?: string;
			public creditlimit?: number;
			public donotbulkemail?: string;
			public address2_postalcode?: string;
			public address3_line2?: string;
			public _transactioncurrencyid_value?: string;
			public company?: string;
			public _modifiedby_value?: string;
			public adx_identity_lockoutenabled?: string;
			public msdyn_isminor?: string;
			public educationcode?: string;
			public adx_identity_newpassword?: string;
			public address1_stateorprovince?: string;
			public telephone3?: string;
			public address2_utcoffset?: number;
			public statuscode?: string;
			public donotsendmm?: string;
			public lastusedincampaign?: string;
			public address1_country?: string;
			public address2_fax?: string;
			public address1_upszone?: string;
			public suffix?: string;
			public modifiedbyexternalpartyname?: string;
			public adx_publicprofilecopy?: string;
			public address3_shippingmethodcode?: string;
			public yomimiddlename?: string;
			public customersizecode?: string;
			public address1_telephone1?: string;
			public address1_telephone2?: string;
			public aging60_base?: number;
			public telephone1?: string;
			public address2_line2?: string;
			public paymenttermscode?: string;
			public adx_identity_username?: string;
			public ren_facilityname?: string;
			public address1_addressid?: string;
			public adx_timezone?: number;
			public address3_addresstypecode?: string;
			public familystatuscode?: string;
			public address2_county?: string;
			public spousesname?: string;
			public owneridname?: string;
			public address1_latitude?: number;
			public address2_composite?: string;
			public donotphone?: string;
			public adx_identity_twofactorenabled?: string;
			public parentcontactidname?: string;
			public creditonhold?: string;
			public stageid?: string;
			public address3_stateorprovince?: string;
			public childrensnames?: string;
			public _ownerid_value?: string;
			public exchangerate?: number;
			public _preferredserviceid_value?: string;
			public jobtitle?: string;
			public managerphone?: string;
			public adx_modifiedbyusername?: string;
			public lastonholdtime?: string;
			public adx_profilelastactivity?: string;
			public address1_name?: string;
			public address1_postofficebox?: string;
			public adx_profilemodifiedon?: string;
			public _masterid_value?: string;
			public businesscardattributes?: string;
			public address1_line2?: string;
			public timespentbymeonemailandmeetings?: string;
			public adx_identity_mobilephoneconfirmed?: string;
			public nickname?: string;
			public marketingonly?: string;
			public donotbulkpostalmail?: string;
			public callback?: string;
			public anniversary?: string;
			public parent_contactidname?: string;
			public preferredappointmentdaycode?: string;
			public address3_longitude?: number;
			public address3_name?: string;
			public fullname?: string;
			public lastname?: string;
			public originatingleadidname?: string;
			public salutation?: string;
			public accountidname?: string;
			public aging90?: number;
			public _preferredequipmentid_value?: string;
			public slainvokedidname?: string;
			public address1_addresstypecode?: string;
			public participatesinworkflow?: string;
			public msdyn_gdproptout?: string;
			public statecode?: number;
			public home2?: string;
			public assistantphone?: string;
			public annualincome_base?: number;

		constructor(initData?: IContact) {
			super("contacts");
			if (initData == undefined) { return; } 
      
			this.id = initData.contactid;
		
			this._msdyn_segmentid_value = initData._msdyn_segmentid_value;
			this.createdbyname = initData.createdbyname;
			this.address3_postofficebox = initData.address3_postofficebox;
			this.contactid = initData.contactid;
			this.address2_telephone3 = initData.address2_telephone3;
			this.address1_shippingmethodcode = initData.address1_shippingmethodcode;
			this.teamsfollowed = initData.teamsfollowed;
			this._originatingleadid_value = initData._originatingleadid_value;
			this.adx_confirmremovepassword = initData.adx_confirmremovepassword;
			this.aging60 = initData.aging60;
			this.msa_managingpartneridname = initData.msa_managingpartneridname;
			this.address2_upszone = initData.address2_upszone;
			this.creditlimit_base = initData.creditlimit_base;
			this.merged = initData.merged;
			this.adx_createdbyipaddress = initData.adx_createdbyipaddress;
			this.parentcustomeridtype = initData.parentcustomeridtype;
			this.externaluseridentifier = initData.externaluseridentifier;
			this.pager = initData.pager;
			this.followemail = initData.followemail;
			this.mobilephone = initData.mobilephone;
			this.adx_profilealert = initData.adx_profilealert;
			this.numberofchildren = initData.numberofchildren;
			this.address2_stateorprovince = initData.address2_stateorprovince;
			this.adx_createdbyusername = initData.adx_createdbyusername;
			this.msdyn_isminorwithparentalconsent = initData.msdyn_isminorwithparentalconsent;
			this.address2_line3 = initData.address2_line3;
			this.adx_preferredlanguageidname = initData.adx_preferredlanguageidname;
			this.aging30 = initData.aging30;
			this.address2_latitude = initData.address2_latitude;
			this._ren_facility_value = initData._ren_facility_value;
			this.fax = initData.fax;
			this.donotfax = initData.donotfax;
			this.adx_identity_logonenabled = initData.adx_identity_logonenabled;
			this.address2_shippingmethodcode = initData.address2_shippingmethodcode;
			this.address1_line3 = initData.address1_line3;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.address3_utcoffset = initData.address3_utcoffset;
			this.address3_county = initData.address3_county;
			this.transactioncurrencyidname = initData.transactioncurrencyidname;
			this._parentcontactid_value = initData._parentcontactid_value;
			this.managername = initData.managername;
			this.msdyn_orgchangestatus = initData.msdyn_orgchangestatus;
			this.adx_identity_lastsuccessfullogin = initData.adx_identity_lastsuccessfullogin;
			this.address1_telephone3 = initData.address1_telephone3;
			this.address2_name = initData.address2_name;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.onholdtime = initData.onholdtime;
			this.adx_profileisanonymous = initData.adx_profileisanonymous;
			this.assistantname = initData.assistantname;
			this.address3_postalcode = initData.address3_postalcode;
			this.address1_freighttermscode = initData.address1_freighttermscode;
			this.adx_identity_lockoutenddate = initData.adx_identity_lockoutenddate;
			this.address1_postalcode = initData.address1_postalcode;
			this.aging30_base = initData.aging30_base;
			this.businesscard = initData.businesscard;
			this.address1_line1 = initData.address1_line1;
			this.department = initData.department;
			this.isbackofficecustomer = initData.isbackofficecustomer;
			this.createdbyexternalpartyname = initData.createdbyexternalpartyname;
			this.yomifirstname = initData.yomifirstname;
			this._defaultpricelevelid_value = initData._defaultpricelevelid_value;
			this.preferredequipmentidname = initData.preferredequipmentidname;
			this.shippingmethodcode = initData.shippingmethodcode;
			this.address3_primarycontactname = initData.address3_primarycontactname;
			this.preferredappointmenttimecode = initData.preferredappointmenttimecode;
			this._adx_preferredlanguageid_value = initData._adx_preferredlanguageid_value;
			this.preferredcontactmethodcode = initData.preferredcontactmethodcode;
			this.address2_city = initData.address2_city;
			this.address2_country = initData.address2_country;
			this.traversedpath = initData.traversedpath;
			this.ren_ssn = initData.ren_ssn;
			this.address3_freighttermscode = initData.address3_freighttermscode;
			this.address3_telephone1 = initData.address3_telephone1;
			this.address3_telephone2 = initData.address3_telephone2;
			this.ftpsiteurl = initData.ftpsiteurl;
			this.annualincome = initData.annualincome;
			this.adx_identity_locallogindisabled = initData.adx_identity_locallogindisabled;
			this.address1_county = initData.address1_county;
			this.address3_addressid = initData.address3_addressid;
			this.defaultpricelevelidname = initData.defaultpricelevelidname;
			this._slainvokedid_value = initData._slainvokedid_value;
			this.parentcustomerid = initData.parentcustomerid;
			this.modifiedbyname = initData.modifiedbyname;
			this.donotemail = initData.donotemail;
			this.mastercontactidname = initData.mastercontactidname;
			this.entityimageid = initData.entityimageid;
			this.address3_line3 = initData.address3_line3;
			this.address3_country = initData.address3_country;
			this.address2_telephone1 = initData.address2_telephone1;
			this.address2_telephone2 = initData.address2_telephone2;
			this.msdyn_disablewebtracking = initData.msdyn_disablewebtracking;
			this.parentcustomeridname = initData.parentcustomeridname;
			this.isautocreate = initData.isautocreate;
			this.emailaddress2 = initData.emailaddress2;
			this._owninguser_value = initData._owninguser_value;
			this.employeeid = initData.employeeid;
			this.address3_composite = initData.address3_composite;
			this.msdyn_segmentidname = initData.msdyn_segmentidname;
			this.adx_profilealertdate = initData.adx_profilealertdate;
			this.birthdate = initData.birthdate;
			this.address1_primarycontactname = initData.address1_primarycontactname;
			this.address1_utcoffset = initData.address1_utcoffset;
			this.territorycode = initData.territorycode;
			this.createdon = initData.createdon;
			this.address1_longitude = initData.address1_longitude;
			this.yomifullname = initData.yomifullname;
			this.telephone2 = initData.telephone2;
			this.donotpostalmail = initData.donotpostalmail;
			this.address2_longitude = initData.address2_longitude;
			this.address2_line1 = initData.address2_line1;
			this.websiteurl = initData.websiteurl;
			this.accountrolecode = initData.accountrolecode;
			this.emailaddress3 = initData.emailaddress3;
			this.adx_identity_emailaddress1confirmed = initData.adx_identity_emailaddress1confirmed;
			this.emailaddress1 = initData.emailaddress1;
			this.owneridtype = initData.owneridtype;
			this.address1_fax = initData.address1_fax;
			this.preferredsystemuseridname = initData.preferredsystemuseridname;
			this._msa_managingpartnerid_value = initData._msa_managingpartnerid_value;
			this.description = initData.description;
			this.address2_primarycontactname = initData.address2_primarycontactname;
			this.address2_freighttermscode = initData.address2_freighttermscode;
			this.leadsourcecode = initData.leadsourcecode;
			this._preferredsystemuserid_value = initData._preferredsystemuserid_value;
			this.isprivate = initData.isprivate;
			this._parent_contactid_value = initData._parent_contactid_value;
			this.address2_postofficebox = initData.address2_postofficebox;
			this._accountid_value = initData._accountid_value;
			this.address3_telephone3 = initData.address3_telephone3;
			this.firstname = initData.firstname;
			this._modifiedbyexternalparty_value = initData._modifiedbyexternalparty_value;
			this.processid = initData.processid;
			this.address3_fax = initData.address3_fax;
			this.subscriptionid = initData.subscriptionid;
			this.address2_addressid = initData.address2_addressid;
			this.governmentid = initData.governmentid;
			this.adx_modifiedbyipaddress = initData.adx_modifiedbyipaddress;
			this.business2 = initData.business2;
			this.middlename = initData.middlename;
			this.haschildrencode = initData.haschildrencode;
			this.address1_city = initData.address1_city;
			this.adx_identity_passwordhash = initData.adx_identity_passwordhash;
			this._createdby_value = initData._createdby_value;
			this.slaname = initData.slaname;
			this.entityimage_timestamp = initData.entityimage_timestamp;
			this.modifiedon = initData.modifiedon;
			this.gendercode = initData.gendercode;
			this.address3_line1 = initData.address3_line1;
			this._owningteam_value = initData._owningteam_value;
			this.msdyn_portaltermsagreementdate = initData.msdyn_portaltermsagreementdate;
			this.adx_organizationname = initData.adx_organizationname;
			this._createdbyexternalparty_value = initData._createdbyexternalparty_value;
			this.preferredserviceidname = initData.preferredserviceidname;
			this._slaid_value = initData._slaid_value;
			this.address3_upszone = initData.address3_upszone;
			this.aging90_base = initData.aging90_base;
			this.ren_contacttype = initData.ren_contacttype;
			this.adx_profilealertinstructions = initData.adx_profilealertinstructions;
			this.address3_city = initData.address3_city;
			this.yomilastname = initData.yomilastname;
			this.address3_latitude = initData.address3_latitude;
			this.adx_identity_securitystamp = initData.adx_identity_securitystamp;
			this.customertypecode = initData.customertypecode;
			this.adx_identity_accessfailedcount = initData.adx_identity_accessfailedcount;
			this.address2_addresstypecode = initData.address2_addresstypecode;
			this.address1_composite = initData.address1_composite;
			this.entityimage_url = initData.entityimage_url;
			this.creditlimit = initData.creditlimit;
			this.donotbulkemail = initData.donotbulkemail;
			this.address2_postalcode = initData.address2_postalcode;
			this.address3_line2 = initData.address3_line2;
			this._transactioncurrencyid_value = initData._transactioncurrencyid_value;
			this.company = initData.company;
			this._modifiedby_value = initData._modifiedby_value;
			this.adx_identity_lockoutenabled = initData.adx_identity_lockoutenabled;
			this.msdyn_isminor = initData.msdyn_isminor;
			this.educationcode = initData.educationcode;
			this.adx_identity_newpassword = initData.adx_identity_newpassword;
			this.address1_stateorprovince = initData.address1_stateorprovince;
			this.telephone3 = initData.telephone3;
			this.address2_utcoffset = initData.address2_utcoffset;
			this.statuscode = initData.statuscode;
			this.donotsendmm = initData.donotsendmm;
			this.lastusedincampaign = initData.lastusedincampaign;
			this.address1_country = initData.address1_country;
			this.address2_fax = initData.address2_fax;
			this.address1_upszone = initData.address1_upszone;
			this.suffix = initData.suffix;
			this.modifiedbyexternalpartyname = initData.modifiedbyexternalpartyname;
			this.adx_publicprofilecopy = initData.adx_publicprofilecopy;
			this.address3_shippingmethodcode = initData.address3_shippingmethodcode;
			this.yomimiddlename = initData.yomimiddlename;
			this.customersizecode = initData.customersizecode;
			this.address1_telephone1 = initData.address1_telephone1;
			this.address1_telephone2 = initData.address1_telephone2;
			this.aging60_base = initData.aging60_base;
			this.telephone1 = initData.telephone1;
			this.address2_line2 = initData.address2_line2;
			this.paymenttermscode = initData.paymenttermscode;
			this.adx_identity_username = initData.adx_identity_username;
			this.ren_facilityname = initData.ren_facilityname;
			this.address1_addressid = initData.address1_addressid;
			this.adx_timezone = initData.adx_timezone;
			this.address3_addresstypecode = initData.address3_addresstypecode;
			this.familystatuscode = initData.familystatuscode;
			this.address2_county = initData.address2_county;
			this.spousesname = initData.spousesname;
			this.owneridname = initData.owneridname;
			this.address1_latitude = initData.address1_latitude;
			this.address2_composite = initData.address2_composite;
			this.donotphone = initData.donotphone;
			this.adx_identity_twofactorenabled = initData.adx_identity_twofactorenabled;
			this.parentcontactidname = initData.parentcontactidname;
			this.creditonhold = initData.creditonhold;
			this.stageid = initData.stageid;
			this.address3_stateorprovince = initData.address3_stateorprovince;
			this.childrensnames = initData.childrensnames;
			this._ownerid_value = initData._ownerid_value;
			this.exchangerate = initData.exchangerate;
			this._preferredserviceid_value = initData._preferredserviceid_value;
			this.jobtitle = initData.jobtitle;
			this.managerphone = initData.managerphone;
			this.adx_modifiedbyusername = initData.adx_modifiedbyusername;
			this.lastonholdtime = initData.lastonholdtime;
			this.adx_profilelastactivity = initData.adx_profilelastactivity;
			this.address1_name = initData.address1_name;
			this.address1_postofficebox = initData.address1_postofficebox;
			this.adx_profilemodifiedon = initData.adx_profilemodifiedon;
			this._masterid_value = initData._masterid_value;
			this.businesscardattributes = initData.businesscardattributes;
			this.address1_line2 = initData.address1_line2;
			this.timespentbymeonemailandmeetings = initData.timespentbymeonemailandmeetings;
			this.adx_identity_mobilephoneconfirmed = initData.adx_identity_mobilephoneconfirmed;
			this.nickname = initData.nickname;
			this.marketingonly = initData.marketingonly;
			this.donotbulkpostalmail = initData.donotbulkpostalmail;
			this.callback = initData.callback;
			this.anniversary = initData.anniversary;
			this.parent_contactidname = initData.parent_contactidname;
			this.preferredappointmentdaycode = initData.preferredappointmentdaycode;
			this.address3_longitude = initData.address3_longitude;
			this.address3_name = initData.address3_name;
			this.fullname = initData.fullname;
			this.lastname = initData.lastname;
			this.originatingleadidname = initData.originatingleadidname;
			this.salutation = initData.salutation;
			this.accountidname = initData.accountidname;
			this.aging90 = initData.aging90;
			this._preferredequipmentid_value = initData._preferredequipmentid_value;
			this.slainvokedidname = initData.slainvokedidname;
			this.address1_addresstypecode = initData.address1_addresstypecode;
			this.participatesinworkflow = initData.participatesinworkflow;
			this.msdyn_gdproptout = initData.msdyn_gdproptout;
			this.statecode = initData.statecode;
			this.home2 = initData.home2;
			this.assistantphone = initData.assistantphone;
			this.annualincome_base = initData.annualincome_base;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Incident
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Incident */
	export interface IIncidents extends IRetrieveMultipleData<IIncident> {}

	//** @description WebAPI interface for Incident */
	export interface IIncident {
		[key: string]: string | number | undefined;
		
		ren_precert?: number
		ren_totalunitsused_date?: string
		_ownerid_value?: string
		incidentstagecode?: string
		productidname?: string
		_firstresponsebykpiid_value?: string
		accountidname?: string
		firstresponsebykpiidname?: string
		_slaid_value?: string
		_contractid_value?: string
		severitycode?: string
		_parentcaseid_value?: string
		_modifiedby_value?: string
		isescalated?: string
		customeridname?: string
		slaname?: string
		entityimage_url?: string
		_resolvebykpiid_value?: string
		actualserviceunits?: number
		_subjectid_value?: string
		owningbusinessunitname?: string
		ren_firstbillingbyname?: string
		_transactioncurrencyid_value?: string
		ren_totalunitsused?: number
		escalatedon?: string
		ren_thirdpolicename?: string
		_slainvokedid_value?: string
		caseorigincode?: string
		_primarycontactid_value?: string
		socialprofileidname?: string
		_responsiblecontactid_value?: string
		firstresponseslastatus?: string
		customersatisfactioncode?: string
		resolvebykpiidname?: string
		ren_countserviceevent_date?: string
		activitiescomplete?: string
		messagetypecode?: string
		ren_lastauthbyname?: string
		entityimageid?: string
		_contractdetailid_value?: string
		ren_firstauthbyname?: string
		casetypecode?: string
		ren_startofcare?: string
		followuptaskcreated?: string
		masteridname?: string
		onholdtime?: number
		ren_validated?: string
		_kbarticleid_value?: string
		prioritycode?: string
		resolveby?: string
		_ren_firstbillingby_value?: string
		responsiblecontactidname?: string
		modifiedon?: string
		ticketnumber?: string
		ren_totalunitsauthorized?: number
		merged?: string
		owneridtype?: string
		ren_validatedbyname?: string
		routecase?: string
		_ren_patient_value?: string
		ren_secondarypolicyname?: string
		followupby?: string
		ren_lastauthon?: string
		_masterid_value?: string
		_modifiedbyexternalparty_value?: string
		createdbyname?: string
		ren_countserviceevent?: number
		msdyn_iotalertname?: string
		ren_completedon?: string
		_existingcase_value?: string
		_accountid_value?: string
		createdon?: string
		entityimage_timestamp?: number
		ren_lastorentry?: string
		ren_countserviceevent_state?: number
		slainvokedidname?: string
		emailaddress?: string
		ren_patientname?: string
		servicestage?: string
		_entitlementid_value?: string
		isdecrementing?: string
		parentcaseidname?: string
		sentimentvalue?: number
		ren_totalunitsauthorized_date?: string
		primarycontactidname?: string
		_ren_firstauthby_value?: string
		firstresponsesent?: string
		_ren_primarypolicy_value?: string
		_ren_firstvobby_value?: string
		_ren_secondarypolicy_value?: string
		_contactid_value?: string
		ren_primarypolicyname?: string
		ren_lastpaymentposted?: string
		customerid?: string
		subjectidname?: string
		modifiedbyname?: string
		_owningteam_value?: string
		createdbyexternalpartyname?: string
		exchangerate?: number
		processid?: string
		title?: string
		_createdbyexternalparty_value?: string
		numberofchildincidents?: number
		resolvebyslastatus?: string
		_ren_validatedby_value?: string
		ren_firstvobon?: string
		incidentid?: string
		blockedprofile?: string
		ren_facilityname?: string
		contactidname?: string
		kbarticleidname?: string
		_ren_lastauthby_value?: string
		ren_totalunitsauthorized_state?: number
		transactioncurrencyidname?: string
		ren_firstauthon?: string
		billedserviceunits?: number
		_ren_facility_value?: string
		_productid_value?: string
		customercontacted?: string
		_owninguser_value?: string
		checkemail?: string
		_createdby_value?: string
		ren_firstvobbyname?: string
		contractdetailidname?: string
		owneridname?: string
		_msdyn_iotalert_value?: string
		entitlementidname?: string
		lastonholdtime?: string
		statuscode?: string
		influencescore?: number
		customeridtype?: string
		_socialprofileid_value?: string
		responseby?: string
		statecode?: number
		description?: string
		ren_endofcare?: string
		decremententitlementterm?: string
		productserialnumber?: string
		stageid?: string
		contractservicelevelcode?: string
		ren_totalunitsused_state?: number
		traversedpath?: string
		ren_firstbillingon?: string
		modifiedbyexternalpartyname?: string
		_ren_thirdpolice_value?: string
		_owningbusinessunit_value?: string
		contractidname?: string

  }
  
  //** Collection of Attribute structures for Incident */
  export class IncidentAttributes {
		public static LogicalName:string = "incident"
		
		ren_precert: IAttribName = { name:"ren_precert", api_name:"ren_precert" } 
		ren_totalunitsused_date: IAttribName = { name:"ren_totalunitsused_date", api_name:"ren_totalunitsused_date" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		incidentstagecode: IAttribName = { name:"incidentstagecode", api_name:"incidentstagecode" } 
		productidname: IAttribName = { name:"productidname", api_name:"productidname" } 
		firstresponsebykpiid: IAttribName = { name:"firstresponsebykpiid", api_name:"_firstresponsebykpiid_value" } 
		accountidname: IAttribName = { name:"accountidname", api_name:"accountidname" } 
		firstresponsebykpiidname: IAttribName = { name:"firstresponsebykpiidname", api_name:"firstresponsebykpiidname" } 
		slaid: IAttribName = { name:"slaid", api_name:"_slaid_value" } 
		contractid: IAttribName = { name:"contractid", api_name:"_contractid_value" } 
		severitycode: IAttribName = { name:"severitycode", api_name:"severitycode" } 
		parentcaseid: IAttribName = { name:"parentcaseid", api_name:"_parentcaseid_value" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		isescalated: IAttribName = { name:"isescalated", api_name:"isescalated" } 
		customeridname: IAttribName = { name:"customeridname", api_name:"customeridname" } 
		slaname: IAttribName = { name:"slaname", api_name:"slaname" } 
		entityimage_url: IAttribName = { name:"entityimage_url", api_name:"entityimage_url" } 
		resolvebykpiid: IAttribName = { name:"resolvebykpiid", api_name:"_resolvebykpiid_value" } 
		actualserviceunits: IAttribName = { name:"actualserviceunits", api_name:"actualserviceunits" } 
		subjectid: IAttribName = { name:"subjectid", api_name:"_subjectid_value" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		ren_firstbillingbyname: IAttribName = { name:"ren_firstbillingbyname", api_name:"ren_firstbillingbyname" } 
		transactioncurrencyid: IAttribName = { name:"transactioncurrencyid", api_name:"_transactioncurrencyid_value" } 
		ren_totalunitsused: IAttribName = { name:"ren_totalunitsused", api_name:"ren_totalunitsused" } 
		escalatedon: IAttribName = { name:"escalatedon", api_name:"escalatedon" } 
		ren_thirdpolicename: IAttribName = { name:"ren_thirdpolicename", api_name:"ren_thirdpolicename" } 
		slainvokedid: IAttribName = { name:"slainvokedid", api_name:"_slainvokedid_value" } 
		caseorigincode: IAttribName = { name:"caseorigincode", api_name:"caseorigincode" } 
		primarycontactid: IAttribName = { name:"primarycontactid", api_name:"_primarycontactid_value" } 
		socialprofileidname: IAttribName = { name:"socialprofileidname", api_name:"socialprofileidname" } 
		responsiblecontactid: IAttribName = { name:"responsiblecontactid", api_name:"_responsiblecontactid_value" } 
		firstresponseslastatus: IAttribName = { name:"firstresponseslastatus", api_name:"firstresponseslastatus" } 
		customersatisfactioncode: IAttribName = { name:"customersatisfactioncode", api_name:"customersatisfactioncode" } 
		resolvebykpiidname: IAttribName = { name:"resolvebykpiidname", api_name:"resolvebykpiidname" } 
		ren_countserviceevent_date: IAttribName = { name:"ren_countserviceevent_date", api_name:"ren_countserviceevent_date" } 
		activitiescomplete: IAttribName = { name:"activitiescomplete", api_name:"activitiescomplete" } 
		messagetypecode: IAttribName = { name:"messagetypecode", api_name:"messagetypecode" } 
		ren_lastauthbyname: IAttribName = { name:"ren_lastauthbyname", api_name:"ren_lastauthbyname" } 
		entityimageid: IAttribName = { name:"entityimageid", api_name:"entityimageid" } 
		contractdetailid: IAttribName = { name:"contractdetailid", api_name:"_contractdetailid_value" } 
		ren_firstauthbyname: IAttribName = { name:"ren_firstauthbyname", api_name:"ren_firstauthbyname" } 
		casetypecode: IAttribName = { name:"casetypecode", api_name:"casetypecode" } 
		ren_startofcare: IAttribName = { name:"ren_startofcare", api_name:"ren_startofcare" } 
		followuptaskcreated: IAttribName = { name:"followuptaskcreated", api_name:"followuptaskcreated" } 
		masteridname: IAttribName = { name:"masteridname", api_name:"masteridname" } 
		onholdtime: IAttribName = { name:"onholdtime", api_name:"onholdtime" } 
		ren_validated: IAttribName = { name:"ren_validated", api_name:"ren_validated" } 
		kbarticleid: IAttribName = { name:"kbarticleid", api_name:"_kbarticleid_value" } 
		prioritycode: IAttribName = { name:"prioritycode", api_name:"prioritycode" } 
		resolveby: IAttribName = { name:"resolveby", api_name:"resolveby" } 
		ren_firstbillingby: IAttribName = { name:"ren_firstbillingby", api_name:"_ren_firstbillingby_value" } 
		responsiblecontactidname: IAttribName = { name:"responsiblecontactidname", api_name:"responsiblecontactidname" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ticketnumber: IAttribName = { name:"ticketnumber", api_name:"ticketnumber" } 
		ren_totalunitsauthorized: IAttribName = { name:"ren_totalunitsauthorized", api_name:"ren_totalunitsauthorized" } 
		merged: IAttribName = { name:"merged", api_name:"merged" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_validatedbyname: IAttribName = { name:"ren_validatedbyname", api_name:"ren_validatedbyname" } 
		routecase: IAttribName = { name:"routecase", api_name:"routecase" } 
		ren_patient: IAttribName = { name:"ren_patient", api_name:"_ren_patient_value" } 
		ren_secondarypolicyname: IAttribName = { name:"ren_secondarypolicyname", api_name:"ren_secondarypolicyname" } 
		followupby: IAttribName = { name:"followupby", api_name:"followupby" } 
		ren_lastauthon: IAttribName = { name:"ren_lastauthon", api_name:"ren_lastauthon" } 
		masterid: IAttribName = { name:"masterid", api_name:"_masterid_value" } 
		modifiedbyexternalparty: IAttribName = { name:"modifiedbyexternalparty", api_name:"_modifiedbyexternalparty_value" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		ren_countserviceevent: IAttribName = { name:"ren_countserviceevent", api_name:"ren_countserviceevent" } 
		msdyn_iotalertname: IAttribName = { name:"msdyn_iotalertname", api_name:"msdyn_iotalertname" } 
		ren_completedon: IAttribName = { name:"ren_completedon", api_name:"ren_completedon" } 
		existingcase: IAttribName = { name:"existingcase", api_name:"_existingcase_value" } 
		accountid: IAttribName = { name:"accountid", api_name:"_accountid_value" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		entityimage_timestamp: IAttribName = { name:"entityimage_timestamp", api_name:"entityimage_timestamp" } 
		ren_lastorentry: IAttribName = { name:"ren_lastorentry", api_name:"ren_lastorentry" } 
		ren_countserviceevent_state: IAttribName = { name:"ren_countserviceevent_state", api_name:"ren_countserviceevent_state" } 
		slainvokedidname: IAttribName = { name:"slainvokedidname", api_name:"slainvokedidname" } 
		emailaddress: IAttribName = { name:"emailaddress", api_name:"emailaddress" } 
		ren_patientname: IAttribName = { name:"ren_patientname", api_name:"ren_patientname" } 
		servicestage: IAttribName = { name:"servicestage", api_name:"servicestage" } 
		entitlementid: IAttribName = { name:"entitlementid", api_name:"_entitlementid_value" } 
		isdecrementing: IAttribName = { name:"isdecrementing", api_name:"isdecrementing" } 
		parentcaseidname: IAttribName = { name:"parentcaseidname", api_name:"parentcaseidname" } 
		sentimentvalue: IAttribName = { name:"sentimentvalue", api_name:"sentimentvalue" } 
		ren_totalunitsauthorized_date: IAttribName = { name:"ren_totalunitsauthorized_date", api_name:"ren_totalunitsauthorized_date" } 
		primarycontactidname: IAttribName = { name:"primarycontactidname", api_name:"primarycontactidname" } 
		ren_firstauthby: IAttribName = { name:"ren_firstauthby", api_name:"_ren_firstauthby_value" } 
		firstresponsesent: IAttribName = { name:"firstresponsesent", api_name:"firstresponsesent" } 
		ren_primarypolicy: IAttribName = { name:"ren_primarypolicy", api_name:"_ren_primarypolicy_value" } 
		ren_firstvobby: IAttribName = { name:"ren_firstvobby", api_name:"_ren_firstvobby_value" } 
		ren_secondarypolicy: IAttribName = { name:"ren_secondarypolicy", api_name:"_ren_secondarypolicy_value" } 
		contactid: IAttribName = { name:"contactid", api_name:"_contactid_value" } 
		ren_primarypolicyname: IAttribName = { name:"ren_primarypolicyname", api_name:"ren_primarypolicyname" } 
		ren_lastpaymentposted: IAttribName = { name:"ren_lastpaymentposted", api_name:"ren_lastpaymentposted" } 
		customerid: IAttribName = { name:"customerid", api_name:"customerid" } 
		subjectidname: IAttribName = { name:"subjectidname", api_name:"subjectidname" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		createdbyexternalpartyname: IAttribName = { name:"createdbyexternalpartyname", api_name:"createdbyexternalpartyname" } 
		exchangerate: IAttribName = { name:"exchangerate", api_name:"exchangerate" } 
		processid: IAttribName = { name:"processid", api_name:"processid" } 
		title: IAttribName = { name:"title", api_name:"title" } 
		createdbyexternalparty: IAttribName = { name:"createdbyexternalparty", api_name:"_createdbyexternalparty_value" } 
		numberofchildincidents: IAttribName = { name:"numberofchildincidents", api_name:"numberofchildincidents" } 
		resolvebyslastatus: IAttribName = { name:"resolvebyslastatus", api_name:"resolvebyslastatus" } 
		ren_validatedby: IAttribName = { name:"ren_validatedby", api_name:"_ren_validatedby_value" } 
		ren_firstvobon: IAttribName = { name:"ren_firstvobon", api_name:"ren_firstvobon" } 
		incidentid: IAttribName = { name:"incidentid", api_name:"incidentid" } 
		blockedprofile: IAttribName = { name:"blockedprofile", api_name:"blockedprofile" } 
		ren_facilityname: IAttribName = { name:"ren_facilityname", api_name:"ren_facilityname" } 
		contactidname: IAttribName = { name:"contactidname", api_name:"contactidname" } 
		kbarticleidname: IAttribName = { name:"kbarticleidname", api_name:"kbarticleidname" } 
		ren_lastauthby: IAttribName = { name:"ren_lastauthby", api_name:"_ren_lastauthby_value" } 
		ren_totalunitsauthorized_state: IAttribName = { name:"ren_totalunitsauthorized_state", api_name:"ren_totalunitsauthorized_state" } 
		transactioncurrencyidname: IAttribName = { name:"transactioncurrencyidname", api_name:"transactioncurrencyidname" } 
		ren_firstauthon: IAttribName = { name:"ren_firstauthon", api_name:"ren_firstauthon" } 
		billedserviceunits: IAttribName = { name:"billedserviceunits", api_name:"billedserviceunits" } 
		ren_facility: IAttribName = { name:"ren_facility", api_name:"_ren_facility_value" } 
		productid: IAttribName = { name:"productid", api_name:"_productid_value" } 
		customercontacted: IAttribName = { name:"customercontacted", api_name:"customercontacted" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		checkemail: IAttribName = { name:"checkemail", api_name:"checkemail" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		ren_firstvobbyname: IAttribName = { name:"ren_firstvobbyname", api_name:"ren_firstvobbyname" } 
		contractdetailidname: IAttribName = { name:"contractdetailidname", api_name:"contractdetailidname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		msdyn_iotalert: IAttribName = { name:"msdyn_iotalert", api_name:"_msdyn_iotalert_value" } 
		entitlementidname: IAttribName = { name:"entitlementidname", api_name:"entitlementidname" } 
		lastonholdtime: IAttribName = { name:"lastonholdtime", api_name:"lastonholdtime" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		influencescore: IAttribName = { name:"influencescore", api_name:"influencescore" } 
		customeridtype: IAttribName = { name:"customeridtype", api_name:"customeridtype" } 
		socialprofileid: IAttribName = { name:"socialprofileid", api_name:"_socialprofileid_value" } 
		responseby: IAttribName = { name:"responseby", api_name:"responseby" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		description: IAttribName = { name:"description", api_name:"description" } 
		ren_endofcare: IAttribName = { name:"ren_endofcare", api_name:"ren_endofcare" } 
		decremententitlementterm: IAttribName = { name:"decremententitlementterm", api_name:"decremententitlementterm" } 
		productserialnumber: IAttribName = { name:"productserialnumber", api_name:"productserialnumber" } 
		stageid: IAttribName = { name:"stageid", api_name:"stageid" } 
		contractservicelevelcode: IAttribName = { name:"contractservicelevelcode", api_name:"contractservicelevelcode" } 
		ren_totalunitsused_state: IAttribName = { name:"ren_totalunitsused_state", api_name:"ren_totalunitsused_state" } 
		traversedpath: IAttribName = { name:"traversedpath", api_name:"traversedpath" } 
		ren_firstbillingon: IAttribName = { name:"ren_firstbillingon", api_name:"ren_firstbillingon" } 
		modifiedbyexternalpartyname: IAttribName = { name:"modifiedbyexternalpartyname", api_name:"modifiedbyexternalpartyname" } 
		ren_thirdpolice: IAttribName = { name:"ren_thirdpolice", api_name:"_ren_thirdpolice_value" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		contractidname: IAttribName = { name:"contractidname", api_name:"contractidname" } 

	}

  /** @description Instantiates a Incident Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Incident extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "incidents";
		
			public ren_precert?: number;
			public ren_totalunitsused_date?: string;
			public _ownerid_value?: string;
			public incidentstagecode?: string;
			public productidname?: string;
			public _firstresponsebykpiid_value?: string;
			public accountidname?: string;
			public firstresponsebykpiidname?: string;
			public _slaid_value?: string;
			public _contractid_value?: string;
			public severitycode?: string;
			public _parentcaseid_value?: string;
			public _modifiedby_value?: string;
			public isescalated?: string;
			public customeridname?: string;
			public slaname?: string;
			public entityimage_url?: string;
			public _resolvebykpiid_value?: string;
			public actualserviceunits?: number;
			public _subjectid_value?: string;
			public owningbusinessunitname?: string;
			public ren_firstbillingbyname?: string;
			public _transactioncurrencyid_value?: string;
			public ren_totalunitsused?: number;
			public escalatedon?: string;
			public ren_thirdpolicename?: string;
			public _slainvokedid_value?: string;
			public caseorigincode?: string;
			public _primarycontactid_value?: string;
			public socialprofileidname?: string;
			public _responsiblecontactid_value?: string;
			public firstresponseslastatus?: string;
			public customersatisfactioncode?: string;
			public resolvebykpiidname?: string;
			public ren_countserviceevent_date?: string;
			public activitiescomplete?: string;
			public messagetypecode?: string;
			public ren_lastauthbyname?: string;
			public entityimageid?: string;
			public _contractdetailid_value?: string;
			public ren_firstauthbyname?: string;
			public casetypecode?: string;
			public ren_startofcare?: string;
			public followuptaskcreated?: string;
			public masteridname?: string;
			public onholdtime?: number;
			public ren_validated?: string;
			public _kbarticleid_value?: string;
			public prioritycode?: string;
			public resolveby?: string;
			public _ren_firstbillingby_value?: string;
			public responsiblecontactidname?: string;
			public modifiedon?: string;
			public ticketnumber?: string;
			public ren_totalunitsauthorized?: number;
			public merged?: string;
			public owneridtype?: string;
			public ren_validatedbyname?: string;
			public routecase?: string;
			public _ren_patient_value?: string;
			public ren_secondarypolicyname?: string;
			public followupby?: string;
			public ren_lastauthon?: string;
			public _masterid_value?: string;
			public _modifiedbyexternalparty_value?: string;
			public createdbyname?: string;
			public ren_countserviceevent?: number;
			public msdyn_iotalertname?: string;
			public ren_completedon?: string;
			public _existingcase_value?: string;
			public _accountid_value?: string;
			public createdon?: string;
			public entityimage_timestamp?: number;
			public ren_lastorentry?: string;
			public ren_countserviceevent_state?: number;
			public slainvokedidname?: string;
			public emailaddress?: string;
			public ren_patientname?: string;
			public servicestage?: string;
			public _entitlementid_value?: string;
			public isdecrementing?: string;
			public parentcaseidname?: string;
			public sentimentvalue?: number;
			public ren_totalunitsauthorized_date?: string;
			public primarycontactidname?: string;
			public _ren_firstauthby_value?: string;
			public firstresponsesent?: string;
			public _ren_primarypolicy_value?: string;
			public _ren_firstvobby_value?: string;
			public _ren_secondarypolicy_value?: string;
			public _contactid_value?: string;
			public ren_primarypolicyname?: string;
			public ren_lastpaymentposted?: string;
			public customerid?: string;
			public subjectidname?: string;
			public modifiedbyname?: string;
			public _owningteam_value?: string;
			public createdbyexternalpartyname?: string;
			public exchangerate?: number;
			public processid?: string;
			public title?: string;
			public _createdbyexternalparty_value?: string;
			public numberofchildincidents?: number;
			public resolvebyslastatus?: string;
			public _ren_validatedby_value?: string;
			public ren_firstvobon?: string;
			public incidentid?: string;
			public blockedprofile?: string;
			public ren_facilityname?: string;
			public contactidname?: string;
			public kbarticleidname?: string;
			public _ren_lastauthby_value?: string;
			public ren_totalunitsauthorized_state?: number;
			public transactioncurrencyidname?: string;
			public ren_firstauthon?: string;
			public billedserviceunits?: number;
			public _ren_facility_value?: string;
			public _productid_value?: string;
			public customercontacted?: string;
			public _owninguser_value?: string;
			public checkemail?: string;
			public _createdby_value?: string;
			public ren_firstvobbyname?: string;
			public contractdetailidname?: string;
			public owneridname?: string;
			public _msdyn_iotalert_value?: string;
			public entitlementidname?: string;
			public lastonholdtime?: string;
			public statuscode?: string;
			public influencescore?: number;
			public customeridtype?: string;
			public _socialprofileid_value?: string;
			public responseby?: string;
			public statecode?: number;
			public description?: string;
			public ren_endofcare?: string;
			public decremententitlementterm?: string;
			public productserialnumber?: string;
			public stageid?: string;
			public contractservicelevelcode?: string;
			public ren_totalunitsused_state?: number;
			public traversedpath?: string;
			public ren_firstbillingon?: string;
			public modifiedbyexternalpartyname?: string;
			public _ren_thirdpolice_value?: string;
			public _owningbusinessunit_value?: string;
			public contractidname?: string;

		constructor(initData?: IIncident) {
			super("incidents");
			if (initData == undefined) { return; } 
      
			this.id = initData.incidentid;
		
			this.ren_precert = initData.ren_precert;
			this.ren_totalunitsused_date = initData.ren_totalunitsused_date;
			this._ownerid_value = initData._ownerid_value;
			this.incidentstagecode = initData.incidentstagecode;
			this.productidname = initData.productidname;
			this._firstresponsebykpiid_value = initData._firstresponsebykpiid_value;
			this.accountidname = initData.accountidname;
			this.firstresponsebykpiidname = initData.firstresponsebykpiidname;
			this._slaid_value = initData._slaid_value;
			this._contractid_value = initData._contractid_value;
			this.severitycode = initData.severitycode;
			this._parentcaseid_value = initData._parentcaseid_value;
			this._modifiedby_value = initData._modifiedby_value;
			this.isescalated = initData.isescalated;
			this.customeridname = initData.customeridname;
			this.slaname = initData.slaname;
			this.entityimage_url = initData.entityimage_url;
			this._resolvebykpiid_value = initData._resolvebykpiid_value;
			this.actualserviceunits = initData.actualserviceunits;
			this._subjectid_value = initData._subjectid_value;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.ren_firstbillingbyname = initData.ren_firstbillingbyname;
			this._transactioncurrencyid_value = initData._transactioncurrencyid_value;
			this.ren_totalunitsused = initData.ren_totalunitsused;
			this.escalatedon = initData.escalatedon;
			this.ren_thirdpolicename = initData.ren_thirdpolicename;
			this._slainvokedid_value = initData._slainvokedid_value;
			this.caseorigincode = initData.caseorigincode;
			this._primarycontactid_value = initData._primarycontactid_value;
			this.socialprofileidname = initData.socialprofileidname;
			this._responsiblecontactid_value = initData._responsiblecontactid_value;
			this.firstresponseslastatus = initData.firstresponseslastatus;
			this.customersatisfactioncode = initData.customersatisfactioncode;
			this.resolvebykpiidname = initData.resolvebykpiidname;
			this.ren_countserviceevent_date = initData.ren_countserviceevent_date;
			this.activitiescomplete = initData.activitiescomplete;
			this.messagetypecode = initData.messagetypecode;
			this.ren_lastauthbyname = initData.ren_lastauthbyname;
			this.entityimageid = initData.entityimageid;
			this._contractdetailid_value = initData._contractdetailid_value;
			this.ren_firstauthbyname = initData.ren_firstauthbyname;
			this.casetypecode = initData.casetypecode;
			this.ren_startofcare = initData.ren_startofcare;
			this.followuptaskcreated = initData.followuptaskcreated;
			this.masteridname = initData.masteridname;
			this.onholdtime = initData.onholdtime;
			this.ren_validated = initData.ren_validated;
			this._kbarticleid_value = initData._kbarticleid_value;
			this.prioritycode = initData.prioritycode;
			this.resolveby = initData.resolveby;
			this._ren_firstbillingby_value = initData._ren_firstbillingby_value;
			this.responsiblecontactidname = initData.responsiblecontactidname;
			this.modifiedon = initData.modifiedon;
			this.ticketnumber = initData.ticketnumber;
			this.ren_totalunitsauthorized = initData.ren_totalunitsauthorized;
			this.merged = initData.merged;
			this.owneridtype = initData.owneridtype;
			this.ren_validatedbyname = initData.ren_validatedbyname;
			this.routecase = initData.routecase;
			this._ren_patient_value = initData._ren_patient_value;
			this.ren_secondarypolicyname = initData.ren_secondarypolicyname;
			this.followupby = initData.followupby;
			this.ren_lastauthon = initData.ren_lastauthon;
			this._masterid_value = initData._masterid_value;
			this._modifiedbyexternalparty_value = initData._modifiedbyexternalparty_value;
			this.createdbyname = initData.createdbyname;
			this.ren_countserviceevent = initData.ren_countserviceevent;
			this.msdyn_iotalertname = initData.msdyn_iotalertname;
			this.ren_completedon = initData.ren_completedon;
			this._existingcase_value = initData._existingcase_value;
			this._accountid_value = initData._accountid_value;
			this.createdon = initData.createdon;
			this.entityimage_timestamp = initData.entityimage_timestamp;
			this.ren_lastorentry = initData.ren_lastorentry;
			this.ren_countserviceevent_state = initData.ren_countserviceevent_state;
			this.slainvokedidname = initData.slainvokedidname;
			this.emailaddress = initData.emailaddress;
			this.ren_patientname = initData.ren_patientname;
			this.servicestage = initData.servicestage;
			this._entitlementid_value = initData._entitlementid_value;
			this.isdecrementing = initData.isdecrementing;
			this.parentcaseidname = initData.parentcaseidname;
			this.sentimentvalue = initData.sentimentvalue;
			this.ren_totalunitsauthorized_date = initData.ren_totalunitsauthorized_date;
			this.primarycontactidname = initData.primarycontactidname;
			this._ren_firstauthby_value = initData._ren_firstauthby_value;
			this.firstresponsesent = initData.firstresponsesent;
			this._ren_primarypolicy_value = initData._ren_primarypolicy_value;
			this._ren_firstvobby_value = initData._ren_firstvobby_value;
			this._ren_secondarypolicy_value = initData._ren_secondarypolicy_value;
			this._contactid_value = initData._contactid_value;
			this.ren_primarypolicyname = initData.ren_primarypolicyname;
			this.ren_lastpaymentposted = initData.ren_lastpaymentposted;
			this.customerid = initData.customerid;
			this.subjectidname = initData.subjectidname;
			this.modifiedbyname = initData.modifiedbyname;
			this._owningteam_value = initData._owningteam_value;
			this.createdbyexternalpartyname = initData.createdbyexternalpartyname;
			this.exchangerate = initData.exchangerate;
			this.processid = initData.processid;
			this.title = initData.title;
			this._createdbyexternalparty_value = initData._createdbyexternalparty_value;
			this.numberofchildincidents = initData.numberofchildincidents;
			this.resolvebyslastatus = initData.resolvebyslastatus;
			this._ren_validatedby_value = initData._ren_validatedby_value;
			this.ren_firstvobon = initData.ren_firstvobon;
			this.incidentid = initData.incidentid;
			this.blockedprofile = initData.blockedprofile;
			this.ren_facilityname = initData.ren_facilityname;
			this.contactidname = initData.contactidname;
			this.kbarticleidname = initData.kbarticleidname;
			this._ren_lastauthby_value = initData._ren_lastauthby_value;
			this.ren_totalunitsauthorized_state = initData.ren_totalunitsauthorized_state;
			this.transactioncurrencyidname = initData.transactioncurrencyidname;
			this.ren_firstauthon = initData.ren_firstauthon;
			this.billedserviceunits = initData.billedserviceunits;
			this._ren_facility_value = initData._ren_facility_value;
			this._productid_value = initData._productid_value;
			this.customercontacted = initData.customercontacted;
			this._owninguser_value = initData._owninguser_value;
			this.checkemail = initData.checkemail;
			this._createdby_value = initData._createdby_value;
			this.ren_firstvobbyname = initData.ren_firstvobbyname;
			this.contractdetailidname = initData.contractdetailidname;
			this.owneridname = initData.owneridname;
			this._msdyn_iotalert_value = initData._msdyn_iotalert_value;
			this.entitlementidname = initData.entitlementidname;
			this.lastonholdtime = initData.lastonholdtime;
			this.statuscode = initData.statuscode;
			this.influencescore = initData.influencescore;
			this.customeridtype = initData.customeridtype;
			this._socialprofileid_value = initData._socialprofileid_value;
			this.responseby = initData.responseby;
			this.statecode = initData.statecode;
			this.description = initData.description;
			this.ren_endofcare = initData.ren_endofcare;
			this.decremententitlementterm = initData.decremententitlementterm;
			this.productserialnumber = initData.productserialnumber;
			this.stageid = initData.stageid;
			this.contractservicelevelcode = initData.contractservicelevelcode;
			this.ren_totalunitsused_state = initData.ren_totalunitsused_state;
			this.traversedpath = initData.traversedpath;
			this.ren_firstbillingon = initData.ren_firstbillingon;
			this.modifiedbyexternalpartyname = initData.modifiedbyexternalpartyname;
			this._ren_thirdpolice_value = initData._ren_thirdpolice_value;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.contractidname = initData.contractidname;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_authorization
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_authorization */
	export interface IRen_authorizations extends IRetrieveMultipleData<IRen_authorization> {}

	//** @description WebAPI interface for Ren_authorization */
	export interface IRen_authorization {
		[key: string]: string | number | undefined;
		
		_ren_facility_value?: string
		_ownerid_value?: string
		owneridtype?: string
		_createdby_value?: string
		ren_obtainedbyname?: string
		ren_nextreviewdate?: string
		ren_episodeofcarename?: string
		ren_patientname?: string
		statuscode?: string
		_ren_policy_value?: string
		ren_units?: number
		slainvokedidname?: string
		_ren_obtainedby_value?: string
		statecode?: number
		ren_servicename?: string
		createdon?: string
		ren_enddate?: string
		ren_authorizationid?: string
		slaidname?: string
		_ren_episodeofcare_value?: string
		ren_name?: string
		ren_policyname?: string
		onholdtime?: number
		_ren_patient_value?: string
		_slaid_value?: string
		ren_laststatuschange?: string
		_modifiedby_value?: string
		_slainvokedid_value?: string
		_ren_service_value?: string
		createdbyname?: string
		modifiedbyname?: string
		_owningteam_value?: string
		ren_casemanager?: string
		modifiedon?: string
		ren_casemanagername?: string
		ren_startdate?: string
		lastonholdtime?: string
		owningbusinessunitname?: string
		_owningbusinessunit_value?: string
		ren_notes?: string
		ren_facilityname?: string
		owneridname?: string
		ren_casemanageridtype?: string
		ren_dateobtained?: string
		_owninguser_value?: string

  }
  
  //** Collection of Attribute structures for Ren_authorization */
  export class Ren_authorizationAttributes {
		public static LogicalName:string = "ren_authorization"
		
		ren_facility: IAttribName = { name:"ren_facility", api_name:"_ren_facility_value" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		ren_obtainedbyname: IAttribName = { name:"ren_obtainedbyname", api_name:"ren_obtainedbyname" } 
		ren_nextreviewdate: IAttribName = { name:"ren_nextreviewdate", api_name:"ren_nextreviewdate" } 
		ren_episodeofcarename: IAttribName = { name:"ren_episodeofcarename", api_name:"ren_episodeofcarename" } 
		ren_patientname: IAttribName = { name:"ren_patientname", api_name:"ren_patientname" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		ren_policy: IAttribName = { name:"ren_policy", api_name:"_ren_policy_value" } 
		ren_units: IAttribName = { name:"ren_units", api_name:"ren_units" } 
		slainvokedidname: IAttribName = { name:"slainvokedidname", api_name:"slainvokedidname" } 
		ren_obtainedby: IAttribName = { name:"ren_obtainedby", api_name:"_ren_obtainedby_value" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		ren_servicename: IAttribName = { name:"ren_servicename", api_name:"ren_servicename" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		ren_enddate: IAttribName = { name:"ren_enddate", api_name:"ren_enddate" } 
		ren_authorizationid: IAttribName = { name:"ren_authorizationid", api_name:"ren_authorizationid" } 
		slaidname: IAttribName = { name:"slaidname", api_name:"slaidname" } 
		ren_episodeofcare: IAttribName = { name:"ren_episodeofcare", api_name:"_ren_episodeofcare_value" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		ren_policyname: IAttribName = { name:"ren_policyname", api_name:"ren_policyname" } 
		onholdtime: IAttribName = { name:"onholdtime", api_name:"onholdtime" } 
		ren_patient: IAttribName = { name:"ren_patient", api_name:"_ren_patient_value" } 
		slaid: IAttribName = { name:"slaid", api_name:"_slaid_value" } 
		ren_laststatuschange: IAttribName = { name:"ren_laststatuschange", api_name:"ren_laststatuschange" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		slainvokedid: IAttribName = { name:"slainvokedid", api_name:"_slainvokedid_value" } 
		ren_service: IAttribName = { name:"ren_service", api_name:"_ren_service_value" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		ren_casemanager: IAttribName = { name:"ren_casemanager", api_name:"ren_casemanager" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_casemanagername: IAttribName = { name:"ren_casemanagername", api_name:"ren_casemanagername" } 
		ren_startdate: IAttribName = { name:"ren_startdate", api_name:"ren_startdate" } 
		lastonholdtime: IAttribName = { name:"lastonholdtime", api_name:"lastonholdtime" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		ren_notes: IAttribName = { name:"ren_notes", api_name:"ren_notes" } 
		ren_facilityname: IAttribName = { name:"ren_facilityname", api_name:"ren_facilityname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		ren_casemanageridtype: IAttribName = { name:"ren_casemanageridtype", api_name:"ren_casemanageridtype" } 
		ren_dateobtained: IAttribName = { name:"ren_dateobtained", api_name:"ren_dateobtained" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 

	}

  /** @description Instantiates a Ren_authorization Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_authorization extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_authorizations";
		
			public _ren_facility_value?: string;
			public _ownerid_value?: string;
			public owneridtype?: string;
			public _createdby_value?: string;
			public ren_obtainedbyname?: string;
			public ren_nextreviewdate?: string;
			public ren_episodeofcarename?: string;
			public ren_patientname?: string;
			public statuscode?: string;
			public _ren_policy_value?: string;
			public ren_units?: number;
			public slainvokedidname?: string;
			public _ren_obtainedby_value?: string;
			public statecode?: number;
			public ren_servicename?: string;
			public createdon?: string;
			public ren_enddate?: string;
			public ren_authorizationid?: string;
			public slaidname?: string;
			public _ren_episodeofcare_value?: string;
			public ren_name?: string;
			public ren_policyname?: string;
			public onholdtime?: number;
			public _ren_patient_value?: string;
			public _slaid_value?: string;
			public ren_laststatuschange?: string;
			public _modifiedby_value?: string;
			public _slainvokedid_value?: string;
			public _ren_service_value?: string;
			public createdbyname?: string;
			public modifiedbyname?: string;
			public _owningteam_value?: string;
			public ren_casemanager?: string;
			public modifiedon?: string;
			public ren_casemanagername?: string;
			public ren_startdate?: string;
			public lastonholdtime?: string;
			public owningbusinessunitname?: string;
			public _owningbusinessunit_value?: string;
			public ren_notes?: string;
			public ren_facilityname?: string;
			public owneridname?: string;
			public ren_casemanageridtype?: string;
			public ren_dateobtained?: string;
			public _owninguser_value?: string;

		constructor(initData?: IRen_authorization) {
			super("ren_authorizations");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_authorizationid;
		
			this._ren_facility_value = initData._ren_facility_value;
			this._ownerid_value = initData._ownerid_value;
			this.owneridtype = initData.owneridtype;
			this._createdby_value = initData._createdby_value;
			this.ren_obtainedbyname = initData.ren_obtainedbyname;
			this.ren_nextreviewdate = initData.ren_nextreviewdate;
			this.ren_episodeofcarename = initData.ren_episodeofcarename;
			this.ren_patientname = initData.ren_patientname;
			this.statuscode = initData.statuscode;
			this._ren_policy_value = initData._ren_policy_value;
			this.ren_units = initData.ren_units;
			this.slainvokedidname = initData.slainvokedidname;
			this._ren_obtainedby_value = initData._ren_obtainedby_value;
			this.statecode = initData.statecode;
			this.ren_servicename = initData.ren_servicename;
			this.createdon = initData.createdon;
			this.ren_enddate = initData.ren_enddate;
			this.ren_authorizationid = initData.ren_authorizationid;
			this.slaidname = initData.slaidname;
			this._ren_episodeofcare_value = initData._ren_episodeofcare_value;
			this.ren_name = initData.ren_name;
			this.ren_policyname = initData.ren_policyname;
			this.onholdtime = initData.onholdtime;
			this._ren_patient_value = initData._ren_patient_value;
			this._slaid_value = initData._slaid_value;
			this.ren_laststatuschange = initData.ren_laststatuschange;
			this._modifiedby_value = initData._modifiedby_value;
			this._slainvokedid_value = initData._slainvokedid_value;
			this._ren_service_value = initData._ren_service_value;
			this.createdbyname = initData.createdbyname;
			this.modifiedbyname = initData.modifiedbyname;
			this._owningteam_value = initData._owningteam_value;
			this.ren_casemanager = initData.ren_casemanager;
			this.modifiedon = initData.modifiedon;
			this.ren_casemanagername = initData.ren_casemanagername;
			this.ren_startdate = initData.ren_startdate;
			this.lastonholdtime = initData.lastonholdtime;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.ren_notes = initData.ren_notes;
			this.ren_facilityname = initData.ren_facilityname;
			this.owneridname = initData.owneridname;
			this.ren_casemanageridtype = initData.ren_casemanageridtype;
			this.ren_dateobtained = initData.ren_dateobtained;
			this._owninguser_value = initData._owninguser_value;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_diagnosis
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_diagnosis */
	export interface IRen_diagnosiss extends IRetrieveMultipleData<IRen_diagnosis> {}

	//** @description WebAPI interface for Ren_diagnosis */
	export interface IRen_diagnosis {
		[key: string]: string | number | undefined;
		
		_owningteam_value?: string
		statecode?: number
		_owninguser_value?: string
		_modifiedby_value?: string
		_ownerid_value?: string
		owningbusinessunitname?: string
		owneridname?: string
		_createdby_value?: string
		statuscode?: string
		modifiedbyname?: string
		modifiedon?: string
		ren_diagnosisid?: string
		createdbyname?: string
		ren_name?: string
		_owningbusinessunit_value?: string
		createdon?: string
		owneridtype?: string
		ren_description?: string

  }
  
  //** Collection of Attribute structures for Ren_diagnosis */
  export class Ren_diagnosisAttributes {
		public static LogicalName:string = "ren_diagnosis"
		
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_diagnosisid: IAttribName = { name:"ren_diagnosisid", api_name:"ren_diagnosisid" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_description: IAttribName = { name:"ren_description", api_name:"ren_description" } 

	}

  /** @description Instantiates a Ren_diagnosis Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_diagnosis extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_diagnosiss";
		
			public _owningteam_value?: string;
			public statecode?: number;
			public _owninguser_value?: string;
			public _modifiedby_value?: string;
			public _ownerid_value?: string;
			public owningbusinessunitname?: string;
			public owneridname?: string;
			public _createdby_value?: string;
			public statuscode?: string;
			public modifiedbyname?: string;
			public modifiedon?: string;
			public ren_diagnosisid?: string;
			public createdbyname?: string;
			public ren_name?: string;
			public _owningbusinessunit_value?: string;
			public createdon?: string;
			public owneridtype?: string;
			public ren_description?: string;

		constructor(initData?: IRen_diagnosis) {
			super("ren_diagnosiss");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_diagnosisid;
		
			this._owningteam_value = initData._owningteam_value;
			this.statecode = initData.statecode;
			this._owninguser_value = initData._owninguser_value;
			this._modifiedby_value = initData._modifiedby_value;
			this._ownerid_value = initData._ownerid_value;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.owneridname = initData.owneridname;
			this._createdby_value = initData._createdby_value;
			this.statuscode = initData.statuscode;
			this.modifiedbyname = initData.modifiedbyname;
			this.modifiedon = initData.modifiedon;
			this.ren_diagnosisid = initData.ren_diagnosisid;
			this.createdbyname = initData.createdbyname;
			this.ren_name = initData.ren_name;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.createdon = initData.createdon;
			this.owneridtype = initData.owneridtype;
			this.ren_description = initData.ren_description;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_facility
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_facility */
	export interface IRen_facilitys extends IRetrieveMultipleData<IRen_facility> {}

	//** @description WebAPI interface for Ren_facility */
	export interface IRen_facility {
		[key: string]: string | number | undefined;
		
		ren_phone?: string
		ren_stateprovince?: string
		owneridtype?: string
		_createdby_value?: string
		ren_taxid?: string
		_owningteam_value?: string
		ren_npinumber?: string
		ren_fulladdress?: string
		ren_website?: string
		statuscode?: string
		_ren_admissionscontact_value?: string
		emailaddress?: string
		statecode?: number
		createdon?: string
		ren_postalcode?: string
		ren_facilityid?: string
		_ren_administrativecontact_value?: string
		ren_attendingphysicianname?: string
		ren_name?: string
		ren_street2?: string
		ren_street1?: string
		ren_fax?: string
		ren_admissionscontactname?: string
		_ren_attendingphysician_value?: string
		ren_parentfacilityname?: string
		ren_jcaho?: string
		ren_longitude?: string
		ren_country?: string
		_modifiedby_value?: string
		createdbyname?: string
		modifiedbyname?: string
		_ownerid_value?: string
		ren_billingcontactname?: string
		_ren_billingcontact_value?: string
		modifiedon?: string
		ren_administrativecontactname?: string
		owningbusinessunitname?: string
		_owningbusinessunit_value?: string
		ren_city?: string
		owneridname?: string
		ren_street3?: string
		_owninguser_value?: string
		ren_latitude?: string
		_ren_parentfacility_value?: string
		ren_address?: string

  }
  
  //** Collection of Attribute structures for Ren_facility */
  export class Ren_facilityAttributes {
		public static LogicalName:string = "ren_facility"
		
		ren_phone: IAttribName = { name:"ren_phone", api_name:"ren_phone" } 
		ren_stateprovince: IAttribName = { name:"ren_stateprovince", api_name:"ren_stateprovince" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		ren_taxid: IAttribName = { name:"ren_taxid", api_name:"ren_taxid" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		ren_npinumber: IAttribName = { name:"ren_npinumber", api_name:"ren_npinumber" } 
		ren_fulladdress: IAttribName = { name:"ren_fulladdress", api_name:"ren_fulladdress" } 
		ren_website: IAttribName = { name:"ren_website", api_name:"ren_website" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		ren_admissionscontact: IAttribName = { name:"ren_admissionscontact", api_name:"_ren_admissionscontact_value" } 
		emailaddress: IAttribName = { name:"emailaddress", api_name:"emailaddress" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		ren_postalcode: IAttribName = { name:"ren_postalcode", api_name:"ren_postalcode" } 
		ren_facilityid: IAttribName = { name:"ren_facilityid", api_name:"ren_facilityid" } 
		ren_administrativecontact: IAttribName = { name:"ren_administrativecontact", api_name:"_ren_administrativecontact_value" } 
		ren_attendingphysicianname: IAttribName = { name:"ren_attendingphysicianname", api_name:"ren_attendingphysicianname" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		ren_street2: IAttribName = { name:"ren_street2", api_name:"ren_street2" } 
		ren_street1: IAttribName = { name:"ren_street1", api_name:"ren_street1" } 
		ren_fax: IAttribName = { name:"ren_fax", api_name:"ren_fax" } 
		ren_admissionscontactname: IAttribName = { name:"ren_admissionscontactname", api_name:"ren_admissionscontactname" } 
		ren_attendingphysician: IAttribName = { name:"ren_attendingphysician", api_name:"_ren_attendingphysician_value" } 
		ren_parentfacilityname: IAttribName = { name:"ren_parentfacilityname", api_name:"ren_parentfacilityname" } 
		ren_jcaho: IAttribName = { name:"ren_jcaho", api_name:"ren_jcaho" } 
		ren_longitude: IAttribName = { name:"ren_longitude", api_name:"ren_longitude" } 
		ren_country: IAttribName = { name:"ren_country", api_name:"ren_country" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		ren_billingcontactname: IAttribName = { name:"ren_billingcontactname", api_name:"ren_billingcontactname" } 
		ren_billingcontact: IAttribName = { name:"ren_billingcontact", api_name:"_ren_billingcontact_value" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_administrativecontactname: IAttribName = { name:"ren_administrativecontactname", api_name:"ren_administrativecontactname" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		ren_city: IAttribName = { name:"ren_city", api_name:"ren_city" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		ren_street3: IAttribName = { name:"ren_street3", api_name:"ren_street3" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		ren_latitude: IAttribName = { name:"ren_latitude", api_name:"ren_latitude" } 
		ren_parentfacility: IAttribName = { name:"ren_parentfacility", api_name:"_ren_parentfacility_value" } 
		ren_address: IAttribName = { name:"ren_address", api_name:"ren_address" } 

	}

  /** @description Instantiates a Ren_facility Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_facility extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_facilitys";
		
			public ren_phone?: string;
			public ren_stateprovince?: string;
			public owneridtype?: string;
			public _createdby_value?: string;
			public ren_taxid?: string;
			public _owningteam_value?: string;
			public ren_npinumber?: string;
			public ren_fulladdress?: string;
			public ren_website?: string;
			public statuscode?: string;
			public _ren_admissionscontact_value?: string;
			public emailaddress?: string;
			public statecode?: number;
			public createdon?: string;
			public ren_postalcode?: string;
			public ren_facilityid?: string;
			public _ren_administrativecontact_value?: string;
			public ren_attendingphysicianname?: string;
			public ren_name?: string;
			public ren_street2?: string;
			public ren_street1?: string;
			public ren_fax?: string;
			public ren_admissionscontactname?: string;
			public _ren_attendingphysician_value?: string;
			public ren_parentfacilityname?: string;
			public ren_jcaho?: string;
			public ren_longitude?: string;
			public ren_country?: string;
			public _modifiedby_value?: string;
			public createdbyname?: string;
			public modifiedbyname?: string;
			public _ownerid_value?: string;
			public ren_billingcontactname?: string;
			public _ren_billingcontact_value?: string;
			public modifiedon?: string;
			public ren_administrativecontactname?: string;
			public owningbusinessunitname?: string;
			public _owningbusinessunit_value?: string;
			public ren_city?: string;
			public owneridname?: string;
			public ren_street3?: string;
			public _owninguser_value?: string;
			public ren_latitude?: string;
			public _ren_parentfacility_value?: string;
			public ren_address?: string;

		constructor(initData?: IRen_facility) {
			super("ren_facilitys");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_facilityid;
		
			this.ren_phone = initData.ren_phone;
			this.ren_stateprovince = initData.ren_stateprovince;
			this.owneridtype = initData.owneridtype;
			this._createdby_value = initData._createdby_value;
			this.ren_taxid = initData.ren_taxid;
			this._owningteam_value = initData._owningteam_value;
			this.ren_npinumber = initData.ren_npinumber;
			this.ren_fulladdress = initData.ren_fulladdress;
			this.ren_website = initData.ren_website;
			this.statuscode = initData.statuscode;
			this._ren_admissionscontact_value = initData._ren_admissionscontact_value;
			this.emailaddress = initData.emailaddress;
			this.statecode = initData.statecode;
			this.createdon = initData.createdon;
			this.ren_postalcode = initData.ren_postalcode;
			this.ren_facilityid = initData.ren_facilityid;
			this._ren_administrativecontact_value = initData._ren_administrativecontact_value;
			this.ren_attendingphysicianname = initData.ren_attendingphysicianname;
			this.ren_name = initData.ren_name;
			this.ren_street2 = initData.ren_street2;
			this.ren_street1 = initData.ren_street1;
			this.ren_fax = initData.ren_fax;
			this.ren_admissionscontactname = initData.ren_admissionscontactname;
			this._ren_attendingphysician_value = initData._ren_attendingphysician_value;
			this.ren_parentfacilityname = initData.ren_parentfacilityname;
			this.ren_jcaho = initData.ren_jcaho;
			this.ren_longitude = initData.ren_longitude;
			this.ren_country = initData.ren_country;
			this._modifiedby_value = initData._modifiedby_value;
			this.createdbyname = initData.createdbyname;
			this.modifiedbyname = initData.modifiedbyname;
			this._ownerid_value = initData._ownerid_value;
			this.ren_billingcontactname = initData.ren_billingcontactname;
			this._ren_billingcontact_value = initData._ren_billingcontact_value;
			this.modifiedon = initData.modifiedon;
			this.ren_administrativecontactname = initData.ren_administrativecontactname;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.ren_city = initData.ren_city;
			this.owneridname = initData.owneridname;
			this.ren_street3 = initData.ren_street3;
			this._owninguser_value = initData._owninguser_value;
			this.ren_latitude = initData.ren_latitude;
			this._ren_parentfacility_value = initData._ren_parentfacility_value;
			this.ren_address = initData.ren_address;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_insurancepolicy
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_insurancepolicy */
	export interface IRen_insurancepolicys extends IRetrieveMultipleData<IRen_insurancepolicy> {}

	//** @description WebAPI interface for Ren_insurancepolicy */
	export interface IRen_insurancepolicy {
		[key: string]: string | number | undefined;
		
		createdbyname?: string
		_owningteam_value?: string
		modifiedon?: string
		ren_payerphone?: string
		_ownerid_value?: string
		modifiedbyname?: string
		ren_patientname?: string
		owningbusinessunitname?: string
		statuscode?: string
		ren_insurancepolicyname?: string
		owneridname?: string
		ren_groupnumber?: string
		_ren_patient_value?: string
		ren_payername?: string
		createdon?: string
		_createdby_value?: string
		owneridtype?: string
		ren_emailpayer?: string
		ren_relationtopatient?: string
		_ren_subscriber_value?: string
		ren_payerphonenumber?: string
		_owninguser_value?: string
		_owningbusinessunit_value?: string
		ren_subscribername?: string
		_ren_insurancepolicy_value?: string
		ren_name?: string
		statecode?: number
		_modifiedby_value?: string
		_ren_payer_value?: string
		ren_insurancepolicyid?: string

  }
  
  //** Collection of Attribute structures for Ren_insurancepolicy */
  export class Ren_insurancepolicyAttributes {
		public static LogicalName:string = "ren_insurancepolicy"
		
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_payerphone: IAttribName = { name:"ren_payerphone", api_name:"ren_payerphone" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		ren_patientname: IAttribName = { name:"ren_patientname", api_name:"ren_patientname" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		ren_insurancepolicyname: IAttribName = { name:"ren_insurancepolicyname", api_name:"ren_insurancepolicyname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		ren_groupnumber: IAttribName = { name:"ren_groupnumber", api_name:"ren_groupnumber" } 
		ren_patient: IAttribName = { name:"ren_patient", api_name:"_ren_patient_value" } 
		ren_payername: IAttribName = { name:"ren_payername", api_name:"ren_payername" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_emailpayer: IAttribName = { name:"ren_emailpayer", api_name:"ren_emailpayer" } 
		ren_relationtopatient: IAttribName = { name:"ren_relationtopatient", api_name:"ren_relationtopatient" } 
		ren_subscriber: IAttribName = { name:"ren_subscriber", api_name:"_ren_subscriber_value" } 
		ren_payerphonenumber: IAttribName = { name:"ren_payerphonenumber", api_name:"ren_payerphonenumber" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		ren_subscribername: IAttribName = { name:"ren_subscribername", api_name:"ren_subscribername" } 
		ren_insurancepolicy: IAttribName = { name:"ren_insurancepolicy", api_name:"_ren_insurancepolicy_value" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		ren_payer: IAttribName = { name:"ren_payer", api_name:"_ren_payer_value" } 
		ren_insurancepolicyid: IAttribName = { name:"ren_insurancepolicyid", api_name:"ren_insurancepolicyid" } 

	}

  /** @description Instantiates a Ren_insurancepolicy Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_insurancepolicy extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_insurancepolicys";
		
			public createdbyname?: string;
			public _owningteam_value?: string;
			public modifiedon?: string;
			public ren_payerphone?: string;
			public _ownerid_value?: string;
			public modifiedbyname?: string;
			public ren_patientname?: string;
			public owningbusinessunitname?: string;
			public statuscode?: string;
			public ren_insurancepolicyname?: string;
			public owneridname?: string;
			public ren_groupnumber?: string;
			public _ren_patient_value?: string;
			public ren_payername?: string;
			public createdon?: string;
			public _createdby_value?: string;
			public owneridtype?: string;
			public ren_emailpayer?: string;
			public ren_relationtopatient?: string;
			public _ren_subscriber_value?: string;
			public ren_payerphonenumber?: string;
			public _owninguser_value?: string;
			public _owningbusinessunit_value?: string;
			public ren_subscribername?: string;
			public _ren_insurancepolicy_value?: string;
			public ren_name?: string;
			public statecode?: number;
			public _modifiedby_value?: string;
			public _ren_payer_value?: string;
			public ren_insurancepolicyid?: string;

		constructor(initData?: IRen_insurancepolicy) {
			super("ren_insurancepolicys");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_insurancepolicyid;
		
			this.createdbyname = initData.createdbyname;
			this._owningteam_value = initData._owningteam_value;
			this.modifiedon = initData.modifiedon;
			this.ren_payerphone = initData.ren_payerphone;
			this._ownerid_value = initData._ownerid_value;
			this.modifiedbyname = initData.modifiedbyname;
			this.ren_patientname = initData.ren_patientname;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.statuscode = initData.statuscode;
			this.ren_insurancepolicyname = initData.ren_insurancepolicyname;
			this.owneridname = initData.owneridname;
			this.ren_groupnumber = initData.ren_groupnumber;
			this._ren_patient_value = initData._ren_patient_value;
			this.ren_payername = initData.ren_payername;
			this.createdon = initData.createdon;
			this._createdby_value = initData._createdby_value;
			this.owneridtype = initData.owneridtype;
			this.ren_emailpayer = initData.ren_emailpayer;
			this.ren_relationtopatient = initData.ren_relationtopatient;
			this._ren_subscriber_value = initData._ren_subscriber_value;
			this.ren_payerphonenumber = initData.ren_payerphonenumber;
			this._owninguser_value = initData._owninguser_value;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.ren_subscribername = initData.ren_subscribername;
			this._ren_insurancepolicy_value = initData._ren_insurancepolicy_value;
			this.ren_name = initData.ren_name;
			this.statecode = initData.statecode;
			this._modifiedby_value = initData._modifiedby_value;
			this._ren_payer_value = initData._ren_payer_value;
			this.ren_insurancepolicyid = initData.ren_insurancepolicyid;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_networkstatus
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_networkstatus */
	export interface IRen_networkstatuss extends IRetrieveMultipleData<IRen_networkstatus> {}

	//** @description WebAPI interface for Ren_networkstatus */
	export interface IRen_networkstatus {
		[key: string]: string | number | undefined;
		
		_owningteam_value?: string
		statecode?: number
		_owninguser_value?: string
		_ownerid_value?: string
		owningbusinessunitname?: string
		owneridname?: string
		_createdby_value?: string
		_ren_payer_value?: string
		statuscode?: string
		modifiedbyname?: string
		ren_networkstatusid?: string
		modifiedon?: string
		ren_payername?: string
		createdbyname?: string
		ren_name?: string
		_owningbusinessunit_value?: string
		ren_facilityname?: string
		createdon?: string
		owneridtype?: string
		_ren_facility_value?: string
		_modifiedby_value?: string

  }
  
  //** Collection of Attribute structures for Ren_networkstatus */
  export class Ren_networkstatusAttributes {
		public static LogicalName:string = "ren_networkstatus"
		
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		ren_payer: IAttribName = { name:"ren_payer", api_name:"_ren_payer_value" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		ren_networkstatusid: IAttribName = { name:"ren_networkstatusid", api_name:"ren_networkstatusid" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_payername: IAttribName = { name:"ren_payername", api_name:"ren_payername" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		ren_facilityname: IAttribName = { name:"ren_facilityname", api_name:"ren_facilityname" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_facility: IAttribName = { name:"ren_facility", api_name:"_ren_facility_value" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 

	}

  /** @description Instantiates a Ren_networkstatus Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_networkstatus extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_networkstatuss";
		
			public _owningteam_value?: string;
			public statecode?: number;
			public _owninguser_value?: string;
			public _ownerid_value?: string;
			public owningbusinessunitname?: string;
			public owneridname?: string;
			public _createdby_value?: string;
			public _ren_payer_value?: string;
			public statuscode?: string;
			public modifiedbyname?: string;
			public ren_networkstatusid?: string;
			public modifiedon?: string;
			public ren_payername?: string;
			public createdbyname?: string;
			public ren_name?: string;
			public _owningbusinessunit_value?: string;
			public ren_facilityname?: string;
			public createdon?: string;
			public owneridtype?: string;
			public _ren_facility_value?: string;
			public _modifiedby_value?: string;

		constructor(initData?: IRen_networkstatus) {
			super("ren_networkstatuss");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_networkstatusid;
		
			this._owningteam_value = initData._owningteam_value;
			this.statecode = initData.statecode;
			this._owninguser_value = initData._owninguser_value;
			this._ownerid_value = initData._ownerid_value;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.owneridname = initData.owneridname;
			this._createdby_value = initData._createdby_value;
			this._ren_payer_value = initData._ren_payer_value;
			this.statuscode = initData.statuscode;
			this.modifiedbyname = initData.modifiedbyname;
			this.ren_networkstatusid = initData.ren_networkstatusid;
			this.modifiedon = initData.modifiedon;
			this.ren_payername = initData.ren_payername;
			this.createdbyname = initData.createdbyname;
			this.ren_name = initData.ren_name;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.ren_facilityname = initData.ren_facilityname;
			this.createdon = initData.createdon;
			this.owneridtype = initData.owneridtype;
			this._ren_facility_value = initData._ren_facility_value;
			this._modifiedby_value = initData._modifiedby_value;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_physician
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_physician */
	export interface IRen_physicians extends IRetrieveMultipleData<IRen_physician> {}

	//** @description WebAPI interface for Ren_physician */
	export interface IRen_physician {
		[key: string]: string | number | undefined;
		
		ren_country?: string
		ren_email2?: string
		createdbyname?: string
		modifiedon?: string
		ren_firstname?: string
		ren_employee?: string
		modifiedbyname?: string
		ren_city?: string
		ren_street2?: string
		owningbusinessunitname?: string
		statuscode?: string
		owneridname?: string
		emailaddress?: string
		ren_jobtitle?: string
		ren_street1?: string
		_owningteam_value?: string
		createdon?: string
		_createdby_value?: string
		owneridtype?: string
		ren_homephone?: string
		_modifiedby_value?: string
		ren_lastname?: string
		ren_physicianid?: string
		_owninguser_value?: string
		ren_stateprovince?: string
		_owningbusinessunit_value?: string
		ren_postalcode?: string
		ren_middlename?: string
		ren_street3?: string
		ren_mobilephone?: string
		ren_name?: string
		statecode?: number
		ren_salutation?: string
		_ownerid_value?: string

  }
  
  //** Collection of Attribute structures for Ren_physician */
  export class Ren_physicianAttributes {
		public static LogicalName:string = "ren_physician"
		
		ren_country: IAttribName = { name:"ren_country", api_name:"ren_country" } 
		ren_email2: IAttribName = { name:"ren_email2", api_name:"ren_email2" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_firstname: IAttribName = { name:"ren_firstname", api_name:"ren_firstname" } 
		ren_employee: IAttribName = { name:"ren_employee", api_name:"ren_employee" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		ren_city: IAttribName = { name:"ren_city", api_name:"ren_city" } 
		ren_street2: IAttribName = { name:"ren_street2", api_name:"ren_street2" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		emailaddress: IAttribName = { name:"emailaddress", api_name:"emailaddress" } 
		ren_jobtitle: IAttribName = { name:"ren_jobtitle", api_name:"ren_jobtitle" } 
		ren_street1: IAttribName = { name:"ren_street1", api_name:"ren_street1" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_homephone: IAttribName = { name:"ren_homephone", api_name:"ren_homephone" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		ren_lastname: IAttribName = { name:"ren_lastname", api_name:"ren_lastname" } 
		ren_physicianid: IAttribName = { name:"ren_physicianid", api_name:"ren_physicianid" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		ren_stateprovince: IAttribName = { name:"ren_stateprovince", api_name:"ren_stateprovince" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		ren_postalcode: IAttribName = { name:"ren_postalcode", api_name:"ren_postalcode" } 
		ren_middlename: IAttribName = { name:"ren_middlename", api_name:"ren_middlename" } 
		ren_street3: IAttribName = { name:"ren_street3", api_name:"ren_street3" } 
		ren_mobilephone: IAttribName = { name:"ren_mobilephone", api_name:"ren_mobilephone" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		ren_salutation: IAttribName = { name:"ren_salutation", api_name:"ren_salutation" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 

	}

  /** @description Instantiates a Ren_physician Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_physician extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_physicians";
		
			public ren_country?: string;
			public ren_email2?: string;
			public createdbyname?: string;
			public modifiedon?: string;
			public ren_firstname?: string;
			public ren_employee?: string;
			public modifiedbyname?: string;
			public ren_city?: string;
			public ren_street2?: string;
			public owningbusinessunitname?: string;
			public statuscode?: string;
			public owneridname?: string;
			public emailaddress?: string;
			public ren_jobtitle?: string;
			public ren_street1?: string;
			public _owningteam_value?: string;
			public createdon?: string;
			public _createdby_value?: string;
			public owneridtype?: string;
			public ren_homephone?: string;
			public _modifiedby_value?: string;
			public ren_lastname?: string;
			public ren_physicianid?: string;
			public _owninguser_value?: string;
			public ren_stateprovince?: string;
			public _owningbusinessunit_value?: string;
			public ren_postalcode?: string;
			public ren_middlename?: string;
			public ren_street3?: string;
			public ren_mobilephone?: string;
			public ren_name?: string;
			public statecode?: number;
			public ren_salutation?: string;
			public _ownerid_value?: string;

		constructor(initData?: IRen_physician) {
			super("ren_physicians");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_physicianid;
		
			this.ren_country = initData.ren_country;
			this.ren_email2 = initData.ren_email2;
			this.createdbyname = initData.createdbyname;
			this.modifiedon = initData.modifiedon;
			this.ren_firstname = initData.ren_firstname;
			this.ren_employee = initData.ren_employee;
			this.modifiedbyname = initData.modifiedbyname;
			this.ren_city = initData.ren_city;
			this.ren_street2 = initData.ren_street2;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.statuscode = initData.statuscode;
			this.owneridname = initData.owneridname;
			this.emailaddress = initData.emailaddress;
			this.ren_jobtitle = initData.ren_jobtitle;
			this.ren_street1 = initData.ren_street1;
			this._owningteam_value = initData._owningteam_value;
			this.createdon = initData.createdon;
			this._createdby_value = initData._createdby_value;
			this.owneridtype = initData.owneridtype;
			this.ren_homephone = initData.ren_homephone;
			this._modifiedby_value = initData._modifiedby_value;
			this.ren_lastname = initData.ren_lastname;
			this.ren_physicianid = initData.ren_physicianid;
			this._owninguser_value = initData._owninguser_value;
			this.ren_stateprovince = initData.ren_stateprovince;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.ren_postalcode = initData.ren_postalcode;
			this.ren_middlename = initData.ren_middlename;
			this.ren_street3 = initData.ren_street3;
			this.ren_mobilephone = initData.ren_mobilephone;
			this.ren_name = initData.ren_name;
			this.statecode = initData.statecode;
			this.ren_salutation = initData.ren_salutation;
			this._ownerid_value = initData._ownerid_value;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_service
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_service */
	export interface IRen_services extends IRetrieveMultipleData<IRen_service> {}

	//** @description WebAPI interface for Ren_service */
	export interface IRen_service {
		[key: string]: string | number | undefined;
		
		ren_servicecode?: string
		statecode?: number
		_owninguser_value?: string
		_modifiedby_value?: string
		_ownerid_value?: string
		owningbusinessunitname?: string
		owneridname?: string
		_createdby_value?: string
		ren_serviceid?: string
		statuscode?: string
		modifiedbyname?: string
		modifiedon?: string
		createdbyname?: string
		ren_name?: string
		_owningbusinessunit_value?: string
		createdon?: string
		owneridtype?: string
		_owningteam_value?: string

  }
  
  //** Collection of Attribute structures for Ren_service */
  export class Ren_serviceAttributes {
		public static LogicalName:string = "ren_service"
		
		ren_servicecode: IAttribName = { name:"ren_servicecode", api_name:"ren_servicecode" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		ren_serviceid: IAttribName = { name:"ren_serviceid", api_name:"ren_serviceid" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 

	}

  /** @description Instantiates a Ren_service Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_service extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_services";
		
			public ren_servicecode?: string;
			public statecode?: number;
			public _owninguser_value?: string;
			public _modifiedby_value?: string;
			public _ownerid_value?: string;
			public owningbusinessunitname?: string;
			public owneridname?: string;
			public _createdby_value?: string;
			public ren_serviceid?: string;
			public statuscode?: string;
			public modifiedbyname?: string;
			public modifiedon?: string;
			public createdbyname?: string;
			public ren_name?: string;
			public _owningbusinessunit_value?: string;
			public createdon?: string;
			public owneridtype?: string;
			public _owningteam_value?: string;

		constructor(initData?: IRen_service) {
			super("ren_services");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_serviceid;
		
			this.ren_servicecode = initData.ren_servicecode;
			this.statecode = initData.statecode;
			this._owninguser_value = initData._owninguser_value;
			this._modifiedby_value = initData._modifiedby_value;
			this._ownerid_value = initData._ownerid_value;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.owneridname = initData.owneridname;
			this._createdby_value = initData._createdby_value;
			this.ren_serviceid = initData.ren_serviceid;
			this.statuscode = initData.statuscode;
			this.modifiedbyname = initData.modifiedbyname;
			this.modifiedon = initData.modifiedon;
			this.createdbyname = initData.createdbyname;
			this.ren_name = initData.ren_name;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this.createdon = initData.createdon;
			this.owneridtype = initData.owneridtype;
			this._owningteam_value = initData._owningteam_value;

		}
	}

	//** @description AUTO GENERATED CLASSES FOR Ren_serviceevent
	// ------------------------------------------------------------------------------------------
	//** @description WebAPI collection interface for Ren_serviceevent */
	export interface IRen_serviceevents extends IRetrieveMultipleData<IRen_serviceevent> {}

	//** @description WebAPI interface for Ren_serviceevent */
	export interface IRen_serviceevent {
		[key: string]: string | number | undefined;
		
		ren_claimname?: string
		createdbyname?: string
		modifiedon?: string
		ren_authorizationname?: string
		_ownerid_value?: string
		modifiedbyname?: string
		_ren_episodeofcare_value?: string
		ren_units?: number
		owningbusinessunitname?: string
		statuscode?: string
		owneridname?: string
		_ren_diagnosis_value?: string
		ren_servicedate?: string
		ren_servicename?: string
		statecode?: number
		createdon?: string
		_createdby_value?: string
		owneridtype?: string
		ren_diagnosisname?: string
		_ren_healthservice_value?: string
		ren_revcode?: string
		_modifiedby_value?: string
		_ren_authorization_value?: string
		_owninguser_value?: string
		_owningbusinessunit_value?: string
		_owningteam_value?: string
		_ren_service_value?: string
		ren_healthservicename?: string
		ren_name?: string
		ren_hcpcscode?: string
		_ren_claim_value?: string
		ren_episodeofcarename?: string
		ren_serviceeventid?: string

  }
  
  //** Collection of Attribute structures for Ren_serviceevent */
  export class Ren_serviceeventAttributes {
		public static LogicalName:string = "ren_serviceevent"
		
		ren_claimname: IAttribName = { name:"ren_claimname", api_name:"ren_claimname" } 
		createdbyname: IAttribName = { name:"createdbyname", api_name:"createdbyname" } 
		modifiedon: IAttribName = { name:"modifiedon", api_name:"modifiedon" } 
		ren_authorizationname: IAttribName = { name:"ren_authorizationname", api_name:"ren_authorizationname" } 
		ownerid: IAttribName = { name:"ownerid", api_name:"_ownerid_value" } 
		modifiedbyname: IAttribName = { name:"modifiedbyname", api_name:"modifiedbyname" } 
		ren_episodeofcare: IAttribName = { name:"ren_episodeofcare", api_name:"_ren_episodeofcare_value" } 
		ren_units: IAttribName = { name:"ren_units", api_name:"ren_units" } 
		owningbusinessunitname: IAttribName = { name:"owningbusinessunitname", api_name:"owningbusinessunitname" } 
		statuscode: IAttribName = { name:"statuscode", api_name:"statuscode" } 
		owneridname: IAttribName = { name:"owneridname", api_name:"owneridname" } 
		ren_diagnosis: IAttribName = { name:"ren_diagnosis", api_name:"_ren_diagnosis_value" } 
		ren_servicedate: IAttribName = { name:"ren_servicedate", api_name:"ren_servicedate" } 
		ren_servicename: IAttribName = { name:"ren_servicename", api_name:"ren_servicename" } 
		statecode: IAttribName = { name:"statecode", api_name:"statecode" } 
		createdon: IAttribName = { name:"createdon", api_name:"createdon" } 
		createdby: IAttribName = { name:"createdby", api_name:"_createdby_value" } 
		owneridtype: IAttribName = { name:"owneridtype", api_name:"owneridtype" } 
		ren_diagnosisname: IAttribName = { name:"ren_diagnosisname", api_name:"ren_diagnosisname" } 
		ren_healthservice: IAttribName = { name:"ren_healthservice", api_name:"_ren_healthservice_value" } 
		ren_revcode: IAttribName = { name:"ren_revcode", api_name:"ren_revcode" } 
		modifiedby: IAttribName = { name:"modifiedby", api_name:"_modifiedby_value" } 
		ren_authorization: IAttribName = { name:"ren_authorization", api_name:"_ren_authorization_value" } 
		owninguser: IAttribName = { name:"owninguser", api_name:"_owninguser_value" } 
		owningbusinessunit: IAttribName = { name:"owningbusinessunit", api_name:"_owningbusinessunit_value" } 
		owningteam: IAttribName = { name:"owningteam", api_name:"_owningteam_value" } 
		ren_service: IAttribName = { name:"ren_service", api_name:"_ren_service_value" } 
		ren_healthservicename: IAttribName = { name:"ren_healthservicename", api_name:"ren_healthservicename" } 
		ren_name: IAttribName = { name:"ren_name", api_name:"ren_name" } 
		ren_hcpcscode: IAttribName = { name:"ren_hcpcscode", api_name:"ren_hcpcscode" } 
		ren_claim: IAttribName = { name:"ren_claim", api_name:"_ren_claim_value" } 
		ren_episodeofcarename: IAttribName = { name:"ren_episodeofcarename", api_name:"ren_episodeofcarename" } 
		ren_serviceeventid: IAttribName = { name:"ren_serviceeventid", api_name:"ren_serviceeventid" } 

	}

  /** @description Instantiates a Ren_serviceevent Entity to be used for CRUD based operations
  * @param {object} initData An optional parameter for a create and update entities */
    export class Ren_serviceevent extends Entity {
			[key: string]: string | number | undefined;
			public route: string = "ren_serviceevents";
		
			public ren_claimname?: string;
			public createdbyname?: string;
			public modifiedon?: string;
			public ren_authorizationname?: string;
			public _ownerid_value?: string;
			public modifiedbyname?: string;
			public _ren_episodeofcare_value?: string;
			public ren_units?: number;
			public owningbusinessunitname?: string;
			public statuscode?: string;
			public owneridname?: string;
			public _ren_diagnosis_value?: string;
			public ren_servicedate?: string;
			public ren_servicename?: string;
			public statecode?: number;
			public createdon?: string;
			public _createdby_value?: string;
			public owneridtype?: string;
			public ren_diagnosisname?: string;
			public _ren_healthservice_value?: string;
			public ren_revcode?: string;
			public _modifiedby_value?: string;
			public _ren_authorization_value?: string;
			public _owninguser_value?: string;
			public _owningbusinessunit_value?: string;
			public _owningteam_value?: string;
			public _ren_service_value?: string;
			public ren_healthservicename?: string;
			public ren_name?: string;
			public ren_hcpcscode?: string;
			public _ren_claim_value?: string;
			public ren_episodeofcarename?: string;
			public ren_serviceeventid?: string;

		constructor(initData?: IRen_serviceevent) {
			super("ren_serviceevents");
			if (initData == undefined) { return; } 
      
			this.id = initData.ren_serviceeventid;
		
			this.ren_claimname = initData.ren_claimname;
			this.createdbyname = initData.createdbyname;
			this.modifiedon = initData.modifiedon;
			this.ren_authorizationname = initData.ren_authorizationname;
			this._ownerid_value = initData._ownerid_value;
			this.modifiedbyname = initData.modifiedbyname;
			this._ren_episodeofcare_value = initData._ren_episodeofcare_value;
			this.ren_units = initData.ren_units;
			this.owningbusinessunitname = initData.owningbusinessunitname;
			this.statuscode = initData.statuscode;
			this.owneridname = initData.owneridname;
			this._ren_diagnosis_value = initData._ren_diagnosis_value;
			this.ren_servicedate = initData.ren_servicedate;
			this.ren_servicename = initData.ren_servicename;
			this.statecode = initData.statecode;
			this.createdon = initData.createdon;
			this._createdby_value = initData._createdby_value;
			this.owneridtype = initData.owneridtype;
			this.ren_diagnosisname = initData.ren_diagnosisname;
			this._ren_healthservice_value = initData._ren_healthservice_value;
			this.ren_revcode = initData.ren_revcode;
			this._modifiedby_value = initData._modifiedby_value;
			this._ren_authorization_value = initData._ren_authorization_value;
			this._owninguser_value = initData._owninguser_value;
			this._owningbusinessunit_value = initData._owningbusinessunit_value;
			this._owningteam_value = initData._owningteam_value;
			this._ren_service_value = initData._ren_service_value;
			this.ren_healthservicename = initData.ren_healthservicename;
			this.ren_name = initData.ren_name;
			this.ren_hcpcscode = initData.ren_hcpcscode;
			this._ren_claim_value = initData._ren_claim_value;
			this.ren_episodeofcarename = initData.ren_episodeofcarename;
			this.ren_serviceeventid = initData.ren_serviceeventid;

		}
	}

}
