fcmAdmin = require("firebase-admin");
const serviceAccount = require("../serviceKey.json");
fcmAdmin.initializeApp({
  credential: fcmAdmin.credential.cert(serviceAccount),
});

module.exports.sendToUsers = async ({ users, title, message, data = {} }) => {
  try {
    users = [].concat(users);
    // building data payload for handling
    data = Object.assign({ _AppName: "Orbit" }, data);

    // console.log(users);

    const filterUser = users.filter((user) => user.pushToken);
    console.log(filterUser);

    if (filterUser.length) {
      const tokens = filterUser.map((user) => user.pushToken);
      await sendFirebasePush({
        tokens,
        data: data,
        title: title,
        message: message,
      });

      console.log("####### NOTIFICATION SENT ########");
    }
  } catch (error) {
    console.error(error);
  }
};

async function sendFirebasePush({ tokens, title = "", data = {}, message }) {
  try {
    if (!fcmAdmin) throw new Error("FCM ADMIN_NOT_DECLARED");

    const payload = {
      notification: {
        title: title,
        body: message,
        // badge: badgeCount,
      },
      data: data,
    };
    // send notification
    let doc = await fcmAdmin.messaging().sendToDevice(tokens, payload);
    // Consoling...
    console.log("FCM Notification Successfully Sent with Response:", payload);
  } catch (error) {
    console.error(error);
  }
}
