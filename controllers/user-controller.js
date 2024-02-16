// FILE COMPLETE
const { User, Thought } = require("../models");
const { findByIdAndRemove } = require("../models/Thought");
const thoughtController = require("./thought-controller");
const { getThoughtById, deleteThought } = require("./thought-controller");

const userController = {
  // GET ALL USERS ➝ /api/users
  getAllUsers(req, res) {
    User.find({})
      .sort({ _id: -1 })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // GET SINGLE USER BY ID ➝ /api/users/:id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // POST: CREATE NEW USER ➝ /api/users
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // PUT: UPDATE USER BY ID ➝ /api/users/:id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // DELETE: REMOVE USER BY ID ➝ /api/users/:id
  // deleteUser({ params }, res) {
  //   User.findById({ _id: params.id })
  //   User.findOneAndDelete({ _id: params.id })
  //     .then((dbUserData) => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: "No user found with this id!" });
  //         return;
  //       }
  //       res.json(dbUserData);
  //     })
  //     .catch((err) => res.status(400).json(err));


  // DELETE USER AND ASSOCIATED THOUGHTS 
    deleteUser({ params }, res) {
      User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this ID.' });
          }
          return Thought.deleteMany(
            { username: dbUserData.username }
          );
        })
        .then(deletedThoughts => {
          if (!deletedThoughts) {
            res.status(404).json({ message: 'User deleted, no thoughts to delete.'});
          }
          res.json(deletedThoughts);
        })
        .catch(err => res.status(400).json(err));
  },

    

  // ADD FRIEND TO USER'S FRIEND LIST ➝ /api/users/:userId/friends/:friendId
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // REMOVE FRIEND FROM USER'S FRIEND LIST ➝ /api/users/:userId/friends/:friendId
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = userController;