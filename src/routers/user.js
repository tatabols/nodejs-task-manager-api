const express = require('express');
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

module.exports = router;
