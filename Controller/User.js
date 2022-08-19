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
    const User = await model.User.findOne({ email });
    if (User && User.password == password) {
      // Create token
      const token = jwt.sign(
        { id: User._id, email },
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
    const id = req.User.id;
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
    const id = req.User.id;

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
    const id = req.User.id;

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
    await model.User.findOneAndUpdate({ _id: req.User.id }, { token: "" });

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
