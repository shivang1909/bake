import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
  try {
    // Extract token from cookies or headers
    const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];
    console.log(`Extracted token: ${token}`); // Log token for debugging

    if (!token) {
      return response.status(401).json({
        message: "Provide  token",
        error: true,
        success: false,
      });
    }

    // Verify the token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    console.log('Decoded token payload:', decoded); // Log decoded payload for debugging

    if (!decoded) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    // Attach userId to the request object
    request.userId = decoded.id;
    console.log(`Request userId: ${request.userId}`); // Log userId for verification

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error.message || error); // Log error details
    return response.status(500).json({
      message: "You have not logged in",
      error: true,
      success: false,
    });
  }
};

export default auth;
