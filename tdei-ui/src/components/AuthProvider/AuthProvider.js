import React from 'react';
import { AuthContext } from '../../context';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = React.useState(null);
    const origin = location.state?.from?.pathname || '/';

    const decodeToken = (accessToken) => {
        if(!accessToken) return;
        const decodedToken = JSON.parse(window.atob(accessToken.split('.')[1]));
        console.log(decodedToken);
        const userObj = {
            name: decodedToken.name || decodedToken.email,
            roles: decodedToken.realm_access.roles,
            isAdmin: decodedToken.realm_access.roles?.includes('tdei-admin')
        }
        setUser(userObj);
    }

    React.useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        decodeToken(accessToken);
    },[])

    const signin = async ({ username, password }, successCallback, errorCallback) => {
        try {
            const response = await axios.post('https://tdei-usermanagement-ts-dev.azurewebsites.net/api/v1/authenticate', {
                username, password
            });
            let accessToken = response.data.access_token;
            let refreshToken = response.data.refresh_token;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            decodeToken(accessToken);
            successCallback(response);
            navigate(origin);
        } catch (err) {
            console.log(err);
            errorCallback(err);
        }
    };

    let value = { user, signin };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider