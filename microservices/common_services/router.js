const express = require("express");
const fileUpload = require('express-fileupload')
const {
    makeController, makeFileController
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
    createCustomerController,
    resendOtpController
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
const { createVehicleController, createVehicleModelController, getListVehicleListController, deleteVehicleModelController, getVehicleModelListController, deleteVehicleController } = require("../../libs/vehicles");
const { createLocationController, getListLocationsController, deleteLocationController, updateLocationController } = require("../../libs/Location");
const { createPackageController, createPackageLocationController, getListPackagesController, createServicesController, getListServiceController, deletePackagesController, updatePackageController, deleteServicesController, updateServiceController, getListAllPackagesController } = require("../../libs/Package");
const { createUnitController, getListUnitController, createUnitLocationController, getScheduleListController, getScheduleByIdController, getListUnitLocationController, deleteUnitLocationController, createScheduleController, deleteScheduleController, deleteUnitController, getListUnitByIdController, updateUnitController, updateScheduleController } = require("../../libs/Units");
const { createUserVehicleController, getListUserVehicleListController, deleteUserVehicleController } = require("../../libs/UserVehicles");
const { getListUserAddressListController, createUserAddressController, updateUserAddressController } = require("../../libs/Address");
const { createOfferController, getListOfferController, updateOfferController, deleteOfferController, getListByPromoController } = require("../../libs/Offer");
const { createCheckingListController, getCheckListController } = require("../../libs/CheckList");
const { getCoinListController, updateCoinController, getCoinValueListController } = require("../../libs/Coin");
const { getNotificationMessagesController, sendNotificationFirebaseController, getNotifyUrl } = require("../../libs/notification");
const { createSubscriptionController, updateSubscriptionController, getListSubscriptionController, deleteSubscriptionController } = require("../../libs/Subscription");
const { createExpenseController, updateExpenseController, getListExpenseController, deleteExpenseController } = require("../../libs/Expense");
const { createAccountController, updateAccountController, getListAccountController, deleteAccountController } = require("../../libs/Account");
const { getListServiceUnitController, createBookingController, checkPaymentController, rescheduleBookingController, getListBookingController, getUserBookingListController, updateBookingController } = require("../../libs/booking");
const { createPurchaseController, checkPaymentPurchaseController, getListPurchasedController, getUserPurchasedBookingListController } = require("../../libs/PurchasePlan");
const { getListMonthlyTargetListController, updateMOnthlyTargetController, getDashBoardDataController, getPercentageOfMonthlyTarget, getAllServicesDatasForDashbordController } = require("../../libs/Target");
const { getListTransactionController, createTransactionController } = require("../../libs/Transaction");
let router = express.Router();

router.use("/files_upload", fileUpload())
router.post("/files_upload", makeFileController(fileUploadeToS3Controller))

router.post("/login_user", makeController(logInUserController));

router.post("/otp_vrify", makeController(OTPVerifyController));

router.post("/resend_otp", makeController(resendOtpController));


router.post("/get_master", makeController(getMasterController));
router.post("/common_api", makeController(commonDeleteController));


router.post("/get_type_list", makeController(autoCompleteController));

router.post("/create_user", makeController(createUserController));

router.post("/get_user", makeController(getListUserController));
router.post("/create_customers", makeController(createCustomerController));


router.post("/list_employee", makeController(getListEmployeeController));
router.post("/delete_employee", makeController(deleteEmployeeController));
router.post("/update_employee", makeController(updateEmployeeController));


router.post("/get_user_by_id", makeController(getUserByIdController));
router.post("/update_user", makeController(updateUserController));
router.post("/delete_user", makeController(deleteUserController));


router.post("/create_vehicle", makeController(createVehicleController));
router.post("/create_vehicle_model", makeController(createVehicleModelController));
router.post("/vehicle_model_list", makeController(getVehicleModelListController));

router.post("/delete_vehicle_model", makeController(deleteVehicleModelController));

router.post("/vehicle_list", makeController(getListVehicleListController));
router.post("/create_location", makeController(createLocationController));

router.post("/update_location", makeController(updateLocationController));

router.post("/delete_location", makeController(deleteLocationController));

router.post("/list_locations", makeController(getListLocationsController));
router.post("/vehicle_delete", makeController(deleteVehicleController));


router.post("/create_package", makeController(createPackageController));
router.post("/create_services", makeController(createServicesController));
router.post("/update_services", makeController(updateServiceController));


router.post("/create_checklists", makeController(createCheckingListController));

router.post("/list_checklists", makeController(getCheckListController));



router.post("/list_packages", makeController(getListPackagesController));
router.post("/list_all_packages", makeController(getListAllPackagesController));

router.post("/update_package", makeController(updatePackageController));

router.post("/delete_packages", makeController(deletePackagesController));


router.post("/list_services", makeController(getListServiceController));

router.post("/create_package_location", makeController(createPackageLocationController));

router.post("/remove_services", makeController(deleteServicesController));

router.post("/create_unit", makeController(createUnitController));
router.post("/update_unit", makeController(updateUnitController));

router.post("/list_units", makeController(getListUnitController));
router.post("/create_unit_location", makeController(createUnitLocationController));
router.post("/list_unit_location", makeController(getListUnitLocationController));
router.post("/remove_unit_location", makeController(deleteUnitLocationController));
router.post("/delete_unit", makeController(deleteUnitController));


router.post("/list_schedule", makeController(getScheduleListController));
router.post("/schedule_by_id", makeController(getScheduleByIdController));
router.post("/create_schedule", makeController(createScheduleController));
router.post("/delete_schedule", makeController(deleteScheduleController));
router.post("/update_schedule", makeController(updateScheduleController));


router.post("/create_user_vehicle", makeController(createUserVehicleController));
router.post("/user_vehicle_list", makeController(getListUserVehicleListController));
router.post("/delete_user_vehicle", makeController(deleteUserVehicleController));



router.post("/create_user_address", makeController(createUserAddressController));
router.post("/update_user_address", makeController(updateUserAddressController));
router.post("/user_address_list", makeController(getListUserAddressListController));

router.post("/unit_by_id", makeController(getListUnitByIdController));
router.post("/list_service_unit", makeController(getListServiceUnitController));

router.post("/create_offer", makeController(createOfferController));
router.post("/offer_list", makeController(getListOfferController));
router.post("/update_offer", makeController(updateOfferController));
router.post("/delete_offer", makeController(deleteOfferController));
router.post("/offer_list_by_code", makeController(getListByPromoController));

router.post("/update_coin_value", makeController(updateCoinController));

router.post("/coin_value_list", makeController(getCoinValueListController));

router.post("/user_coin_list", makeController(getCoinListController));


router.post("/get_chat_history", makeController(getListChatHistoryController));
router.post("/get_messages", makeController(getListChatMessagesController));
router.post("/clear_messages", makeController(clearMessageController));
router.post("/get_notifications", makeController(getNotificationMessagesController));

router.post("/send_notifications", makeController(sendNotificationFirebaseController));


router.post("/notifyurl", makeController(getNotifyUrl));


router.post("/delete_message", makeController(deleteMessageController));

router.post("/create_subscription", makeController(createSubscriptionController));
router.post("/update_subscription", makeController(updateSubscriptionController));
router.post("/get_subscription_list", makeController(getListSubscriptionController));
router.post("/delete_subscription", makeController(deleteSubscriptionController));




router.post("/create_expense", makeController(createExpenseController));
router.post("/update_expense", makeController(updateExpenseController));
router.post("/get_expense_list", makeController(getListExpenseController));
router.post("/delete_expense", makeController(deleteExpenseController));


router.post("/create_account", makeController(createAccountController));
router.post("/update_account", makeController(updateAccountController));
router.post("/get_account_list", makeController(getListAccountController));
router.post("/delete_account", makeController(deleteAccountController));


router.post("/create_booking", makeController(createBookingController));
router.post("/check_payment", makeController(checkPaymentController));
router.post("/reschedule_booking", makeController(rescheduleBookingController));
router.post("/booking_list", makeController(getListBookingController));
router.post("/user_booking_list", makeController(getUserBookingListController));
router.post("/update_booking", makeController(updateBookingController));
router.post("/purchase_subscription", makeController(createPurchaseController));
router.post("/check_purchase_payment", makeController(checkPaymentPurchaseController));
router.post("/get_purchase_plans", makeController(getListPurchasedController));
router.post("/get_purchased_bookings", makeController(getUserPurchasedBookingListController));


router.post("/get_monthly_data", makeController(getListMonthlyTargetListController));
router.post("/update_monthly_data", makeController(updateMOnthlyTargetController));


router.post("/get_current_percentage", makeController(getPercentageOfMonthlyTarget));
router.post("/get_dashbord_datas", makeController(getAllServicesDatasForDashbordController));

router.post("/get_all_transaction", makeController(getListTransactionController));

router.post("/create_transaction", makeController(createTransactionController));



router.post("/", (req, res) => {
    res.json({});
});


module.exports = router;