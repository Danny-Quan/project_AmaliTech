const createCookie = (res, token) => {
  const cookies = res.cookie("userInfo", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return cookies;
};

module.exports = createCookie;
