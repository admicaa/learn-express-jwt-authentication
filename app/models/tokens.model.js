import mongoose from "mongoose";

const TokensSchema = mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Types.ObjectId,
    },
    jwt: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Tokens", TokensSchema);
