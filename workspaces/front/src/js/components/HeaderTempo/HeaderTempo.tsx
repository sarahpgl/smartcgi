import React from 'react';

import './HeaderTempo.css';

interface HeaderProps {
    title: string;
}


const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <h1>Header</h1>
        </header>
    );
};

export default Header;