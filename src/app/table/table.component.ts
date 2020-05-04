import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import {
	FormGroup,
	FormBuilder,
} from '@angular/forms'
import { HttpClient, HttpParams } from '@angular/common/http'
//import urls from '../routes/urls'
import { signOut, merge, signOutFromCognito } from '../helpers'
import { debounce } from 'lodash'
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap'
import { allCols,wdNameData, allAvailableCols, baseObject, envData, queryTypeData, actionData, defaultRowData, BaseObjectInterface, RequestDateInterface } from './data'
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { TreeNode } from 'primeng/api';
import { cloneDeep } from "lodash";
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from "../login/login.component";
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';
import * as xmlQueryToolAction from '../store/actions/xmlQueryTool.actions';

declare var _:any
const Swal = require('sweetalert2')

// import Swal from 'sweetalert2'

// CommonJS

@Component({
	selector: 'aes-xml-query',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	@ViewChild('login') login: LoginComponent;


	/**
	 * data / objects
	 */
	exportStatus;
	interval;
	text = '';
	value: number = 0;
	public Tree: TreeNode[];
	Request_result = [];
	Response_result = [];
	optradio=1;
	valueSearch =''
	searchValue: any;
	searchOnchagneValues=''
	eachRowData: any;
	modalWidth:any="modalWidth"
	public partNumberActive = 'active';
	public lineCodeActive = '';
	public searchKey = "partNumber";
	form: FormGroup
	rows: Array<Object> = []
	@ViewChild('xmlTable') xmlTableRef: DatatableComponent
	@ViewChild('pageContainer') pageContainerRef: ElementRef
	@ViewChild('sticky') stickyRef: ElementRef
	dataTabelBodySelector: string = '.xml-query-tool .datatable-body'
	loadingIndicator: Boolean = false
	ReloadingIndicator: Boolean = false
	displayExportButton: Boolean = true
	autoFillQueryData: Array<String>
	visibleColumns
	tableMessages: any = {
		emptyMessage: `<div class="text-center">No Data Available</div>`
	}
	place='PROD'
	selectedColumnData = {}
	signOut = signOut
	rowCount = 0
	wdNamesService=[]
	checkData=[]
	envData = envData
	queryTypeData = queryTypeData
	wdNamesData = []
	actionData = actionData
	newArray=[]
	selectedAction = ''
	timeFormat: String = 'utcTime'
	timeForm
	ishide: boolean = false;
	ishide2: boolean = false;
	today = new Date()
	startDate: RequestDateInterface = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }
	endDate: RequestDateInterface = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }
	userName: String = ''
	debounced = debounce(() => {
		console.log('get new data')
		this.getMoreData()
	}, 300)
	selectedColumnID = 0
	reqResp = {}
	requestJSON = []
	responseJSON = []
	header = {}
	allAvailableCols = allAvailableCols
	queryObj: BaseObjectInterface = cloneDeep(baseObject)
	selectedValue='';
	global = global || window;
	tableData
	reqResponse: string;
	reqXml: string;
	exportUrl: string;
	wdNames: string;
	exportstatus: string;
	disableButton:boolean =  false;
	isEnvchahnged: boolean = false;
	baseurl: any;
	wdNameSelected: boolean = true;
	modelref: any
	/**
	 * Methods
	 */
	constructor(
		private http: HttpClient,
		private modalService: NgbModal,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private ngbDatepickerConfig:NgbDatepickerConfig,
		public store: Store<fromStore.State>
//		private loginComponent: LoginComponent
	) {

		ngbDatepickerConfig.firstDayOfWeek = 7;
	 }

	searchKeyEvent(evt: KeyboardEvent) {
		if (evt.keyCode == 13) {
			this.reSearch()
		}
	}
	closeDialogue(){
		this.wdNameSelected = true
		this.modelref.close();
		console.log("close clicked")
	}
	ngOnInit() {
		this.tableMessages.emptyMessage = `<div class="text-center">Loading...</div>`
		this.updateUrls("PROD");
		this.login.getEnvProps("PROD");
		let userName = localStorage.getItem('userName');
		let password = localStorage.getItem('password');
		console.log("username is",userName);
		//signOutFromCognito();
		this.login.cognitoAwsAmplify("https://ms.myplace4parts.com/prod/xmlQueryTool",userName,password,this.login.regionId,this.login.IdentityPoolId,this.login.UserPoolId,this.login.ClientId,true,this.queryObj);

		this.registerScrollEvent()
		this.getSelectedColumns()
		let data = localStorage.getItem('autoFillQueryData')
		this.autoFillQueryData = JSON.parse(data)
		this.userName = localStorage.getItem('userName')
		let timeFormat = localStorage.getItem('timeFormat')
		if (timeFormat) {
			this.timeFormat = timeFormat
		}


		this.getFormBuilder()
		this.getTimeFormBuilder()
		//this.getData()
		this.closeFilters()
	//	this.getWdnames()


	}

	tablesData(res){
			this.rows = [...this.rows, ...res['data']]
					this.rowCount = res['numResults']
					this.loadingIndicator = false
					this.tableMessages.emptyMessage = `<div class="text-center">No Data Avaliable</div>`
					if (res['data'].length) {
						this.checkIfScrollable()
					}
	}

