angular.module('app')
// User Defined Client Calls

.factory('ForgotPasswordStubs', [
  'HttpBackendBuilder',
  'Config',
  function($HttpBackendBuilder, Config){
    var forgotPasswordStubs = {
      sendEmailCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'send_reset_code',
          data : JSON.stringify({ email: "valid@email.com" }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : [],
          header : "",
          statusText : ""
        }
      },

      sendEmailUnreachableCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'send_reset_code',
          data : JSON.stringify({ email: "valid@email.com" }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 500,
          data : [],
          header : "",
          statusText : ""
        }
      },

      sendEmailExistsCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'send_reset_code',
          data : JSON.stringify({ email: "valid@email.com" }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 401,
          data : JSON.stringify({ email : [ "Email does not exist in the system."  ] }),
          header : "",
          statusText : ""
        },
      },

      sendEmailEmptyCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'send_reset_code',
          data : JSON.stringify({ email: "" }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : [],
          header : "",
          statusText : ""
        }
      },

      sendEmailInvalidCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'send_reset_code',
          data : JSON.stringify({ email : "2@" }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : [],
          header : "",
          statusText : ""
        }
      },

      sendForgetPasswordEmailCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'verify_code',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordEmailInvalidCodeStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'verify_code',
          data : JSON.stringify({
              email : "valid@email.com",
              token : ""
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordInvalidCodeUnreachableStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'verify_code',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 500,
          data : [],
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordUsedCodeUnreachableStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'verify_code',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 401,
          data : JSON.stringify({ token : [ "Invalid Verification Code"  ] }),
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "12345678",
              newPassword : "12345678",
              newPasswordMatch : "12345678"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordEmptyStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "",
              newPassword : "",
              newPasswordMatch : ""
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordInvalidLengthStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "1111111",
              newPassword : "1111111",
              newPasswordMatch : "1111111"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordMismatchStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "11111111",
              newPassword : "11111112",
              newPasswordMatch : "11111111"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 200,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordUnreachableStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "11111111",
              newPassword : "11111111",
              newPasswordMatch : "11111111"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 500,
          data : "",
          header : "",
          statusText : ""
        },
      },

      sendForgetPasswordInvalidStub : {
        request : {
          method : 'POST',
          url : Config.url + Config.api + 'reset_password',
          data : JSON.stringify({
              email : "valid@email.com",
              token : "b313096b",
              password : "11111111",
              newPassword : "11111111",
              newPasswordMatch : "11111111"
            }),
          headers : {
            "Content-Type":"application/json;charset=utf-8",
          }
        },
        response : {
          status : 401,
          data : JSON.stringify({ token : [ "Invalid Verification Code"  ] }),
          header : "",
          statusText : ""
        },
      },
    };
  return forgotPasswordStubs;
}]);
