const model = require("../Models");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await model.User.findOne({ email, isAdmin: true });

    if (oldUser) {
      res.status(200).send({
        statusCode: 400,
        msg: "Admin Already Exist. Please Login",
      });
    } else {
      // Create user in our database
      const admin = await model.User.create({
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: password,
        userName: "Admin",
        state: " ",
        companyAddress: " ",
        profilePic: " ",
        isAdmin: true,
      });

      // Create token
      const token = jwt.sign(
        { user_id: admin._id, email },
        process.env.TOKEN_KEY_USER,
        {
          expiresIn: "30 days",
        }
      );
      // save user token
      admin.token = token;

      // return new user
      return res.status(201).json({
        statusCode: 201,
        msg: "Admin Created",
        data: admin,
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
        .status(200)
        .send({ statusCode: 200, message: "All input is required" });
    }
    // Validate if user exist in our database
    const admin = await model.User.findOne({ email, isAdmin: true });
    if (admin && admin.password == password) {
      // Create token
      const token = jwt.sign(
        { user_id: admin._id, email },
        process.env.TOKEN_KEY_USER,
        {
          expiresIn: "30 days",
        }
      );

      // save user token
      admin.token = token;
      admin.save();

      // user
      res.status(200).send({
        statusCode: 200,
        msg: "Logged In successfully",
        data: admin,
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
    console.log(id);
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
    const id = req.admin.id;

    const user = await model.Admin.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(200).send({
        statusCode: 404,
        msg: "Admin not found",
      });
    }

    user.save();

    return res.status(200).send({
      statusCode: 200,
      msg: "Admin Updated Successfully",
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
    const id = req.admin.id;

    const user = await model.Admin.findById(id);
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
    await model.Admin.findOneAndUpdate({ _id: req.admin.id }, { token: "" });

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

module.exports.addVendor = async (req, res) => {
  try {
    const vendor = await model.Vendor.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Vendor Created",
      data: vendor,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getVendors = async (req, res) => {
  try {
    const vendors = await model.Vendor.find();
    return res.status(201).json({
      statusCode: 200,
      msg: "Vendor fetched",
      data: vendors,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.editVendor = async (req, res) => {
  try {
    console.log(req.body);
    await model.Vendor.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Vendor updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deleteVendor = async (req, res) => {
  try {
    console.log(req.body.id);
    await model.Vendor.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Vendor Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.addPromoCode = async (req, res) => {
  try {
    const vendor = await model.PromoCode.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Promo Code Created",
      data: vendor,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

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

module.exports.editPromoCode = async (req, res) => {
  try {
    console.log(req.body);
    await model.PromoCode.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Promo Code updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deletePromoCode = async (req, res) => {
  try {
    await model.PromoCode.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Promo Code Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.addService = async (req, res) => {
  try {
    const vendor = await model.Service.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Service Created",
      data: vendor,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getServices = async (req, res) => {
  try {
    const vendors = await model.Service.find();
    return res.status(201).json({
      statusCode: 200,
      msg: "Services fetched",
      data: vendors,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.editService = async (req, res) => {
  try {
    console.log(req.body);
    const service = await model.Service.findById(req.params.id);
    console.log(service);
    service.serviceName = req.body.serviceName;

    await service.save();
    // await model.Service.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Service updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deleteService = async (req, res) => {
  try {
    await model.Service.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Service Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    let query = {
      isAdmin: false,
    };
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          userName: _$search,
        },
      ];
    }
    if (req.body.state[0]) {
      query.state = { $in: req.body.state };
    }

    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];
    const vendors = await model.User.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Users fetched",
      data: vendors,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.addUser = async (req, res) => {
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
    const oldUser = await model.User.findOne({ email });

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

module.exports.editUser = async (req, res) => {
  try {
    await model.User.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "User updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    await model.User.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "User Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.addMasterListing = async (req, res) => {
  try {
    const listing = await model.Listing.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Lising Created",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getMasterListing = async (req, res) => {
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
    if (req.body.status[0]) {
      query.status = { $in: req.body.status };
    }
    if (req.body.startDate && req.body.endDate) {
      query.startDate = {
        $gt: new Date(req.body.startDate),
      };
      query.endDate = {
        $lt: new Date(req.body.endDate),
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
      msg: "Master Listings fetched",
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

module.exports.editMasterListing = async (req, res) => {
  try {
    await model.Listing.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Listing updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deleteMasterListing = async (req, res) => {
  try {
    await model.Listing.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Listing Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getAdminFee = async (req, res) => {
  try {
    const listing = await model.AdminFee.findOne();
    return res.status(201).json({
      statusCode: 200,
      msg: "Admin Fee fetched",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.editAdminFee = async (req, res) => {
  try {
    await model.AdminFee.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Admin Fee updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.addAdminFee = async (req, res) => {
  try {
    const listing = await model.AdminFee.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Admin Fee Created",
      data: listing,
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

// Orders

module.exports.placeOrder = async (req, res) => {
  try {
    const fee = await model.AdminFee.findOne();
    const body = req.body;
    body.adminFee = (fee.fee / 100) * body.totalPrice;
    body.vendorPrice = body.totalPrice - body.adminFee;
    const listing = await model.Order.create(req.body);
    return res.status(201).json({
      statusCode: 201,
      msg: "Order Placed",
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

module.exports.getOrders = async (req, res) => {
  try {
    const listing = await model.Order.find();
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

module.exports.editOrder = async (req, res) => {
  try {
    await model.Order.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Order updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    await model.Order.findByIdAndDelete(req.body.id);
    return res.status(201).json({
      statusCode: 200,
      msg: "Order Deleted",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

//  Order Filters

module.exports.changeOrderStatus = async (req, res) => {
  try {
    await model.Order.findOneAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      statusCode: 200,
      msg: "Order Status updated",
    });
  } catch (e) {
    return res.status(200).send({
      statusCode: 400,
      msg: "Some Error occured",
    });
  }
};

module.exports.getNewOrders = async (req, res) => {
  try {
    let query = {
      status: { $in: ["REQUESTED"] },
    };
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          userName: _$search,
        },
      ];
    }
    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];
    const listing = await model.Order.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
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

module.exports.getUsersOrders = async (req, res) => {
  try {
    let query = {
      status: { $not: { $regex: "REQUESTED" } },
    };
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          userName: _$search,
        },
      ];
    }
    if (req.body.status[0]) {
      query.status = { $in: req.body.status };
    }
    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];
    const listing = await model.Order.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
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

module.exports.getClientSales = async (req, res) => {
  try {
    let query = {
      status: { $in: ["ACCEPTED"] },
    };
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          userName: _$search,
        },
      ];
    }
    if (req.body.paymentStatus[0]) {
      query.paymentStatus = { $in: req.body.paymentStatus };
    }
    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];
    const listing = await model.Order.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
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

module.exports.getVendorSales = async (req, res) => {
  try {
    let query = {
      status: { $in: ["COMPLETED"] },
    };
    if (req.body.search) {
      const _$search = { $regex: req.body.search, $options: "i" };
      query.$or = [
        {
          userName: _$search,
        },
      ];
    }

    if (req.body.paymentStatus[0]) {
      query.paymentStatus = { $in: req.body.paymentStatus };
    }
    console.log(query);

    let pipeline = [
      {
        $match: query,
      },
    ];
    const listing = await model.Order.aggregate(pipeline);
    return res.status(201).json({
      statusCode: 200,
      msg: "Orders fetched",
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
