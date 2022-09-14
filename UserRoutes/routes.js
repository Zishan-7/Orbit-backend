const router = require("express").Router();
const controller = require("../Controller");
const auth = require("../Middleware/userAuth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", controller.User.login);
router.post("/register", controller.User.register);
router.post("/logout", auth, controller.User.logout);
router.get("/getProfile", auth, controller.User.getProfile);
router.put("/editProfile", auth, controller.User.editProfile);
router.post("/changePass", auth, controller.User.changePassword);

//companies

router.post("/logisticCompanies", auth, controller.User.getLogisticCompanies);
router.post("/filteredCompanies", auth, controller.User.fetchFilteredCompanies);

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

// calculate price

router.post("/calculatePrice", auth, controller.User.calculatePrices);

//file Upload

router.post("/uploadFile", upload.single("file"), controller.Admin.uploadFile);

//orders

router.get("/orders/:id", auth, controller.User.getOrder);

// notifications

router.get("/notifications", auth, controller.User.getNotifications);

module.exports = router;
