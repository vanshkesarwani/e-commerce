import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function setupAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Promote vansh@gmail.com to admin
    const vanshRes = await mongoose.connection.collection("users").updateOne(
      { email: "vansh@gmail.com" },
      { $set: { role: "admin" } }
    );
    console.log("Updated vansh@gmail.com:", vanshRes.modifiedCount > 0 ? "Promoted to admin" : "Already admin or not found");

    // 2. Also ensure a standard dedicated admin account exists
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const adminRes = await mongoose.connection.collection("users").updateOne(
      { email: "admin@velura.com" },
      {
        $set: {
          name: "Velura Master Admin",
          email: "admin@velura.com",
          role: "admin",
          password: hashedPassword,
          phone: 9999988888,
          photo: {
            public_id: "default_avatar",
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
          },
          gender: "all",
          isVerified: true,
        },
      },
      { upsert: true }
    );
    console.log("admin@velura.com set up successfully with role: admin and password: Admin@123");

    const admins = await mongoose.connection.collection("users").find({ role: "admin" }).toArray();
    console.log("\nCurrent Admins in Database:");
    admins.forEach((a) => console.log(`- ${a.name} (${a.email}) [Role: ${a.role}]`));

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Setup error:", error);
    process.exit(1);
  }
}

setupAdmin();
