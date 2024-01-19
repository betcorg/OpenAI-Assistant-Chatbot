const User = require('../../database/schema/user-schema');
const { signJWT, hashPassword } = require('../../utils/secManager');

const signup = async (req, res) => {

    try {
        let role = '';
        const { username, email, password } = req.body;
        (email === process.env.ADMIN_MAIL) ? role = 'admin' : role = 'user';

        const passwdHash = await hashPassword(password, 10);

        const newUser = await User.create({ username, email, role, password: passwdHash });

        const token = await signJWT({
            id: newUser._id,
        });

        res.cookie('token', token)
            .status(201)
            .json({
                message: 'User created succesfully',
                user_data: {
                    user_id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                },
            });

    } catch (error) {

        if (error && error.code === 11000) {
            res.status(400).json({
                message: 'User already registered, login instead',
                error_code: error.code,
                error_message: error.message,
            });
            console.error('Cannot create user: ', error);
        } else {
            res.status(500).json({
                message: error.message,
            });
        }
    }
};

const login = async (req, res) => {

    try {
        const { _id, username, email, role, assistants } = req.user;

        if (req.user && _id) {

            const token = await signJWT({ id: _id });

            res.cookie('token', token)
                .status(200)
                .json({
                    message: 'User logged in succesfully',
                    user_info: {
                        username,
                        email,
                        role,
                        assistants
                    }
                });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    });
    res.status(200).json({
        message: 'User logged out succesfully'
    });
};

module.exports = {
    signup,
    login,
    logout,
};