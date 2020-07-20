import React from 'react';
//componente que posso usar quantas vezes for necessário

interface HeaderProps{
    title: String;

}

const Header: React.FC<HeaderProps> = (props) => {//componente letra maiúscula
    return(
        <header>
            <h1>{props.title}</h1>
        </header>
    );
 }

    export default Header;