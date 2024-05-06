const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Inventory = require('../models/inventory');

// get user by username
router.get('/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .populate("inventory")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ error: 'User ID not found!' });
    });
});

// find user by username, for login purpose
router.post('/:username/login', (req, res) => {
  console.log(req.params);
  User.findOne({
    username: req.params.username,
    password: req.body.password
  })
    .populate("inventory")
    .then((user) => {
      console.log("user: " + user)
      if (user == null) {
        res.status(404).json('Incorrect credentials');
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

// get all users
router.get('/', (req, res) => {
  User.find()
    .populate('inventory')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Could not get all users.' });
    });
});

// post new user
router.post('/', (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Issue creating user. Please try again.' });
    });
});

// find user by username and post new inventory into user
router.post('/:username/inventory', (req, res) => {
  User.findOne({ username: req.params.username }).then(
    (user) => {
      Inventory.findOne(req.body).then(
        (item) => {
          user.inventory.push({ _id: item._id }); // push new inventory info into user's inventory
          user.save()
          user.populate('inventory')
            .then((user) => {
              res.json(user);
            })
            .catch((err) => {
              res.status(404).json({ error: 'Issue adding inventory to user. Please try again.' })
            })
        }
      )
    })
    .catch((err) => {
      res.status(404).json(err)
    });
});

// update user by username (mainly use for storySegID)
router.put('/:username', (req, res) => {
  User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      res.status(404).json({ error: "Issue updating user. Please try again." });
    });
});

// delete user by id
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      User.find()
        .populate('inventory')
        .then((users) => {
          res.json(users);
        })
        .catch((err) => {
          res.status(404).json({ error: 'Issue deleting user. Please try again.' });
        });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = router