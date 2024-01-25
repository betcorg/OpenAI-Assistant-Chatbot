import axios from 'axios';


const SERVER_URL = 'http://localhost:3000/api/v1'

/**
 * 
 * @param {String} method - Http method
 * @param {String} route - Api or backend route
 * @param {object} data - Object with the request data to be sent.
 * @returns {object} Returns the properly formatted request body for axios. 
 */
const requestConfig = (method, route, data) => {
    return {
        method: `${method}`,
        url: `${SERVER_URL}${route}`,
        headers: {
            "Content-Type": "application/json"
        },
        data,
    };
}

export const signupRequest = async (data) => {

    const config = requestConfig('post', '/signup', data);

    try {
        return await axios(config);
    } catch (error) {
        console.log('An error occured while sending register data');
        throw error;
    }


};

export const loginRequest = async (data) => {

    const config = requestConfig('post', '/login', data);

    const response = await axios(config);

    console.log(response.data);

    if (response.status === 200) {
        console.log();
    }
};

export const logoutRequest = async (data) => {

    const config = requestConfig('post', '/logout', data);

    const response = await axios(config);

    console.log(response.data);

    if (response.status === 200) {
        console.log();
    }
};

