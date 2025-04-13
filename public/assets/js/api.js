
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});


async function loginUser(email, passwd) {
    try {
        const response = await api.post('/login', { email, passwd }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

async function registerUser(first_name, last_name, email, passwd) {
    try {
        const response = await api.post('/register', { first_name, last_name, email, passwd });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
}



