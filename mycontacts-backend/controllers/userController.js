const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

///////////////////////////////////////////////////////////////////////

//description: resiter a user
//route will be POST /api/users/register
//acesss define. public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email }); //({x}) x apssed as object
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  //pw hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password is:", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`user created ${user}`);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//////////////////////////////////////////////////////////////////////

//description: login a user
//route will be POST /api/users/login
//acesss define. public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    //compare 2 passwords
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "40m" } //1m bhneko 1 min
    );

    res.status(200).json({ accessToken });
  } else {
    console.log("Invalid credentials or expired session");
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//////////////////////////////////////////////////////////////////////

//description: Current user info
//route will be POST /api/users/current
//acesss private

const currentUser = asyncHandler(async (req, res) => {
  console.log("eta pasyo");
  res.json(req.user);
  console.log("eta pani pasyo");
  next();
});

//////////////////////////////////////////////////////////////////////

module.exports = { registerUser, loginUser, currentUser };
