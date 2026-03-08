import mongoose from "mongoose";
const budgetModel = mongoose.Schema(
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
    },
    limit:{
        type: Number,
        required: true,
        min: 0,
        
        },
    spend:{
        type: Number,
        default:0
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    }
  },
  { timestamps: true }
);

const budgetData = mongoose.model("budget", budgetModel)
export default budgetData;