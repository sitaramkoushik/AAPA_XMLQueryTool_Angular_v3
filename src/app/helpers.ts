let Cookies = require('js-cookie');
//"build-prod": "ng build --base-href=/staging/xmlquerytool/ --deploy-url=/staging/xmlquerytool/ --prod && cp -r ./src/login ./dist",
 function getCognitoUser(){
    var UserPoolId = localStorage.getItem('UserPoolId')
    var ClientId = localStorage.getItem('ClientId')
    var poolData = {
        UserPoolId:UserPoolId, // Your user pool id here
        ClientId: ClientId, // Your client id here
      };
      var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
       return userPool.getCurrentUser();
 }
function signOut() {
    var cognitoUser = getCognitoUser();
    cognitoUser.signOut();
   localStorage.clear();
    window.location.reload()
}
function signOutFromCognito(){
    
    var cognitoUser = getCognitoUser();
      cognitoUser.signOut();
      var username = localStorage.getItem('userName')
    var ClientId = localStorage.getItem('ClientId')
    var IdentityPoolId = localStorage.getItem('IdentityPoolId')
    var commonvalue = `CognitoIdentityServiceProvider.${ClientId}.${username}`
    removeLocalStorage(commonvalue,IdentityPoolId);
}
function removeLocalStorage(commonValue,IdentityPoolId){
    localStorage.removeItem(commonValue+".idToken")
    localStorage.removeItem(commonValue+".deviceKey")
    localStorage.removeItem(commonValue+".clockDrift")
    localStorage.removeItem(commonValue+".randomPasswordKey")
    localStorage.removeItem(commonValue+".deviceGroupKey")
    localStorage.removeItem(commonValue+".accessToken")
    localStorage.removeItem(commonValue+".refreshToken")
    localStorage.removeItem(commonValue+".LastAuthUser")
    localStorage.removeItem("aws.cognito.identity-id."+IdentityPoolId)
    localStorage.removeItem("aws.cognito.identity-providers."+IdentityPoolId)
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


export {
    signOut, merge, clearFilters, signOutFromCognito
}
