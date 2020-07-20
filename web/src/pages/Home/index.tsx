import React from 'react';
import {FiLogIn} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import './styles.css';
//import logo from '../../assets/logo.svg';
//<img src={logo} alt="Ecoleta"/> TO DO

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
             <header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrar pontos de coletas de resíduos.</p>
                    <Link to="create-point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
             </header>
            </div>
        </div>
    )
}

export default Home;