const User = require('../models/User');

const DEFAULT_PRODUCTS = [
  {
    _id: "seed-1",
    productCategory: "Cement",
    productName: "UltraTech Super Cement (PPC)",
    price: 385,
    unit: "Bags",
    distributerName: "BuildMate Supplies Co.",
    distributerNumber: "+91 9876543210",
    distributerAddress: "Plot 42, Industrial Area, Sector 62",
    description: "Premium grade Portland Pozzolana Cement for high concrete strength and durability.",
    profilepic: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    username: "buildmate",
    userEmail: "vendor@buildmate.com"
  },
  {
    _id: "seed-2",
    productCategory: "Cement",
    productName: "Ambuja Kawach Water Shield Cement",
    price: 395,
    unit: "Bags",
    distributerName: "Shree Ram Building Materials",
    distributerNumber: "+91 9812345678",
    distributerAddress: "Main Market Road, Hubli",
    description: "Specially formulated water-repellent cement preventing dampness.",
    profilepic: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    username: "shreeram",
    userEmail: "shreeram@gmail.com"
  },
  {
    _id: "seed-3",
    productCategory: "Steel Rebars",
    productName: "Tata Tiscon 500D SD TMT Steel",
    price: 68,
    unit: "Kg",
    distributerName: "Tata Authorized Steel Hub",
    distributerNumber: "+91 9900112233",
    distributerAddress: "Steel Yard, Outer Ring Road",
    description: "Super Ductile TMT rebars engineered for high seismic resistance.",
    profilepic: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80",
    username: "tatasteelhub",
    userEmail: "sales@tatasteelhub.com"
  },
  {
    _id: "seed-4",
    productCategory: "Steel Rebars",
    productName: "JSW Neosteel 550D TMT Rebar",
    price: 65,
    unit: "Kg",
    distributerName: "Apex Iron & Steel Traders",
    distributerNumber: "+91 9765432109",
    distributerAddress: "GST Road, Chennai",
    description: "High yield strength TMT rebar ideal for multi-story residential slabs.",
    profilepic: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
    username: "apextraders",
    userEmail: "contact@apextraders.com"
  },
  {
    _id: "seed-5",
    productCategory: "Bricks/Blocks",
    productName: "Red Clay Premium First-Class Bricks",
    price: 9.5,
    unit: "Nos",
    distributerName: "Karnataka Brick Kiln Works",
    distributerNumber: "+91 9845098450",
    distributerAddress: "Kiln Yard 4, Nelamangala",
    description: "Machine-pressed kiln fired red bricks with uniform shape.",
    profilepic: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    username: "brickworks",
    userEmail: "orders@brickworks.com"
  },
  {
    _id: "seed-6",
    productCategory: "Flooring Tiles",
    productName: "Kajaria Glazed Vitrified 2x2 Tiles",
    price: 68,
    unit: "Sq ft",
    distributerName: "Royal Tile World & Sanitary",
    distributerNumber: "+91 9888776655",
    distributerAddress: "MG Road Ceramic Hub",
    description: "High gloss stain-resistant vitrified tiles.",
    profilepic: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=600&q=80",
    username: "royaltiles",
    userEmail: "contact@royaltiles.com"
  },
  {
    _id: "seed-7",
    productCategory: "Paint & Primers",
    productName: "Asian Paints Royale Luxury Emulsion",
    price: 290,
    unit: "Liters",
    distributerName: "ColorTone Decor Center",
    distributerNumber: "+91 9741234567",
    distributerAddress: "Brigade Road, Bengaluru",
    description: "Teflon surface protector interior paint with anti-bacterial sheen finish.",
    profilepic: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
    username: "colortone",
    userEmail: "hello@colortone.in"
  },
  {
    _id: "seed-8",
    productCategory: "Gravel & Sand",
    productName: "Manufactured P-Sand (Plastering Grade)",
    price: 52,
    unit: "Cubic ft",
    distributerName: "Granite Stone Crusher & Co.",
    distributerNumber: "+91 9632145780",
    distributerAddress: "Quarry Zone 12, Hosur Road",
    description: "Washed cubical P-sand for smooth plastering and crack-free wall surfaces.",
    profilepic: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    username: "granitecrusher",
    userEmail: "sales@granitecrusher.com"
  }
];

const getProducts = async (req, res) => {
  try {
    const { username } = req.query;

    if (username && username !== "undefined") {
      const user = await User.findOne({ username }).lean();
      if (!user || !user.products || user.products.length === 0) {
        const seedMatches = DEFAULT_PRODUCTS.filter(p => p.username === username);
        return res.json(seedMatches);
      }
      return res.json(user.products.map(p => ({
        ...p,
        userEmail: user.email,
        username: user.username
      })));
    }

    const users = await User.find({ products: { $exists: true, $ne: [] } }).lean();
    const dbProducts = users.flatMap(u => (u.products || []).map(p => ({
      ...p,
      userEmail: u.email,
      username: u.username
    })));

    const combined = [...dbProducts, ...DEFAULT_PRODUCTS];
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      const id = item._id ? item._id.toString() : item.productName;
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    }

    return res.json(unique);
  } catch (error) {
    console.error("GET Products Error:", error.message);
    return res.json(DEFAULT_PRODUCTS);
  }
};

const createProduct = async (req, res) => {
  try {
    const { email, product } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const defaultUsername = email ? email.split('@')[0] : 'vendor';
      user = await User.create({
        email,
        username: defaultUsername,
        name: defaultUsername,
        products: [product]
      });
    } else {
      await User.updateOne({ email }, { $push: { products: product } });
    }

    return res.status(201).json({ success: true, message: "Product created successfully" });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    return res.status(500).json({ error: "Failed to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { username, productId, updatedProduct } = req.body;
    const result = await User.updateOne(
      { username, "products._id": productId },
      {
        $set: {
          "products.$.productName": updatedProduct.productName,
          "products.$.productCategory": updatedProduct.productCategory,
          "products.$.price": Number(updatedProduct.price),
          "products.$.distributerName": updatedProduct.distributerName,
          "products.$.distributerNumber": updatedProduct.distributerNumber,
          "products.$.distributerAddress": updatedProduct.distributerAddress,
          "products.$.profilepic": updatedProduct.profilepic
        }
      }
    );
    return res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Update Product Error:", error.message);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { username, productId } = req.body;
    await User.updateOne(
      { username },
      { $pull: { products: { _id: productId } } }
    );
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
