const express = require("express");
const fileUpload = require('express-fileupload') 
const {
    makeController,makeFileController
} = require("../../libs/core/helpers");
const {
    logInUserController,
    createUserController,
    getListUserController,
    getUserByIdController,
    OTPVerifyController,
    updateUserController,
    deleteUserController,
    getListEmployeeController,
    deleteEmployeeController,
    updateEmployeeController,
    createCustomerController
} = require("../../libs/user");
const {
    getMasterController,
    autoCompleteController,
    commonDeleteController,
    fileUploadeToS3Controller
} = require("../../libs/master");
const {
    createContactController,
    getListContactController,
    getContactsToAddGroupController
} = require("../../libs/contacts");

const {
    uploadBase64FileController, uploadFileStreamController
} = require('../../libs/file');

const {
    getListChatHistoryController,
    getListChatMessagesController,
    deleteMessageController,
    clearMessageController
} = require('../../libs/chats');
const {getHomePageController} = require('../../libs/Homepage')
const { createVehicleController, createVehicleModelController, getListVehicleListController, deleteVehicleModelController, getVehicleModelListController, deleteVehicleController } = require("../../libs/vehicles");
const { createLocationController, getListLocationsController } = require("../../libs/Location");
const { createPackageController, createPackageLocationController, getListPackagesController, createServicesController, getListServiceController, deletePackagesController, updatePackageController, deleteServicesController } = require("../../libs/Package");
const { createUnitController, getListUnitController, createUnitLocationController, getScheduleListController, getScheduleByIdController, getListUnitLocationController, deleteUnitLocationController, createScheduleController, deleteScheduleController, deleteUnitController, getListUnitByIdController, updateUnitController, updateScheduleController } = require("../../libs/Units");
const { createUserVehicleController, getListUserVehicleListController } = require("../../libs/UserVehicles");
const { getListUserAddressListController, createUserAddressController, updateUserAddressController } = require("../../libs/Address");
const { createBookingController, getListBookingController, updateBookingController, rescheduleBookingController, getListServiceUnitController, checkPaymentController, getUserBookingListController } = require("../../libs/booking");
const { createOfferController, getListOfferController, updateOfferController, deleteOfferController, getListByPromoController } = require("../../libs/Offer");
const { createCheckingListController, getCheckListController } = require("../../libs/CheckList");
const { getCoinListController, updateCoinController, getCoinValueListController } = require("../../libs/Coin");
const { getNotificationMessagesController, sendNotificationFirebaseController } = require("../../libs/notification");
const { createSubscriptionController, updateSubscriptionController, getListSubscriptionController, deleteSubscriptionController } = require("../../libs/Subscription");
const { createPurchaseController, checkPaymentPurchaseController, getListPurchasedController, getUserPurchasedBookingListController } = require("../../libs/PurchasePlan");
const { createExpenseController, updateExpenseController, getListExpenseController, deleteExpenseController } = require("../../libs/Expense");
const { createAccountController, updateAccountController, getListAccountController, deleteAccountController } = require("../../libs/Account");
let router = express.Router();


router.post("/get_type_list", makeController(autoCompleteController));
router.post("/vehicle_model_list", makeController(getVehicleModelListController));
router.post("/vehicle_list", makeController(getListVehicleListController));
router.post("/list_locations", makeController(getListLocationsController));
router.post("/list_packages", makeController(getListPackagesController));
router.post("/list_services", makeController(getListServiceController));
router.post("/list_units", makeController(getListUnitController));
router.post("/list_schedule", makeController(getScheduleListController));
router.post("/schedule_by_id", makeController(getScheduleByIdController));
router.post("/user_vehicle_list", makeController(getListUserVehicleListController));
router.post("/user_address_list", makeController(getListUserAddressListController));
router.post("/booking_list", makeController(getListBookingController));
router.post("/user_booking_list", makeController(getUserBookingListController));
router.post("/list_service_unit", makeController(getListServiceUnitController));
router.post("/offer_list", makeController(getListOfferController));
router.post("/offer_list_by_code", makeController(getListByPromoController));
router.post("/coin_value_list", makeController(getCoinValueListController));
router.post("/user_coin_list", makeController(getCoinListController));
router.post("/get_chat_history", makeController(getListChatHistoryController));
router.post("/get_messages", makeController(getListChatMessagesController));
router.post("/get_notifications", makeController(getNotificationMessagesController));
router.post("/get_subscription_list", makeController(getListSubscriptionController));
router.post("/get_purchase_plans", makeController(getListPurchasedController));
router.post("/get_purchased_bookings", makeController(getUserPurchasedBookingListController));
// router.post("/get_home_page", makeController(getHomePageController));

router.post("/", (req, res) => {
    res.json({});
});


module.exports = router;