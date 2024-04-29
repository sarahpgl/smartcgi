import React from 'react';
import MenuComponent from "@app/js/components/MenuComponent/MenuComponent";
import Header from "@app/js/components/header/Header";
import styles from './menu.module.css'; // Importez vos styles CSS si nécessaire
import image from '../../../icons/Image_welcome.svg';



function Menu() {
    return (
        <div className={styles.container}>
            <Header /> {/* Ajoutez l'en-tête */}
            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    {/* Ajoutez votre photo ici */}
                    <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.image} />
                </div>
                <div className={styles.menuContainer}>
                    <MenuComponent />
                </div>
            </div>
        </div>
    );
}

export default Menu;
