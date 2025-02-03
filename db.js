const mongoose = require("mongoose"); // Importing Mongoose for MongoDB interaction
const express = require("express"); // Importing Express framework

// MongoDB URI for connecting to the database
const uri = `mongodb://foodie:Raj%40infinity123@ac-az4myxv-shard-00-00.cw6k0l5.mongodb.net:27017,ac-az4myxv-shard-00-01.cw6k0l5.mongodb.net:27017,ac-az4myxv-shard-00-02.cw6k0l5.mongodb.net:27017/foodie?ssl=true&replicaSet=atlas-1q0gyg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// Async function to connect to MongoDB
async function connect() {
  try {
    // Attempting to connect to MongoDB using the URI
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Fetching data from the 'foodData2' collection and storing it in global variable 'food_items'
    const fetched_data = mongoose.connection.db.collection("foodData2");
    const data = await fetched_data.find({}).toArray();
    console.log("Fetched data:", data);
    global.food_items = data;

    // Fetching data from the 'food_category' collection and storing it in global variable 'foodCategory'
    const foodCategory = mongoose.connection.db.collection("food_category");
    const catData = await foodCategory.find({}).toArray();
    console.log("Fetched categories:", catData);
    global.foodCategory = catData;
  } catch (error) {
    // Handling error if connection fails
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connect; // Exporting the connect function for use in other parts of the application
