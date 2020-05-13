let Cookies = require('js-cookie');
import * as AWS from 'aws-sdk/global';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { secretKey } from "./table/data";

//"build-prod": "ng build --base-href=/staging/xmlquerytool/ --deploy-url=/staging/xmlquerytool/ --prod && cp -r ./src/login ./dist",
 function getCognitoUser(cognitoDetails){
    var poolData = {
      UserPoolId:cognitoDetails.userPoolId, // Your user pool id here
      ClientId: cognitoDetails.clientId, // Your client id here
    };
      var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
       return userPool.getCurrentUser();
 }
function signOut(cognitoDetails) {
    var cognitoUser = getCognitoUser(cognitoDetails);
    cognitoUser.signOut();
   localStorage.clear();
    window.location.reload()
}
function signOutFromCognito(cognitoDetails){

    var cognitoUser = getCognitoUser(cognitoDetails);
      cognitoUser.signOut();
      var username =decrypt(localStorage.getItem('uno'))
   var commonvalue = `CognitoIdentityServiceProvider.${cognitoDetails.clientId}.${username}`
    removeLocalStorage(commonvalue,cognitoDetails.identityPoolId);
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
function refreshTokens(cognitoDetails){

        var poolData = {
          UserPoolId:cognitoDetails.userPoolId, // Your user pool id here
          ClientId: cognitoDetails.clientId, // Your client id here
        };
        var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var cognitoUser = userPool.getCurrentUser();
        cognitoUser.getSession(function(err, session) {
            if(session == null){
              //cognitoAwsAmplify(userName,password,regionId,IdentityPoolId,UserPoolId,ClientId)
            }else {
                let refresh_token = session.getRefreshToken();
                cognitoUser.refreshSession(refresh_token, (err, session) => {
                if (err) {
                  console.log(err);
                }
                else {
                    var logins={providerName:"cognito-idp."+cognitoDetails.regionId+".amazonaws.com/"+cognitoDetails.userPoolId}
                    var awsConfig = {
                    IdentityPoolId: cognitoDetails.identityPoolId,
                    Logins:{}
                }
                awsConfig.Logins[logins['providerName']]=session.getIdToken().getJwtToken()
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(awsConfig);

                      ( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((error) => {

                      if (err) {
                        console.log(err);
                      } else {
                        console.log('TOKEN SUCCESSFULLY UPDATED');
                      }
                    });
                  }
                });
            }
          if (err) {
            alert(err);
            return;
          }
      })
}

  function decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

export {
    signOut, merge, clearFilters, signOutFromCognito,refreshTokens,decrypt
}
