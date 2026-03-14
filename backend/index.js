import express from "express"
import router from "./model/user/user.routes.js";
const app = express()
import dotenv from "dotenv"
dotenv.config();

import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL)
.then(()=>console.log("database connected"))
.catch(()=>console.log("database not connected"))

app.get("/", (req, res) => {
    res.send("Hello corder")
})
//cookie set
import cookieParser from "cookie-parser";
app.use(cookieParser())
import cors from "cors"
app.use(
  cors({
    origin: ["http://localhost:5173",
      process.env.DOMAIN,
    ],
    credentials:true
  })
);


// app level middleware
import moragn from "morgan";
import transactionRouter from "./src/transactions/transaction.routes.js";
import budgerRouter from "./src/budget/budget.routes.js";
import dashboardRouter from "./src/dashboard/dashboard.routes.js";
import goalRouter from "./src/goal/goal.routes.js";
app.use(moragn('dev'))
app.use(express.json())
//route level middleware
app.use("/api/user",router)
app.use("/api/transection",transactionRouter)
app.use("/api/budget",budgerRouter)
app.use("/api/dashboard", dashboardRouter);
app.use("/api/goal", goalRouter);
const myPort = process.env.PORT
app.listen(myPort, () => {
    
    console.log(`server started on ${myPort}`);
    
})
