let Cookies = require('js-cookie');

function signOut() {
    signOutFromCognito();
      //cognitoUser.globalSignOut(cognitoUser);
    Cookies.remove('xmlQueryToken')
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
      console.log(userPool,"userpool is")
      console.log(cognitoUser,"cognitoUser")
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

export {
    signOut, merge, clearFilters, signOutFromCognito
}
