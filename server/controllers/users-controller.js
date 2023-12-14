const User = require('../models/userSchema');

/**
 * The function `getUsers` retrieves all users from the database and sends them as a JSON response,
 * handling any errors that occur.
 */
const getUsers = async (req, res) => {

    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        console.error('Cannot get users: ', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * The function `getUserById` is an asynchronous function that retrieves a user by their ID and sends a
 * JSON response with the user data if successful, or an error message if there is an error.
 */
const getUserById = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error('Cannot get user by id: ', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * The function `createUser` creates a new user using the data from the request body and returns the
 * created user as a JSON response, or returns an error message if there is an error.
 */
const createUser = async (req, res) => {

    try {
        const newUser = await User.create(req.body);
        console.log(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Cannot create user: ', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * The function updates a user's information in a database and returns the updated user.
 */
const updateUser = async(req, res) => {

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updateUser) {
            res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Cannot update user: ', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * The deleteUser function is an asynchronous function that deletes a user from the database and
 * returns a response indicating whether the user was successfully deleted or not.
 */
const deleteUser = async(req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({deleted_user: deletedUser});
        }
    } catch (error) {
        console.error('Cannot delete user: ', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};