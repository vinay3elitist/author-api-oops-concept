const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      `${connect.connection.host} Successfully connected to the ${connect.connection.name} database`
    );
  } catch (err) {
    console.error("Error occured in DB Connection");
    process.exit(1);
  }
};

module.exports = connectDB;
