import  jwt  from "jsonwebtoken";

export const verifyTokenGuird = async (req, res,next) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
        return res.status(400).send("Bad request");
    }
    const [type, token] = authorization.split(" ")
    if (type !== "Bearer") {
        return res.status(400).send("Bad request");
    }
    const paylode = await jwt.verify(token, process.env.FORGOT_TOKEN); 
    req.user = paylode;
    next()
}

const invalid = async(res) => {
    res.cookie("authToken", null, {
      httpOnly: true,
        secure: process.env.ENVIROMENT !== "DEV",
        sameSite: process.env.ENVIROMENT === "DEV" ? "lax" : "none",
        path: "/",
        domain: undefined,
        maxAge: 0,
    });
    res.status(400).json({message:"Bad request"})
}


export const userGuird = async (req, res, next) => {
    const { authToken } = req.cookies;
    if (!authToken) {
        return invalid(res)
    }
    const paylode = await jwt.verify(authToken, process.env.AUTH_SECRET);
    // console.log(paylode);
    
    req.user = paylode;
  next();
};