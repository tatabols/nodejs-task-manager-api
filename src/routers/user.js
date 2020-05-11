const express = require('express');
const multer = require('multer');

const User = require('../models/user');
const auth = require('../middlewares/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      return res.status(401).send();
    }

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch('/users/me', auth, async (req, res) => {
  try {
    const schemaKeys = Object.keys(User.schema.tree);
    const bodyKeys = Object.keys(req.body);
    const isValidInputKeys = bodyKeys.every((k) => schemaKeys.includes(k));

    if (!isValidInputKeys) {
      return res.status(500).send({ message: 'Invalid data.' });
    }

    bodyKeys.map((field) => (req.user[field] = req.body[field]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)/)) {
      return cb(new Error('Invalid file type'));
    }

    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send({});
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/users/:id/avatar', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !user.avatar) {
    return res.status(404).send({});
  }

  res.set('Content-Type', 'image/png');
  res.send(user.avatar);
});

module.exports = router;
