// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let baseurl;
let loginUrl
if(window.location.href.indexOf("https://ms.myplace4parts.com/staging/xmlQueryTool") > -1){
  baseurl = "https://ms.myplace4parts.com/staging/xmlQueryTool"
  loginUrl = "http://staging.myplaceforparts.com/api/jsonws/user_login_rest_service-portlet.userlogin/authenticate-xml-user"
}else if(window.location.href.indexOf("https://ms.myplace4parts.com/prod/xmlQueryTool")> -1){
  baseurl = "https://ms.myplace4parts.com/prod/xmlQueryTool"
  loginUrl = "http://myplaceforparts.com/user_login_rest_service-portlet/api/secure/jsonws/userlogin/authenticate-xml-user"
}else if(window.location.href.indexOf("https://gsjhkvo2kf.execute-api.us-east-1.amazonaws.com/dev/xmlQueryTool/")> -1){
  baseurl = "https://gsjhkvo2kf.execute-api.us-east-1.amazonaws.com/dev/xmlQueryTool/"
  loginUrl = "http://dev.myplaceforparts.com/api/jsonws/user_login_rest_service-portlet.userlogin/authenticate-xml-user"
}else {
  baseurl = "https://ms.myplace4parts.com/staging/xmlQueryTool"
  loginUrl = "http://staging.myplaceforparts.com/api/jsonws/user_login_rest_service-portlet.userlogin/authenticate-xml-user"
}
console.log(baseurl,"baseURL is")
export const environment = {
  production: false,
 // baseUrl:'https://ms.myplace4parts.com/prod/'
   // baseUrl : 'http://devmicroservices-772323968.us-east-1.elb.amazonaws.com/'
   //baseUrl : 'http://ms-prod-787419625.us-east-1.elb.amazonaws.com/'
   baseUrl : baseurl,
   login : loginUrl

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
