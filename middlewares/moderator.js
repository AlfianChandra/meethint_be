import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const useModerator = () => {
  const bypassWhitelistedPath = (req, res, next) => {
    const pathWhitelist = ["/api/v1/auth/register", "/api/v1/auth/login"];
    const route = req.originalUrl;
    if (pathWhitelist.some((path) => route.startsWith(path))) {
      return next();
    }

    return res.status(403).json({ status: 403, message: "Access denied" });
  };

  const bypassWhitelistedDomain = (req, res, next) => {
    const allowedOrigins = ["http://localhost:6625", "PostmanRuntime"];
    const userOrigin =
      req.headers["origin"] ||
      req.headers["referer"] ||
      req.headers["user-agent"];

    console.log(userOrigin);
    if (!allowedOrigins.some((origin) => userOrigin?.includes(origin))) {
      return res.status(403).json({ status: 403, message: "Access denied" });
    }

    return next();
  };

  const verifyToken = (req, res, next) => {
    const route = req.originalUrl;
    const pathWhitelist = ["/api/v1/auth/register", "/api/v1/auth/login"];
    if (pathWhitelist.some((path) => route.startsWith(path))) {
      return next();
    }

    const token =
      req.headers["authorization"]?.split(" ")[1] ||
      req.query.token ||
      req.body.token;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              return res
                .status(401)
                .json({ status: 401, message: "Token expired" });
            } else if (err.name === "JsonWebTokenError") {
              return res
                .status(401)
                .json({ status: 401, message: "Invalid token" });
            } else {
              return res
                .status(401)
                .json({ status: 401, message: "Unauthorized: " + err });
            }
          }

          req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
            name: decoded.name,
          };

          return next();
        });
      } catch (error) {
        return res.status(401).json({ status: 401, message: "Invalid token" });
      }
    } else {
      return res
        .status(401)
        .json({ status: 401, message: "No token provided" });
    }
  };
  return {
    bypassWhitelistedPath,
    bypassWhitelistedDomain,
    verifyToken,
  };
};
