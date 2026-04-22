import dbConnect from "@/app/db/connectDb";
import Users from "@/app/models/Users";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    
    await dbConnect();
    
    if (username && username !== "undefined") {
      // Fetch products for specific user
      const user = await Users.findOne({ username }).lean();
      return Response.json(user?.products?.map(p => ({
        ...p,
        userEmail: user.email,
        username: user.username
      })) || []);
    } else {
      // Fetch all products from all users
      const users = await Users.find({ products: { $exists: true, $ne: [] } }).lean();
      
      const allProducts = users.flatMap(user => 
        user.products.map(product => ({
          ...product,
          userEmail: user.email,
          username: user.username
        }))
      );
      
      return Response.json(allProducts);
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, product } = await request.json();
    await dbConnect();
    
    await Users.updateOne(
      { email },
      { $push: { products: product } }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to save product" }, { status: 500 });
  }
}
export async function PUT(request) {
  try {
    const { username, productId, updatedProduct } = await request.json();
    await dbConnect();
    
    const result = await Users.updateOne(
      { 
        username,
        "products._id": productId 
      },
      { 
        $set: {
          "products.$.productName": updatedProduct.productName,
          "products.$.productCategory": updatedProduct.productCategory,
          "products.$.price": updatedProduct.price,
          "products.$.distributerName": updatedProduct.distributerName,
          "products.$.distributerNumber": updatedProduct.distributerNumber,
          "products.$.distributerAddress": updatedProduct.distributerAddress,
          "products.$.profilepic": updatedProduct.profilepic
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Product not found or not updated" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { username, productId } = await request.json();
    await dbConnect();
    
    const result = await Users.updateOne(
      { username },
      { $pull: { products: { _id: productId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Product not found or not deleted" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}