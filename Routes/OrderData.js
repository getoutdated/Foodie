const express = require("express"); // Importing the Express framework
const router = express.Router(); // Creating an instance of Express router
const Order = require("../models/Orders"); // Importing the Order model

// Route to handle POST requests to store or update order data
router.post("/orderData", async (req, res) => {
  let data = req.body.order_data; // Extracting order data from request body
  await data.splice(0, 0, { Order_date: req.body.order_date }); // Adding order date to the beginning of the data array
  let eId = await Order.findOne({ email: req.body.email }); // Finding order by email

  // Checking if order exists for the given email
  if (eId === null) {
    try {
      // If order does not exist, create a new order entry
      await Order.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true }); // Respond with success message
      });
    } catch (error) {
      // Handling server error if creation fails
      console.log(error.message);
      res.send("Server Error", error.message);
    }
  } else {
    try {
      // If order exists, update the order_data array by pushing new data
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true }); // Respond with success message
      });
    } catch (error) {
      // Handling server error if update fails
      res.send("Server Error", error.message);
    }
  }
});

// Route to handle POST requests to retrieve order data for a specific user
router.post("/myorderData", async (req, res) => {
  try {
    // Find order data for the specified email
    let myData = await Order.findOne({ email: req.body.email });
    res.json({ orderData: myData }); // Respond with the found order data
  } catch (error) {
    res.status.send("Server Error: " + error.message); // Respond with server error message if retrieval fails
  }
});

module.exports = router; // Exporting the router for use in other parts of the application
