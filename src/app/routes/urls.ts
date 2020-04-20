// let baseUrl = 'http://staging.myplaceforparts.com/xmlquery/'
// let baseUrl2 = 'http://10.0.1.249:8080/'    //MicroService-Port
//let baseUrl3 = 'http://10.0.3.107:7070/' //Srikant-Port
// let UAT = 'http://devmicroservices-772323968.us-east-1.elb.amazonaws.com/'
let baseUrl4 = 'http://10.0.4.106:7070/'
import {environment} from '../../environments/environment'
import { baseurl } from "../helpers";
export default {
      tableData: baseurl + '/advSearch',
      reqResp: baseurl + '/xmlReqResp',
      reqXml: baseurl + '/xmlreqresfromEs',
      exportUrl : baseurl + '/exportData',
      exportStatus : baseurl + '/getStatus',
      wdNames : baseurl + '/getWdNames'
  }
