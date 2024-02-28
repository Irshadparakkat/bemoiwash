const {
    logInUserUsecase,
    createUserUsecase,
    getListUserUsecase,
    getListEmployeeUsecase,
    getUserByIdUsecase,
    OTPVerifyUsecase,
    updateUserUsecase,
    deleteUserUsecase,
    deleteEmployeeUsecase,
    updateEmployeeUsecase,
    createCustomerUsecase,
    resendeOtpUseCase
} = require("./usecase/userUsecase");
const {
    errHandler
} = require('../core/helpers');

const logInUserController = async function({
    body: objUserBody,
    ...source
}) {
    try {
        return {
            body: await logInUserUsecase({
                source,
                body: objUserBody
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const createUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createUserUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const createCustomerController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createCustomerUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getListUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListUserUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListEmployeeController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListEmployeeUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getUserByIdController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getUserByIdUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const OTPVerifyController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await OTPVerifyUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const resendOtpController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await resendeOtpUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const updateUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateUserUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const updateEmployeeController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateEmployeeUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const deleteUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteUserUsecase
            ({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const deleteEmployeeController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteEmployeeUsecase
            ({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



module.exports = {
    logInUserController,
    createUserController,
    getListUserController,
    getUserByIdController,
    deleteEmployeeController,
    updateEmployeeController,
    OTPVerifyController,
    updateUserController,
    deleteUserController,
    createCustomerController,
    getListEmployeeController,
    resendOtpController
}