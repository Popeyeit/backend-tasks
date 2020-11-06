const userModel = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promises: fsPromises } = require('fs');
const path = require('path');

exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).uid;
    } catch (err) {
      next(err);
    }

    const user = await userModel.findById(userId);

    if (!user || token !== user.token) {
      res.status(401).json('Not authorized');
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};
exports.checkUniqueEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { file, regFile } = req;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (file) {
        await fsPromises.unlink(`public/images/${file.filename}`);
      }
      if (regFile) {
        await fsPromises.unlink(`public/images/${regFile.fileName}`);
      }

      return res.status(409).json('Email in use');
    }
    next();
  } catch (error) {
    next(error);
  }
};
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).json({
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};
