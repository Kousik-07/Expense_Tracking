import mongoose from "mongoose";
const goalModel = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    goalName: {
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
    },
        targetAmount: {
        type:Number,
        required:true,
        min:0,
    },
    userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required:true
        }
  },
  { timestamps: true }
);

const goalData = mongoose.model("goal", goalModel)
export default goalData;