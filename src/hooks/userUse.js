import React, { useState, useCallback, useEffect } from "react";
import Context from '../context/AuthContext';
import loginService from '../service/login';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import axios from "axios";

const useUser = (props) => {

    const [jwt, setJWT] = useState(
        () => window.localStorage.getItem('jwt')
    );

    const [idCli,setIdCli] = useState(
        () => window.localStorage.getItem('cli')
    )

    const idCli2 = window.localStorage.getItem('cli');
    const navigate = useNavigate();

    const [state, setState] = useState(
        {
            loading: false, 
            error: false, 
            errorMessaje: ''
        }
    );


    const loginUp = useCallback((emailInput, passwordInput) => {

        setState(
            {
                loading: true,
                error: false,
                errorMessaje: ''
            }
        );

        loginService({ emailInput, passwordInput })
            .then(jwt => {
                console.log(jwt);
                if(!jwt.token){
                    window.localStorage.removeItem('jwt');
                    window.localStorage.removeItem('cli');
                    setState(
                        {
                            loading: false, 
                            error: true, 
                            errorMessaje: jwt.message
                        }
                    )
                }else{
                    window.localStorage.setItem('jwt', jwt.token);
                    window.localStorage.setItem('cli', jwt.user_id);
                    setState(
                        {
                            loading: false,
                            error: false,
                            errorMessaje: ''
                        }
                    )
                    setJWT(jwt.token);
                    setIdCli(jwt.user_id);
                }
            })
    }, [setJWT])

    const validToken = () =>{
        const tokenTmp = window.localStorage.getItem('jwt');
        axios.post('https://api.lessin.pe/wp-json/jwt-auth/v1/token/validate',
        {
            token:tokenTmp
        },
        {
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ tokenTmp
          }
        }).then((resp)=>{
            if(resp.data.code === 'jwt_auth_valid_token'){
                setIdCli(idCli);
            }else{
                logout();
            }
        }).catch((rrr)=>{
            logout();
        })
    }

    const logout = useCallback(() => {
        window.localStorage.removeItem('jwt')
        setJWT(null)
        navigate('/login')
    }, [setJWT])

    useEffect(() => {

        validToken();
        /*
        if (islog) {
            navigate('/dashboard/app')
        } else {
            navigate('/login')
        }
        */
    }, [])


    return (
        <Context.Provider value={{
            isLogged: Boolean(jwt),
            jwt,
            logout,
            loginUp,
            idCli,
            idCli2
        }}>
            {props.children}
        </Context.Provider>
    );

};

export default useUser;