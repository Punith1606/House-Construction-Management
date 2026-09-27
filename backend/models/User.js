const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  productCategory: { 
    type: String, 
    required: true,
    enum: [
      "Cement", 
      "Steel Rebars", 
      "Bricks/Blocks", 
      "Flooring Tiles", 
      "Paint & Primers",
      "Gravel & Sand", 
      "Wiring & Cables", 
      "Switches & Sockets",
      "Wood",
      "Plumbing"
    ]
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  distributerName: { type: String },
  distributerNumber: { type: String },
  distributerAddress: { type: String },
  description: { type: String },
  profilepic: { type: String },
  unit: { type: String, default: "Unit" },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  userType: { type: String, enum: ["customer", "distributor", "admin"], default: "distributor" },
  products: [productSchema]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
