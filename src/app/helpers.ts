let Cookies = require('js-cookie');
let baseurl = "https://ms.myplace4parts.com/prod/xmlQueryTool"
//"build-prod": "ng build --base-href=/staging/xmlquerytool/ --deploy-url=/staging/xmlquerytool/ --prod && cp -r ./src/login ./dist",

function signOut() {
    signOutFromCognito();
      //cognitoUser.globalSignOut(cognitoUser);
   // Cookies.remove('xmlQueryToken')
    localStorage.removeItem('userName')
    window.location.reload()
}
function signOutFromCognito(){
    var UserPoolId = localStorage.getItem('UserPoolId')
    var ClientId = localStorage.getItem('ClientId')
    var poolData = {
        UserPoolId:UserPoolId, // Your user pool id here
        ClientId: ClientId, // Your client id here
      };
      var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      var cognitoUser = userPool.getCurrentUser();
      cognitoUser.signOut();
}
function merge(arr1, arr2) {
    let flags = {};
    let newArr = [...arr1, ...arr2].filter(function (entry) {
        if (flags[entry.name]) {
            return false;
        }
        flags[entry.name] = true;
        return true;
    });
    return newArr
}

function clearFilters() {
    window.location.reload()
}

function changeBaseUrl(env){
    console.log(env,"env isssssssss")
    if ( env == "STAGING") {
        baseurl = "https://ms.myplace4parts.com/staging/xmlQueryTool"
      }else if (env == "PROD") {
        baseurl = "https://ms.myplace4parts.com/prod/xmlQueryTool"
      }else if(env == "DEV") {
        baseurl = "https://gsjhkvo2kf.execute-api.us-east-1.amazonaws.com/dev/xmlQueryTool/"
      }
}
export default {
    tableData: baseurl + '/advSearch',
    reqResp: baseurl + '/xmlReqResp',
    reqXml: baseurl + '/xmlreqresfromEs',
    exportUrl : baseurl + '/exportData',
    exportStatus : baseurl + '/getStatus',
    wdNames : baseurl + '/getWdNames'
}
export {
    signOut, merge, clearFilters, signOutFromCognito, baseurl, changeBaseUrl
}
