const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

// CORS middleware
app.use(cors());  


const port = process.env.PORT || 5000;

// app.get("/api/contacts", (req, res) => {
//   // res.send("Get all contacts");
//   res.status(200).res.json({ message: "Get all contacts" });
// });      insteaduse

app.use(express.json()); //provides a parser to parse datastream from client
app.use("/api/contacts", require("./routes/contactRoutes")); //middleware
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

//whenever youu have to make use of middleware --- > app.use

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
