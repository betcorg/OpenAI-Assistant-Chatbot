// require('dotenv/config');
const User = require('../../database/schema/user-schema');

const getUsers = async (res) => {

    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Cannot get users: ', error);
    }
};

const getUserById = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Cannot get user by id: ', error);
    }
};

const updateUser = async (req, res) => {

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updateUser) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(updatedUser);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Cannot update user: ', error);
    }
};

const deleteUser = async (req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(204).json({ deleted_user: deletedUser });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error('Cannot delete user: ', error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};