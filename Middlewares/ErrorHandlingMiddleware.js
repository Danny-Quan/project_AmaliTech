function ErrorHandlingMiddleware(err, req, res, next) {
  //checking status code for incoming response
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    //showing error stack in development mode only
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
}

module.exports = ErrorHandlingMiddleware;
