import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password can not be empty"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
