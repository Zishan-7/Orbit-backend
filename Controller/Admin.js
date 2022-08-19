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
    const oldUser = await model.Admin.findOne({ email });

    if (oldUser) {
      res.status(200).send({
        statusCode: 400,
        msg: "Admin Already Exist. Please Login",
      });
    } else {
      // Create user in our database
      const admin = await model.Admin.create({
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: password,
      });

      // Create token
      const token = jwt.sign(
        { admin_id: admin._id, email },
        process.env.TOKEN_KEY_ADMIN,
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
    const admin = await model.Admin.findOne({ email });
    if (admin && admin.password == password) {
      // Create token
      const token = jwt.sign(
        { id: admin._id, email },
        process.env.TOKEN_KEY_ADMIN,
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
    const id = req.admin.id;
    const user = await model.Admin.findById(id);

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

module.exports.editPromoCode = async (req, res) => {
  try {
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
    const vendors = await model.User.find();
    return res.status(201).json({
      statusCode: 200,
      msg: "Users fetched",
      data: vendors,
    });
  } catch (e) {
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
