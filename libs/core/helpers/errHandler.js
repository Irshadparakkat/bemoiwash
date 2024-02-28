class errHandler extends Error {
  //   let errCommon 
  //   let errModuleWise 
  //   let HTTP_R_S_Code 
  //   var isError  
  constructor(message = "SOMETHING_WENT_WRONG", errType = "errCommon") {
    super();
    Error.captureStackTrace(this, this.constructor);
    if (errType == "errServer") {
      errType = "errCommon";
      console.log(`\n${new Date().toUTCString()} :-`);
      console.log(message);
    }
    if (typeof message === "object") {
      if (message instanceof Error) {
        console.log(`\n${new Date().toUTCString()} :-`);
        console.log(message);
        // logger.error(message)
        this.message = {
          strMessage: message.strMessage || "SOMETHING_WENT_WRONG",
          apiStatus:"error",
          objDetails: message.objDetails || {
            "reason": "unknown"
          }
        }
      } else {
        this.message = {
          strMessage: message.strMessage || "SOMETHING_WENT_WRONG",
          apiStatus:"error",
          objDetails: message.objDetails || {
            "reason": "unknown"
          }
        }
      }
      this.isError = true;
    } else if (message) {
      this.message = {
        strMessage: message || "SOMETHING_WENT_WRONG",
        apiStatus:"error",
        objDetails: {
          "reason": "unknown"
        }
      }
      this.isError = true;
    }
  }

  set({
    statusCode = 400
  } = {}) {
    return {
      ...this.message,
      statusCode
    };
  }
  send({
    statusCode = 400
  } = {}) {
    return {
      body: this.message,
      statusCode
    };
  }
}

module.exports =  errHandler