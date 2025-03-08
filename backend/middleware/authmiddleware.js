const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

// General Authorization Middleware with Role-Based Access Control (RBAC)
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authorizationHeaderValue = req.headers["authorization"];
    if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    const token = authorizationHeaderValue.split("Bearer ")[1]; 
    if (!token) {
      return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      console.log("Authenticated User:", req.user);

     
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
      }

      next(); 
    } catch (err) {
      console.error("Token validation error:", err);
      return res.status(400).json({ error: "Invalid Token" });
    }
  };
};

// const protectTeacher = async (req, res, next) => {
//     try {
//       if (!req.user || !req.user.id) {
//         return res.status(401).json({ error: "Unauthorized: User information missing" });
//       }
  
//       const userId = req.user.id;
  
//       const user = await prisma.user.findUnique({
//         where: { id: userId },
//         select: { role: true },
//       });
  
//       if (!user || user.role !== "teacher") {
//         return res.status(403).json({ error: "Unauthorized Access: Teacher Role Required" });
//       }
  
//       next(); // User is authorized
//     } catch (error) {
//       console.error("Error in protectTeacher middleware:", error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//   };
  

module.exports = {
  authMiddleware,
//   protectTeacher,
};
