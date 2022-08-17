/** Helper method for formatting js date
	@param {string} dateVal date to be formatted, in ISO date format
**/
export function formatDate(dateVal: string):string {

	if (isNullUndefinedEmpty(dateVal)) {
		return "null";
	}

	var d = new Date(dateVal);
	var pad = padLeadingZeros;
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
export function getFormattedValue(entity:any, attribute:string): string | undefined {
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
export function padLeadingZeros (num:number, precision:number):string {
	var s = "000000000" + num;
	return s.substr(s.length - precision);
}

/**
 * check to see if a value is null or empty
 */
export function isNullUndefinedEmpty(value: any): boolean {
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
export function cleanGuid(guid: string, removeDashes?: boolean): string {
	guid = guid.replace("{", "").replace("}", "");

	if (removeDashes === true) {
		guid = guid.replace(/-/g, "");
	}
	return guid;
}