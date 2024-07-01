//creating cookie
const createCookie = (res, token) => {
  const cookies = res.cookie("userInfo", token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), //cookies expoires in 5 days
    path:"/",
    httpOnly: true,
    secure: true,
    sameSite:"none",
  });
  return cookies;
};

module.exports = createCookie;
