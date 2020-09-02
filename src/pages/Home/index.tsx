import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';
const Home = () => {
    return (
        <>
            <div id="page-home">
                <div className="content">

                    <header>
                        <div className="column">
                            <h1>STARTUPLIFE by Neo Ventures</h1>
                        </div>
                        <div className="column Loginbtn">
                            <Link to="/login">
                                <strong>LOGIN</strong>
                            </Link>
                        </div>
                    </header>
                    

                    <main>
                        <h1>Empoderando as próximas grandes empresas.</h1>
                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.</p>
                        
                        <Link to="/create-point">
                            <span>
                                <FiLogIn/>
                            </span>
                            <strong>CADASTRE A SUA STARTUP</strong>
                        </Link>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Home;
