import * as AWS from 'aws-sdk/global';
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
          if (err) {
            alert(err);
            return;
          }
      })
}


export {
    signOut, merge, clearFilters,refreshTokens
}
