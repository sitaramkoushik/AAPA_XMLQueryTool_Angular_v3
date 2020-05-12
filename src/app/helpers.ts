let Cookies = require('js-cookie');
import * as AWS from 'aws-sdk/global';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

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
function refreshTokens(){
    var UserPoolId = localStorage.getItem('UserPoolId')
    var IdentityPoolId = localStorage.getItem('IdentityPoolId')
    var regionId = localStorage.getItem('regionId')
    var ClientId = localStorage.getItem('ClientId')
    let userName = localStorage.getItem('userName');
    let password = localStorage.getItem('password');
    var poolData = {
        UserPoolId:UserPoolId, // Your user pool id here
        ClientId: ClientId, // Your client id here
        };
        var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
       // let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        var cognitoUser = userPool.getCurrentUser();
        cognitoUser.getSession(function(err, session) {
            if(session == null){
              cognitoAwsAmplify(userName,password,regionId,IdentityPoolId,UserPoolId,ClientId)
            }else {
                let refresh_token = session.getRefreshToken();
                cognitoUser.refreshSession(refresh_token, (err, session) => {
                if (err) {
                  console.log(err);
                }
                else {
                    var logins={providerName:"cognito-idp."+regionId+".amazonaws.com/"+UserPoolId}
                    var awsConfig = {
                    IdentityPoolId: IdentityPoolId,
                    Logins:{}
                }
                awsConfig.Logins[logins['providerName']]=session.getIdToken().getJwtToken()
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(awsConfig);

                    // AWS.config.credentials.refresh(err => {
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
function cognitoAwsAmplify(userName,password,regionId,identityPoolId,UserPoolId,ClientId){
    var poolData = {
      UserPoolId:UserPoolId, // Your user pool id here
      ClientId: ClientId, // Your client id here
    };
    var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: userName,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    var authenticationData = {
        Username: userName,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
    );
    var self = this
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = regionId;
            var logins={providerName:"cognito-idp."+regionId+".amazonaws.com/"+UserPoolId}
            var awsConfig = {
                IdentityPoolId: identityPoolId,
                Logins:{}
            }
            awsConfig.Logins[logins['providerName']]=result.getIdToken().getJwtToken()
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(awsConfig);
            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            //		AWS.config.credentials.refresh(error => {
            ( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((error) => {
                if (error) {
                    console.error(error,"ERRRORROROROROROR",result);
                }
                else {
                    // Instantiate aws sdk service objects now that the credentials have been updated.
                    // example: var s3 = new AWS.S3();
                    console.log('Successfully logged!');
                    localStorage.setItem('userName', userName)
                    localStorage.setItem('password', password)
                }
            });
            //is this correct way?
            },

        //	onFailure: function(err) {
        onFailure: (err)=> {
        console.log("data mismatch",err.message || JSON.stringify(err))
        },
        });
  }
export {
    signOut, merge, clearFilters, signOutFromCognito,cognitoAwsAmplify,refreshTokens
}
