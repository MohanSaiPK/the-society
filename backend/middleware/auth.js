import jwt from "jsonwebtoken";

export default (roles = []) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Incoming Authorization:", authHeader);
    if (!authHeader) return res.status(401).json({ message: "No token" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT verified:", decoded);
      if (roles.length && !roles.includes(decoded.role)) {
        console.log("Forbidden: role mismatch");
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.log("JWT error:", err.message);
      res.status(401).json({ message: "Invalid token" });
    }
  };
