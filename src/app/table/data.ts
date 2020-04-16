let allCols: Array<String> = ['id', 'trans', 'action', 'seqno', 'network', 'orgId',
	'userid', 'screenName', 'created', 'duration', 'ordamt', 'coreAmt', 'linecnt',
	'errFlg', 'sellDirect', 'service'
]
let allAvailableCols: Array<string> = ['action', 'created', 'destcalled', 'destname',
	'duration', 'errFlg', 'id', 'laborFlg', 'linecnt', 'natAcct', 'netamt', 'network',
	'oeFlg', 'ordamt', 'orgCity', 'orgCountry', 'orgId', 'orgName', 'coreAmt', 'orgRegion', 'orgTreePath',
	'orgtype', 'orgZip', 'partnerName', 'partnerSellerId', 'partnerSellerIdCod', 'scat',
	'scatName', 'screenName', 'sellDirect', 'seqno', 'server', 'service', 'sindex',
	'sindexName', 'stype', 'trans', 'url', 'userid', 'wdName']

let defaultRowData = [{ "name": "action", "width": 51.520476287400776, "visible": true }, { "name": "created", "width": 84, "visible": true }, { "name": "errFlg", "width": 55.15577040504783, "visible": true }, { "name": "duration", "width": 69.15577040504783, "visible": true }, { "name": "id", "width": 74, "visible": true }, { "name": "linecnt", "width": 60.2000629128657, "visible": true }, { "name": "network", "width": 65.20006291286569, "visible": true }, { "name": "ordamt", "width": 62.2000629128657, "visible": true }, { "name": "orgId", "width": 65.20006291286569, "visible": true }, { "name": "coreAmt", "width": 71.20006291286569, "visible": true }, { "name": "screenName", "width": 109.20006291286569, "visible": true }, { "name": "sellDirect", "width": 67.20006291286569, "visible": true }, { "name": "seqno", "width": 73.19712173639516, "visible": true }, { "name": "service", "width": 78.19712173639515, "visible": true }, { "name": "trans", "width": 101, "visible": true }, { "name": "userid", "width": 110.39718464926068, "visible": true }, { "name": "destcalled", "width": 150, "visible": false }, { "name": "destname", "width": 150, "visible": false }, { "name": "laborFlg", "width": 150, "visible": false }, { "name": "natAcct", "width": 150, "visible": false }, { "name": "netamt", "width": 150, "visible": false }, { "name": "oeFlg", "width": 150, "visible": false }, { "name": "orgCity", "width": 150, "visible": false }, { "name": "orgCountry", "width": 150, "visible": false }, { "name": "orgName", "width": 150, "visible": false }, { "name": "orgRegion", "width": 150, "visible": false }, { "name": "orgTreePath", "width": 150, "visible": false }, { "name": "orgtype", "width": 150, "visible": false }, { "name": "orgZip", "width": 150, "visible": false }, { "name": "partnerName", "width": 150, "visible": false }, { "name": "partnerSellerId", "width": 150, "visible": false }, { "name": "partnerSellerIdCol", "width": 150, "visible": false }, { "name": "scat", "width": 150, "visible": false }, { "name": "scatName", "width": 150, "visible": false }, { "name": "server", "width": 150, "visible": false }, { "name": "sindex", "width": 150, "visible": false }, { "name": "sindexName", "width": 150, "visible": false }, { "name": "stype", "width": 150, "visible": false }, { "name": "url", "width": 150, "visible": false }, { "name": "wdName", "width": 150, "visible": false }]

let today = new Date()
let baseObject: BaseObjectInterface = {
	params: {
		searchKey: '',
		count: 20,
		env: 'PROD',
		queryType: '',
		start: 0,
		action: '',
		dateFrom: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
		dateTo: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
		ts: new Date().getTime()
	}
}
let envData = [
	{ value: 'BETA', label: 'STAGING' },
	{ value: 'PROD', label: 'PROD' },
	{ value: 'DEV', label: 'DEV' },
]
let queryTypeData = [
	{value: '',label: ''},
	{ value: 'screenName', label: 'Screen Name' },
	{ value: 'orgId', label: 'Org ID' },
	{ value: 'userid', label: 'User ID' },
	{ value: 'id', label: 'ID' },
	{ value: 'orgName', label: 'Org Name' },
	{ value: 'wdName', label: 'Wd Name' },
]

let wdNameData = [
	{id:0, value: 'PartsWarehouseInc', label: 'Parts Warehouse, Inc' },
	{id:1, value: 'VastAutoDistribution', label: 'Vast-Auto Distribution' },
	{id:2, value: 'PartsCentralInc.', label: 'Parts Central Inc.' },
	{id:3, value: 'AutoPartsHeadQuartersInc', label: 'AutoParts HeadQuarters, Inc' },
	{id:4, value: 'HahnAutomotiveWarehouse', label: 'Hahn Automotive Warehouse' },
	{id:5, value: 'AllianceHeadquarters', label: 'Alliance Headquarters' },
]
let actionData = [
	{ value: 'INQ', label: 'INQ' },
	{ value: 'CHK', label: 'CHK' },
	{ value: 'ORD', label: 'ORD' },
	{ value: 'LBR', label: 'LBR' },
	{ value: 'MCL', label: 'MCL' },
	{ value: 'PCR', label: 'PCR' },
	{ value: 'TST', label: 'TST' },
	{ value: 'RET', label: 'RET' },
	{ value: 'RFQ', label: 'RFQ' },
]

export {
	allCols,
	allAvailableCols,
	baseObject,
	envData,
	queryTypeData,
	actionData,
	defaultRowData,
	wdNameData
}

export interface BaseObjectInterface {
	params: ParamsInterface
}

interface ParamsInterface {
	searchKey: string
	count: number
	env: string
	queryType: string
	start: number
	action: string
	dateFrom: string
	dateTo: string
	ts: number,

}

export interface RequestDateInterface {
	year: number
	month: number,
	day: number
}
