const mongoose = require("mongoose");

module.exports.connect = async () => {
  await mongoose.connect(
    process.env.DB_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (error, result) => {
      error
        ? console.error("MongoDB", error)
        : console.log("Database Connected!!");
    }
  );
};
