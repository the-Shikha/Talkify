const express=require("express")
const app=express();
const cors=require("cors");
const connectDb = require("./config/database");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const cookieParser = require("cookie-parser");
const messageRoutes = require("./routes/message");
const http=require("http");
const initializeSocket = require("./utils/socket");
const BASE_URL = require("./utils/constant");


app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: BASE_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(cookieParser());

app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",messageRoutes)

const server=http.createServer(app);
initializeSocket(server)

const PORT=5000;

connectDb().then(()=>{
    console.log("Database connected successfully :)")
    server.listen(PORT,()=>{
        console.log(`Server is listening on Port no. ${PORT}`)
    })
})
.catch(()=>console.log("Issue while connecting to DB"))