const express = require("express");
const {
    makeController
} = require("../../libs/core/helpers");
const {
    createBookingController,
    getListBookingController,
    updateBookingController,
    rescheduleBookingController,
    checkPaymentController,
    getUserBookingListController
} = require("../../libs/booking");
const {
    createPurchaseController,
    checkPaymentPurchaseController,
    getListPurchasedController,
    getUserPurchasedBookingListController
} = require("../../libs/PurchasePlan");
const { resendOtpController } = require("../../libs/user");

let router = express.Router();

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



router.post("/", (req, res) => {
    res.json({});
});


module.exports = router;