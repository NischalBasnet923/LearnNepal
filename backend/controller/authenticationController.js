const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const root = (req, res) => {
  res.send("Hello World");
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 15);

    if (!username || !email || !password ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "student",
      },
    });

    res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyToken = async (req, res) => {
    console.log("welcomoe");
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ valid: false });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      return res.json({ valid: true });
    } catch (err) {
      return res.status(401).json({ valid: false });
    }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { root, register, signIn, logout, verifyToken };