disableButtons(event){
	this.disableButton = event
}

	openWdModal(wdModal) {
			this.checkData=[];
			this.newArray=[]
			this.wdNamesData=[]
			try{
				this.http.get(this.wdNames).subscribe(res => {
					if(res && res['statusCode']=='200'){
						this.wdNamesService = res['result']
					  this.wdNamesData = this.wdNamesService
			  		}else{
			  }
		  });
		  }catch(err){
		   console.log(err,"failed");
		  }
		  this.modelref = this.modalService.open(wdModal, { ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'detailed-popup help-page wdNamesModal' })
				}




		// let dataStatus= await this.http.get(urls.wdNames , { data : name }).toPromise();

		// console.log(dataStatus, "dataStatus >>>>>>>>>>>");


    //  let name = "dev"
	// 	this.http.get(urls.wdNames,{data:name})
	// 	 .subscribe(data =>{
	// 		 console.log(data ,"data >>>>>");

	// 		//   if(data && data['statusCode']=='200'){
	// 		// 	 console.log('sucess');

	// 		//  }
	// 	 })




	// if ((this.userName && this.userName.length) && (this.password && this.password.length)) {

	// 	this.http.post(urls.loginUrl, {userName:this.userName,password:this.password})
	// 	  .subscribe(data => {
	// 		if (data && data['statusCode']=='200') {
	// 		  Cookies.set('xmlQueryToken', data['jwtToken']);
	// 		  this.router.navigate(['']);

	// 		  localStorage.setItem('userName', this.userName)
	// 		}
	// 		else{
	// 		  console.log(data['message'],"else----errrrrrrrrr")
	// 		  this.errorMsg = data['message'];
	// 		  this.isInvalid = true
	// 		}
	// 	  }, err => {
	// 		console.log(err,"errrrrrrrrr")
	// 		this.errorMsg = 'Failed to connect to a  service'
	// 		this.isInvalid = true
	// 	  })
	//   } else {
	// 	this.errorMsg = 'Please Enter Username and Password'
	// 	this.isInvalid = true
	//   }



	clearFilters() {
	//	this.rows = []
	//	this.rowCount = 0
		this.selectedAction = '';
		this.searchKey = ''
		this.selectedValue = ''
		this.startDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }
		this.endDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }
		this.queryObj = cloneDeep(baseObject)
	}


	getSelectedColumns() {
		let items: any = localStorage.getItem('selectedColumns')
		if (items) {
			items = JSON.parse(items)
		} else {
			items = defaultRowData
			localStorage.setItem('selectedColumns', JSON.stringify(defaultRowData))
		}
		if (items && items.length) {
			this.visibleColumns = items
		} else {
			let newCols = allAvailableCols.map(item => {
				return {
					name: item,
					width: 150,
					visible: allCols.indexOf(item) !== -1 ? true : false
				}
			})
			this.visibleColumns = newCols
			this.setSelectedColumns(newCols)
		}
	}

	setSelectedColumns(items) {
		items = JSON.stringify(items)
		localStorage.setItem('selectedColumns', items)
	}

	registerScrollEvent() {
		let element: HTMLElement = document.querySelector(this.dataTabelBodySelector)
		element.onscroll = () => {
			let scrollBottom = element.scrollTop + element.clientHeight
			if (((element.scrollHeight / 3) * 2) <= scrollBottom) {
				this.debounced()
			}
		}
	}

	checkIfScrollable() {
		let element: HTMLElement = document.querySelector(this.dataTabelBodySelector)
		if (element.scrollHeight === element.clientHeight && this.rowCount) {
			this.debounced()
		}
	}

	toggleFilters1() {
		if(this.ishide == false){
			this.pageContainerRef.nativeElement.classList.add("hide-search")
			this.stickyRef.nativeElement.classList.remove("sticked")
		this.stickyRef.nativeElement.classList.remove("text-primary")
		}else{
			this.pageContainerRef.nativeElement.classList.remove("hide-search")
			this.stickyRef.nativeElement.classList.add("sticked")
			this.stickyRef.nativeElement.classList.add("text-primary")
		}
		this.ishide = false
		// this.ishide2 = false
}
	toggleFilters2(){
		this.pageContainerRef.nativeElement.classList.remove("hide-search")
		this.ishide = true
		// this.ishide2 = true

	}
	toggleFilters3(){
		if(this.ishide){
			this.pageContainerRef.nativeElement.classList.remove("hide-search")
		}
	}
	toggleFilters4(){
		if(this.ishide){
			this.pageContainerRef.nativeElement.classList.add("hide-search")
		}
	}

	closeFilters() {
		console.log("close filter")
		this.stickyRef.nativeElement.classList.add("sticked")
		this.stickyRef.nativeElement.classList.add("text-primary")

		//this.pageContainerRef.nativeElement.classList.add("hide-search")
	}

	getMoreData() {
		this.queryObj.params.start += 1
		this.getData()
	}

	timeOutError(message) {
			this.toastr.error(message,'', {
			timeOut: 4000
		  });
	}
	updateUrls(env){
			console.log(env,"env isssssssss")
			 if ( env == "STAGING") {
				this.baseurl = "https://ms.myplace4parts.com/staging/xmlQueryTool"
			  }else if (env == "PROD") {
				this.baseurl = "https://ms.myplace4parts.com/prod/xmlQueryTool"
			  }else if(env == "DEV") {
				this.baseurl = "https://gsjhkvo2kf.execute-api.us-east-1.amazonaws.com/dev/xmlQueryTool"
			  }
		this.tableData = this.baseurl + '/advSearch',
		this.reqResponse = this.baseurl + '/xmlReqResp',
		this.reqXml = this.baseurl + '/xmlreqresfromEs',
		this.exportUrl = this.baseurl + '/exportData',
		this.exportstatus = this.baseurl + '/getStatus',
		this.wdNames = this.baseurl + '/getWdNames'
		console.log("baseurl is::::",this.baseurl,this.reqXml);
	}
	getData() {
		
		this.loadingIndicator = false
		this.tableMessages.emptyMessage = `<div class="text-center">Loading...</div>`
		let newParams = {
			dateFrom: this.startDate ? `${this.startDate.month}/${this.startDate.day}/${this.startDate.year}` : '',
			dateTo: this.endDate ? `${this.endDate.month}/${this.endDate.day}/${this.endDate.year}` : '',
		}

		this.queryObj.params = { ...this.queryObj.params, ...newParams }
		// @ts-ignore

		this.http.get(this.tableData, this.queryObj).subscribe(res => {
			this.loadingIndicator = false

			if (!res || !res['data']) {
				this.disableButton = false;
				alert('Something wrong')
				return
			}
			this.store.dispatch(new xmlQueryToolAction.StoreTableData(res));
			this.tablesData(res);

		}, err => {
			this.rows = []
			this.disableButton = false;
			this.loadingIndicator = false
			this.tableMessages.emptyMessage = '<div class="text-center">No Data Avaliable</div>'
			if (err) {
				if (this.queryObj.params.start > 0) {
					this.queryObj.params.start -= 1
				}
			}
			err.name == 'TimeoutError' ? this.timeOutError('Request TimeOut') : false;
		})
		this.addSearchKey()
		this.disableButton = false;
	}

	private addSearchKey() {
		let searchKey = this.queryObj.params.searchKey
		if (searchKey && searchKey.length) {
			let keys = localStorage.getItem('autoFillQueryData')
			if (keys) {
				keys = JSON.parse(keys)
			}
			let newKeys: Array<String> = [...new Set([searchKey, ...(keys || [])])]
			localStorage.setItem('autoFillQueryData', JSON.stringify(newKeys))
			this.autoFillQueryData = newKeys
		}
	}

	onReorder() {
		setTimeout(() => {
			let columns = this.xmlTableRef.headerComponent.columns
			columns = columns.map(item => {
				if (item.name) {
					return {
						'name': item.name,
						'width': item.width,
						'visible': true
					}
				} else {
					return null
				}
			}).filter(item => item)
			let finalArr = merge(columns, this.visibleColumns)
			this.setSelectedColumns(finalArr)
		})
	}

	 reSearch() {
		let fromDate = new Date(this.startDate.year, this.startDate.month-1, this.startDate.day)
		let toDate = new Date(this.endDate.year, this.endDate.month-1, this.endDate.day)
		console.log(fromDate,"formdate is",toDate,"toDate is")
		if(fromDate>toDate){
			console.log("fromdate greater than todate")
			Swal.fire({ text: "From date should be less than to date", type: 'warning', showCloseButton: true, showConfirmButton: false });
		}else{
			this.queryObj.params.start = 0
			this.rows = []
			this.rowCount = 0
			this.disableButton = true;
			this.tableMessages.emptyMessage = `<div class="text-center">Loading...</div>`
			if(this.isEnvchahnged){
			signOutFromCognito();
			this.login.getEnvProps(this.place)
			console.log(this.place,"envvvvvvvvvv")
			this.updateUrls(this.place);
			let userName = localStorage.getItem('userName');
			let password = localStorage.getItem('password');
			console.log("username is",userName);
			//signOutFromCognito();
			this.login.cognitoAwsAmplify(this.baseurl,userName,password,this.login.regionId,this.login.IdentityPoolId,this.login.UserPoolId,this.login.ClientId,true,this.queryObj);
			//this.getData()
			}else{
				this.getData()
			}
			this.isEnvchahnged = false;
			this.closeFilters()
		}
	}

	onActionChange(data) {
		let str = ''
		data.forEach(item => {
			str += (item.value + ',')
		})
		this.queryObj.params.action = str
	}

	/**
	 * Modal methods
	 */
	openHelp(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'detailed-popup help-page' })
	}

	openOptions(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'querytool-popup' }).result.then((result) => {
			if (result === 'save') {
				let newCols = this.visibleColumns.map(item => {
					return {
						name: item.name,
						width: item.width,
						visible: this.form.value[item.name] ? true : false
					}
				})
				this.visibleColumns = newCols
				this.setSelectedColumns(newCols)
				this.timeFormat = this.timeForm.value.timezone
				localStorage.setItem('timeFormat', this.timeForm.value.timezone)
			} else if (result === 'reset') {
				localStorage.removeItem('selectedColumns')
				localStorage.removeItem('timeFormat')
				this.timeFormat = 'utcTime'
				this.form.reset()
				this.timeForm.reset()
				this.getSelectedColumns()
				this.getFormBuilder()
				this.getTimeFormBuilder()
			} else {
				//
			}
		}).catch(err => {
			console.log(err)
		})
	}

	dataOpen(data, content) {
		this.selectedColumnID = data,
		console.log(this.selectedColumnID,"column data >>>>>>>>>>>>>>>>>>>>>>>>>");

		let row = this.rows.find((item) => item['id'] == data)
		let rowKeys = Object.keys(row)
		let newRow = []
		for (let i = 0; i < rowKeys.length; i++) {
			let arr = [rowKeys[i], row[rowKeys[i]]]
			newRow.push(arr)
		}
		this.selectedColumnData = newRow
		// let dataInfo[] = this.selectedColumnData;
		console.log(this.selectedColumnData,"selectedColumnData data >>>>>>>>>>>>>>>>>>>>>>>>>");



		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'detailed-popup scrollable' })
	}

	reqRespOpen(data, content) {
		this.selectedColumnID = data
		let row = this.rows.find((item) => item['id'] == data)
		this.reqResp = {}
		// let body: Object = {
		// 	params: {
		// 		id: row['id'],
		// 		created: row['created'],
		// 		server: row['server'],
		// 		env: this.queryObj.params.env,
		// 		ts: new Date().getTime()
		// 	}
		// }
		let body: Object = {
			params: {
				id: row['id'],
				created: row['created'],
				server: row['server'],
				ts: new Date().getTime()
			}
		}
		this.http.get(this.reqResponse, body).subscribe(res => {
			if (!res) {
				alert('Something wrong')
				return
			}
			this.reqResp = res
			console.log(this.reqResp, "reqResp")
		}, err => {
			err.name == 'TimeoutError' ? this.timeOutError('Request TimeOut') : '';
		})
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'detailed-popup' })
	}

	OpenRequestResponse(data, content) {
		console.log("OpenRequestResponse is calling")
		this.searchValue = '';
		this.lineCodeActive = '';
		this.partNumberActive = 'active';
		this.searchKey = "partNumber";
		this.eachRowData = data;
		this.selectedColumnID = data;
		this.ReloadingIndicator = true;
		this.requestJSON = []
		this.responseJSON = []
		this.header = []

		let row = this.rows.find((item) => item['id'] == data)

		let dateobj = new Date(row['created'])
		var month = ("0" + (dateobj.getMonth() + 1)).slice(-2)
		var year = dateobj.getFullYear();

		let parameters = new HttpParams()
			.set('activityDate', year + month)
			.set('xmlActivityId', row['id']);
			//.set('env', this.queryObj.params.env);
		console.log(this.reqXml,"reqXml is")
		this.http.get(this.reqXml, { params: parameters }).subscribe(res => {
			console.log(res, "resssssssssssssssssssssssss-")

			if (!res || !res['_source'] || res['StatusCode'] == 400) {
				this.ReloadingIndicator = false;
				return
			}
			this.Request_result = res['_source'].request.parts
			this.Response_result = res['_source'].response.parts
			this.header = res['_source'].header

			this.getRequestJsonView(this.Request_result);
			this.getResponseJsonView(this.Response_result);
			this.ReloadingIndicator = false;
		}, err => {
			this.ReloadingIndicator = false;
			err.name == 'TimeoutError' ? this.timeOutError('Request TimeOut') : '';
		})

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'detailed-popup re-popup' })
	}

	getRequestJsonView(Request_res, expandAll = false) {
		let testData = [];
		Request_res.forEach((ele) => {
			let parentLabel = `PartNumber: ${ele.partNumber}`;
			let finalJsonData = this.buildJsonViewer(parentLabel, ele, expandAll)
			testData.push(finalJsonData);
		})

		this.requestJSON = testData;
	}

	getResponseJsonView(response_res, expandAll = false) {
		let testData = [];
		response_res.forEach((ele) => {
			let parentLabel = `PartNumber: ${ele.partNumber}`;
			let finalJsonData = this.buildJsonViewer(parentLabel, ele, expandAll)
			testData.push(finalJsonData);
		})

		this.responseJSON = testData;
	}

	buildJsonViewer(parentLabel, childData, expanded = false) {
		let children = [];
		Object.keys(childData).forEach(element => {

			if (element == "locations") {
				var locationsObj = {};
				let children = [];

				childData[element].forEach(element => {
					let Childern_childNodes = this.buildJsonViewer(element.called, element, expanded)
					children.push(Childern_childNodes)
				});
				let Childern_ParentNodes = {
					label: "locations",
					data: "locations",
					styleClass: "child-locc",
					expanded: expanded
				}
				locationsObj = ({ children, ...Childern_ParentNodes });
			}

			if (element != 'locations') {
				let childNodes = {
					label: `${element}: ${childData[element]}`,
					data: `${element}: ${childData[element]}`,
					expanded: expanded
				}
				children.push(childNodes);
			}

			if (locationsObj != undefined) {
				children.push(locationsObj);
			}

		});

		let parentNodes = {
			label: parentLabel,
			data: parentLabel,
			expanded: expanded
		}

		return { children, ...parentNodes }
	}

	filterRequest(ReqArray, value, key) {
		let requestData = []
		ReqArray.filter((element, index) => {
			if (element[key].includes(value)) {
				let finalJsonData = this.buildJsonViewer(element.partNumber, element, true)
				requestData.push(finalJsonData);
			};
		});
		return requestData;
	}

	filterResponse(ReqArray, value, key) {
		let responseData = []
		ReqArray.filter((element, index) => {
			if (element[key].includes(value)) {
				let finalJsonData = this.buildJsonViewer(element.partNumber, element, true)
				responseData.push(finalJsonData);
			};
		});
		return responseData;
	}

	searchRE(value, reqrespXmlContent) {

		if (value != undefined && value != null && value != '') {
			let data = this.filterRequest(this.Request_result, value, this.searchKey);
			let res = this.filterResponse(this.Response_result, value, this.searchKey);
			this.requestJSON = data;
			this.responseJSON = res;
		}
		else {
			this.getRequestJsonView(this.Request_result);
			this.getResponseJsonView(this.Response_result);
		}
	}


	SelectSearchKey(value) {
		this.searchKey = value;
		this.searchValue = '';
		this.getRequestJsonView(this.Request_result);
		this.getResponseJsonView(this.Response_result);

		if (value == "partNumber") {
			this.partNumberActive = 'active';
			this.lineCodeActive = '';
		}
		else {
			this.lineCodeActive = 'active';
			this.partNumberActive = '';
		}
	}

	resquest_expandAll() {
		this.getRequestJsonView(this.Request_result, true);
	}

	resquest_collapseAll() {
		this.getRequestJsonView(this.Request_result, false);
	}

	response_expandAll() {
		this.getResponseJsonView(this.Response_result, true);
	}

	response_collapseAll() {
		this.getResponseJsonView(this.Response_result, false);
	}

	exportRecords(content) {
		this.text = '';
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'querytool-popup' })
		this.checkExportStatus();
	}

	async checkExportStatus()
	{
		let dataStatus = await this.http.get(this.exportstatus).toPromise();
		this.exportStatus = (dataStatus!=null && dataStatus['statusCode'])?dataStatus['statusCode']:'';

		if(dataStatus!=null && dataStatus['statusCode']==100)  //completed
		{
			console.log(this.text, "dataStatus-s3url")
			this.displayExportButton = true
		}
		else if(dataStatus!=null && dataStatus['statusCode']==101)  // running
		{
			this.displayExportButton = false
			this.getExportStatusPercentage()
		}
		return dataStatus;
	}

	async getExportData() {
		this.text = '';
		if(this.rowCount<=0)
		{
			this.exportStatus = 100;
			return
		}
		var displayedColumns =[];
		this.visibleColumns.forEach((data) => {(data.visible)?displayedColumns.push(data.name):''})
		this.displayExportButton = false

		let newParams = {
			dateFrom: this.startDate ? `${this.startDate.month}/${this.startDate.day}/${this.startDate.year}` : '',
			dateTo: this.endDate ? `${this.endDate.month}/${this.endDate.day}/${this.endDate.year}` : '',
		}

		this.queryObj.params = { ...this.queryObj.params, ...newParams }
		let parameters = new HttpParams()
		//.set('env', this.queryObj.params.env)
		.set('queryType', this.queryObj.params.queryType)
		.set('searchKey', this.queryObj.params.searchKey)
		.set('action', this.queryObj.params.action)
		.set('headers', (this.optradio==1)?allAvailableCols.toString():displayedColumns.toString())
		.set('dateFrom', this.queryObj.params.dateFrom)
		.set('dateTo',this.queryObj.params.dateTo);

		console.log(parameters,"parametrssssssssss")

		this.http.get(this.exportUrl, { params: parameters }).subscribe(res => {
			console.log(res,"resss-export");
		});

		setTimeout(async () => {
			//this.checkExportStatus()
			this.getExportStatusPercentage();
		},2000);

	}

	async getExportStatusPercentage()
	{
		var i=0;
		let dataStatus = await this.http.get(this.exportstatus).toPromise();
		var interval = setInterval(async () => {
			//this.value = this.value + Math.floor(Math.random() * 10) + 1;
			console.log(this.exportStatus,"exportstatus")
			this.http.get(this.exportstatus).toPromise().then(res => {
				console.log("success")
				this.value = res['status'];

				if (res['status'] >= 100) {
					this.value = 100;
					setTimeout(async () => {
							this.displayExportButton = true
							this.text = res['s3Url']
							this.value = 0;
					},2000);
					clearInterval(interval);  // to stop the loop
				}
			}).catch(err => {
				console.log("failure")
				i++;
				if(i>5)
				{
					this.displayExportButton = true
					this.text = ''
					this.value = 0;
					clearInterval(interval);
					this.timeOutError('Something went worng,Please try again...');
				}
			})

			this.http.get(this.exportStatus).subscribe(res => {
				this.value = res['status'];

				if (res['status'] >= 100) {
					this.value = 100;
					setTimeout(async () => {
							this.displayExportButton = true
							this.text = res['s3Url']
							this.value = 0;
					},2000);
					clearInterval(interval);  // to stop the loop
				}
			},err=>{
				i++;
				if(i>5)
				{
					this.displayExportButton = true
					this.text = ''
					this.value = 0;
					clearInterval(interval);
					this.timeOutError('Something went worng,Please try again...');
				}
			});
		}, 2000);
	}

	// stopExporting() {
	// 	clearInterval(this.interval)
	// }

	/**
	 * Form methods
	 */
	private getFormBuilder() {
		let columns = {}
		for (let i = 0; i < allAvailableCols.length; i++) {
			let data: string = allAvailableCols[i]
			columns[data] = [this.visibleColumns.findIndex(item => item.name == data && item.visible) !== -1 ? true : false]
		}
		this.form = this.formBuilder.group(columns)
	}

	private getTimeFormBuilder() {
		let fields = {
			timezone: [{ value: this.timeFormat, disabled: false }]
		};
		this.timeForm = this.formBuilder.group(fields);
	}

	get visibleColumnsLength() {
		return this.visibleColumns.filter(item => item.visible).length
	}

	onFocusWd(e,wdModal){
		if(this.selectedValue == "wdName" && this.wdNameSelected){
			this.openWdModal(wdModal);
		}
	}

	// wd name start here

	onChangeWd(e,wdModal){
			this.wdNameSelected = false;
			this.searchOnchagneValues = e.value;
			if(this.searchOnchagneValues == "wdName"){
				 this.openWdModal(wdModal);
            }
    }

	onchangeSearch(e){
		console.log(e, "value of e");
    }





	onChangePlace(e){
	   this.place = e.label
	   this.isEnvchahnged = true
	   this.clearFilters();
	}

	onChangeSelectedWd(e,name){
		console.log(e,name,"value of check box");
         // this.checkData.map(item=>{
				if(e == true){
					this.checkData.push(name.label);
					// console.log(newArray, "new array at true");
				}else{
					this.checkData.forEach(item=>{
				         if(item != name.label){
							this.newArray.push(item);
						 }
					});
					console.log(this.newArray,"ndndndndndnn");

					this.checkData=[];
					this.checkData=this.newArray;
				}
			// })
				console.log(this.checkData,'chedkdkdkdkddkdk')
            //  console.log(this.checkData,"chcek data");
	   }

	submitWdname(){
         this.autoFillQueryData=[];
		 this.autoFillQueryData = this.checkData;
		 let arrayofData=[];
		  this.checkData.map(item=>{
			  arrayofData.push("wdName:"+JSON.stringify(item));

		  })
		  console.log(arrayofData.join(","),"stingiful");
		  console.log(this.checkData.join(","),"original");

		 this.queryObj.params.searchKey = arrayofData.join(" OR ");
		 console.log(this.autoFillQueryData, "auto fill");
		 this.modalService.dismissAll();
		 this.checkData=[];
		 this.wdNamesData=[]
		//  this.queryTypeData=[];
	}

}
