module.exports = (req, res, next) => {
  const sessions = {};
  const authError = {
    message: "Error!"
  };
  if (process.env.NODE_ENV === "test") {
    next();
  } else {
    if (!req.session || !req.session.user) {
      return res.status(401).json(authError);
    } else {
      next();
    }
  }
};