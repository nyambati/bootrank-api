let secureCookie = (process.env.NODE_ENV === 'development') ? false : true;

module.exports = {
  db: process.env.DATABASE_URL,
  redis: process.env.REDIS_URL,
  secretKey: process.env.SECRET_TOKEN_KEY,
  secureCookie,
  auth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }
  }
};
