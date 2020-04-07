// let baseUrl = 'http://staging.myplaceforparts.com/xmlquery/'
// let baseUrl2 = 'http://10.0.1.249:8080/'    //MicroService-Port
//let baseUrl3 = 'http://10.0.3.107:7070/' //Srikant-Port
// let UAT = 'http://devmicroservices-772323968.us-east-1.elb.amazonaws.com/'
let baseUrl4 = 'http://10.0.4.106:7070/'
import {environment} from '../../environments/environment'

export default {
      loginUrl: environment.baseUrl + 'services/login/',
      tableData: environment.baseUrl + 'services/advSearch',
      reqResp: environment.baseUrl + 'services/xmlReqResp',
      reqXml: environment.baseUrl + 'services/xmlreqresfromEs',
      exportUrl:environment.baseUrl + 'services/exportData',
      exportStatus:environment.baseUrl + 'services/getStatus',
      wdNames:environment.baseUrl + 'services/getWdNames'
   //  wdNames: 'http://myplace.ktree.company/aapa_rest_services_api-portlet/restServices/wds'

    //  http://devmicroservices-772323968.us-east-1.elb.amazonaws.com/services/getWdNames?env=dev
}
