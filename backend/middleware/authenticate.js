import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decoded.userId }; // Lưu userId vào req.user

    next();
  } catch {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
}
