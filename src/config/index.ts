export const config = {
  port: Number(process.env.PORT || 3000),
  database: {
    connectionUrl: process.env.DATABASE_URL || "postgres",
  },
  auth: {
    secret: process.env.AUTH_SECRET || "",
    expiresIn: process.env.AUTH_EXPIRES_IN || "24h",
    refreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN || "30d",
  },
};
