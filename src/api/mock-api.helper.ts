export function sample(arr: Array<any>): any {
	return arr[Math.floor(Math.random() * arr.length)];
}