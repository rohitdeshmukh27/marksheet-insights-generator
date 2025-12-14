import { verifyToken } from "../lib/supabaseClient.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  const { user, error } = await verifyToken(authHeader);

  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized", details: error });
  }

  // Attach user to request
  req.user = user;
  next();
}
