import mongoose from "mongoose";
const transectionModel = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "food",
        "shopping",
        "transport",
        "salary",
        "freelance",
        "bills",
        "health",
        "savings",
      ],
      required: true,
    },
    transectionTypes: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const transectionData = mongoose.model("transection", transectionModel)
export default transectionData;