import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft,FiLogIn } from 'react-icons/fi';

import './styles.css';
import api from '../../services/api';
import { login } from "../../services/auth";



const Login = () => {



    // States após o preenchimento do formulário
   
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
   

    const history = useHistory();

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })    
    };


    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { email, password } = formData;

        console.log('email', email)

        api.post('/session', {
            email,
            password,
         }).then(res => {
            console.log(res.data.token);
            // localStorage.setItem('@startuplife:token', res.data.token);
            // localStorage.setItem('@startuplife:user', JSON.stringify(res.data.user));
            // localStorage.setItem('@proffy:token', res.data.token);
            // localStorage.setItem('@proffy:user', JSON.stringify(res.data.user));
            login(res.data.token)
        });
        
        alert('Login Efetuado!');
        history.push('/dashboard');
    };

    return (
        <>
            <div id="page-create-point">
                <header>
                   

                    <Link to="/">
                        <span>
                            <FiArrowLeft />
                        </span>
                        <strong>Voltar</strong>
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>

                  

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="nome">Email</label>
                            <input 
                                id="email" 
                                name="email"
                                type="text"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="nome">Senha</label>
                            <input 
                                id="password" 
                                name="password"
                                type="password"
                                onChange={handleInputChange}
                            />
                        </div>

                    </fieldset>
 

                    <button type="submit">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Login</strong>
                    </button>
                </form>
            </div>
        </>
    )
};

export default Login;
