const mongoose = require("mongoose");

const Employees = mongoose.model('Employees', {
  name: String,
  email: String,
  password: String,
  position: String,
})

module.exports = Employees;