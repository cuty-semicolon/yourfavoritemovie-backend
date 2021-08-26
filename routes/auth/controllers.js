const User = require("../../models/user");
const jwt = require("jsonwebtoken");
let verifyToken = null;

exports.register = (req, res) => {
  const { username, password } = req.body;
  let newUser = null;

  const create = (user) => {
    if (user) {
      throw new Error("username exists");
    } else {
      return User.create(username, password);
    }
  };
  const count = (user) => {
    newUser = user;
    return User.count({}).exec();
  };

  const assign = (count) => {
    if (count === 1) {
      return newUser.assignAdmin();
    } else {
      return Promise.resolve(false);
    }
  };

  const responed = (isAdmin) => {
    res.json({
      message: "registered successfully",
      admin: isAdmin ? true : false,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(responed)
    .catch(onError);
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get("jwt-secret");
  const check = (user) => {
    if (!user) {
      throw new Error("login failed");
    } else {
      if (user.verify(password)) {
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin,
            },
            secret,
            {
              expiresIn: "7d",
              issuer: "veloport.com",
              subject: "userInfo",
            },
            (err, token) => {
              if (err) reject(err);
              let verifyToken = token;
              console.log(token)
            }
          );
        });
        return p;
      } else {
        throw new Error("login failed");
      }
    }
  };
  const respond = (token) => {
    res.json({
      message: "logged in successfully",
      token,
    });
  };
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };
  User.findOneByUsername(username).then(check).then(respond).catch(onError);
};

exports.check = (req, res) => {
  const token = req.headers["x-access-token"] || req.query.token;
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "not logged In",
    });
  }

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get("jwt-secret"), (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const respond = (token) => {
    res.json({
      success: true,
      info: token,
    });
  };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message
    });
  };
  p.then(respond).catch(onError)
};

exports.check = (req,res) => {
  res.json({
    success: true,
    info: req.decoded
  })
}

exports.tokenverify = (req,res) => {
  const token = req.headers["x-access-token"] || req.query.token;
  if(!verifyToken) {
    res.status(403).json({
      success: false,
      message: 'UnAuthorization'
    })
  }
}