import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // ✅ use bcryptjs

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\+?\d{10,15}$/, "Invalid phone number"],
    },
    NIC: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{9}[VvXx]$|^[0-9]{12}$/, "Invalid NIC"],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = bcrypt.genSaltSync(10); // bcryptjs uses sync or async
  this.password = bcrypt.hashSync(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

// Hide password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);