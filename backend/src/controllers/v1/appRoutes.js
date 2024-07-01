import User from '../../database/models/user-schema.js';


export const profile = async (req, res) => {

    const { id } = req.user_id;

    const user_info = await User.findById(id)
        .select('-password')
        .select('-_id');

    if(!user_info) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    res.status(200).json({ user_info });

};