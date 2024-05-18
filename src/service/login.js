
const apiUrl  = 'https://api.lessin.pe/wp-json/jwt-auth/v1/token';

export default function login({ emailInput, passwordInput }) {
    return fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: emailInput, password: passwordInput})
    }).then(res => {
        return res.json();
    })

}