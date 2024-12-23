const mongoose = require('mongoose');

mongoose.set("strictQuery", true);

const connectMongoDB = async (url) => {
  return mongoose.connect(url);
};

module.exports = {
  connectMongoDB,
};