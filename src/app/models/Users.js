import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  productCategory: { 
    type: String, 
    required: true,
    enum:[ "Cement", "Steel Rebars", "Bricks/Blocks", "Flooring Tiles", "Paint & Primers","Gravel & Sand", "Wiring & Cables", "Switches & Sockets","Wood","Plumbing"]
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  distributerName:{type: String},
  distributerNumber:{ type: Number},
  distributerAddress:{type: String},
  description:{type:String},
  profilepic: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  username: { type: String },
  products: [productSchema] // Array of categorized products
});

export default mongoose.models?.Users || mongoose.model("Users", UserSchema);
