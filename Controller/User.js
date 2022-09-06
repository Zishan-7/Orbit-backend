const model = require("../Models");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    // Get user input
    const { email, password, userName, state, companyAddress, profilePic } =
      req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await model.User.findOne({ email, isAdmin: false });

    if (oldUser) {
      res.status(200).send({
        statusCode: 400,
        msg: "User Already Exist. Please Login",
      });
    } else {
      // Create user in our database
      const user = await model.User.create({
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: password,
        userName,
        state,
        companyAddress,
        profilePic,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY_USER,
        {
          expiresIn: "30 days",
        }
      );
      // save user token
      user.token = token;

      // return new user
      return res.status(201).json({
        statusCode: 201,
        msg: "User Created",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res
        .status(400)
        .send({ statusCode: 200, message: "All input is required" });
    }
    // Validate if user exist in our database
    const User = await model.User.findOne({ email, isAdmin: false });
    if (User && User.password == password) {
      // Create token
      const token = jwt.sign(
        { user_id: User._id, email },
        process.env.TOKEN_KEY_USER,
        {
          expiresIn: "30 days",
        }
      );

      // save user token
      User.token = token;
      User.save();

      // user
      res.status(200).send({
        statusCode: 200,
        msg: "Logged In successfully",
        data: User,
      });
    } else {
      res.status(200).send({
        statusCode: 400,
        msg: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(200).send({
      statusCode: 400,
      msg: "Some error occured",
    });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const id = req.user.user_id;
    const user = await model.User.findById(id);

    if (!user) {
      return res.status(200).send({
        statusCode: 404,
        msg: "User not found",
      });
    }

    return res.status(200).send({
      statusCode: 200,
      msg: "User fetched Successfully",
      data: user,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 304,
      msg: "Some error occured, Please try again",
    });
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    const id = req.user.user_id;

    const user = await model.User.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(200).send({
        statusCode: 404,
        msg: "User not found",
      });
    }

    user.save();

    return res.status(200).send({
      statusCode: 200,
      msg: "User Updated Successfully",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 304,
      msg: "Some error occured, Please try again",
    });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const id = req.user.user_id;

    const user = await model.User.findById(id);
    const old = user.password;

    const isCorrect = req.body.oldPassword == old;

    if (isCorrect == false) {
      res.status(200).send({
        statusCode: 304,
        msg: "Incorrect Current Password",
      });
    } else {
      user.password = req.body.oldPassword;
      await user.save();
      res.status(201).json({
        statusCode: 201,
        msg: "Password Updated",
        data: user,
      });
    }
  } catch (e) {
    return res.status(200).send({
      statusCode: 304,
      msg: "Some error occured, Please try again",
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    await model.User.findOneAndUpdate({ _id: req.user.user_id }, { token: "" });

    res.status(200).send({
      statusCode: 200,
      msg: "Logged out Successfully",
    });
  } catch (error) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

//chat

module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await model.Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.user_id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await model.User.populate(isChat, {
    path: "latestMessage.sender",
    select: "userName profilePic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.user_id, userId],
    };

    try {
      const createdChat = await model.Chat.create(chatData);
      const FullChat = await model.Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

module.exports.fetchChats = async (req, res) => {
  try {
    model.Chat.find({ users: { $elemMatch: { $eq: req.user.user_id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await model.User.populate(results, {
          path: "latestMessage.sender",
          select: "userName profilePic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.getAllMessages = async (req, res) => {
  try {
    const messages = await model.Message.find({
      chat: req.params.chatId,
    }).populate("sender", "userName profilePic email");
    // .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user.user_id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await model.Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await model.User.populate(message, {
      path: "chat.users",
      select: "userName profilePic email",
    });

    await model.Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

module.exports.getLogisticCompanies = async (req, res) => {
  try {
    let query = {};
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          logisticCompany: _$search,
        },
      ];
    }
    // if (req.body.status[0]) {
    //   query.status = { $in: req.body.status };
    // }
    if (req.body.startDate) {
      query.startDate = {
        $gt: new Date(req.body.startDate),
      };
    }

    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];

    const listing = await model.Listing.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Logictic Companies fetched",
      data: listing,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.fetchFilteredCompanies = async (req, res) => {
  try {
    console.log(req.body);
    let { from, dropOff, weight } = req.body;
    let query = {};

    const _$search = { $regex: from, $options: "i" };
    query.$or = [
      {
        pickUpPoint: _$search,
      },
    ];

    query.dropOffState = { $in: dropOff };
    // dropoff is array

    query.maxWeight = {
      $gt: parseInt(weight),
    };

    // query.$match = { size: "medium" };
    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];

    const listing = await model.Listing.aggregate(pipeline);
    console.log(listing);
    return res.status(201).json({
      statusCode: 200,
      msg: "Logistic Companies fetched",
      data: listing,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

// Bookings

module.exports.getProcessingBookings = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const listing = await model.Order.find({ userId, status: "REQUESTED" });
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getAcceptedBookings = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const listing = await model.Order.find({ userId, status: "ACCEPTED" });
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getCompletedBookings = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const listing = await model.Order.find({ userId, status: "COMPLETED" });
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getCancelledBookings = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const listing = await model.Order.find({ userId, status: "CANCELLED" });
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

//Promo Codes

module.exports.getPromoCodes = async (req, res) => {
  try {
    const vendors = await model.PromoCode.find();
    return res.status(201).json({
      statusCode: 200,
      msg: "Promo Codes fetched",
      data: vendors,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getSinglePromoCode = async (req, res) => {
  try {
    const vendors = await model.PromoCode.findById(req.params.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Promo Code fetched",
      data: vendors,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};
