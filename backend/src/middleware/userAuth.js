const User = require('../database/schema/user-schema');
const { verifyPass } = require('../utils/secManager');

const userAuth = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const signedUser = await User.findOne({ email });

        if (!signedUser) {
            return res.status(404).json({
                message: 'User not found, please sign up',
            });
        }

        const passwordMatch = await verifyPass(password, signedUser.password);
        
        if (!passwordMatch) {
            
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }
        const {username, role, assistants, _id} = signedUser;

        req.user = {
            _id,
            username,
            email,
            role,
            assistants,
        };
        next();

    } catch (error) {
        res.status(500).json({
            messsage: error.message
        });
        console.log(error);
    }
};

module.exports = { userAuth };