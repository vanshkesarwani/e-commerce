const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    // Ensure COOKIE_EXPIRE is a number
    const cookieExpireInMs = Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;
  
    // options for cookie
    const options = {
      expires: new Date(Date.now() + cookieExpireInMs),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  export default sendToken;