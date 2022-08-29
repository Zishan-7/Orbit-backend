const router = require("express").Router();
const controller = require("../Controller");
const auth = require("../Middleware/userAuth");

router.post("/login", controller.User.login);
router.post("/register", controller.User.register);
router.post("/logout", auth, controller.User.logout);
router.get("/getProfile", auth, controller.User.getProfile);
router.put("/editProfile", auth, controller.User.editProfile);
router.post("/changePass", auth, controller.User.changePassword);
router.post("/logisticCompanies", auth, controller.User.getLogisticCompanies);

// chat

router.post("/chat", auth, controller.User.accessChat);
router.get("/chat", auth, controller.User.fetchChats);
router.get("/chat/:chatId", auth, controller.User.getAllMessages);
router.post("/chat/sendMessage", auth, controller.User.sendMessage);

// Bookings

router.get("/processing", auth, controller.User.getProcessingBookings);
router.get("/completed", auth, controller.User.getCompletedBookings);
router.get("/accepted", auth, controller.User.getAcceptedBookings);
router.get("/cancelled", auth, controller.User.getCancelledBookings);

// promo codes

router.get("/promoCode", auth, controller.User.getPromoCodes);
router.get("/promoCode/:id", auth, controller.User.getSinglePromoCode);

module.exports = router;
