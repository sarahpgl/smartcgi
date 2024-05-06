import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletBP.module.css';

const BookletBP: React.FC = () => {
    const [data, setData] = useState([
        { id: '1', title: 'Réduire le volume de données au strict nécessaire', order: 3, applied: false },
        { id: '2', title: 'Favoriser les polices standards', order: 3, applied: false },
        { id: '3', title: 'Adopter le carbone aware computing', order: 2, applied: false },
        { id: '4', title: 'ORM - éviter les requêtes multiples', order: 1, applied: false },
        { id: '5', title: 'Externaliser les feuilles de style CSS et les scripts Javascript', order: null, applied: false },
        { id: '6', title: 'Mettre en place un outil danalyse de code avec un plugin orienté éco-code', order: null, applied: false },
        { id: '7', title: 'Privilégier une approche mobile first, à défaut un chargement adaptatif', order: null, applied: true },
        { id: '8', title: 'Préférer la pagination au défilement infini', order: null, applied: false },
        { id: '9', title: 'Préférer une PWA à une application mobile native similaire au site web', order: null, applied: true },
        { id: '10', title: 'Minifier les fichiers CSS, Javascriptn HTML et SVG', order: null, applied: false }
    ]);

    const navigate = useNavigate();

    const handleCheckboxChange = (index: number) => {
        const newData = [...data];
        newData[index].applied = !newData[index].applied;
        setData(newData);
    };

    const handleIncreaseOrder = (index: number) => {
        const newData = [...data];
        if (newData[index].order === null) {
            newData[index].order = 1;
        } else {
            newData[index].order++;
        }
        setData(newData);
    };

    const handleDecreaseOrder = (index: number) => {
        const newData = [...data];
        if (newData[index].order !== null && newData[index].order > 1) {
            newData[index].order--;
        }
        setData(newData);
    };

    const sortDataByColumn = (column: string) => {
        const newData = [...data];
        switch (column) {
            case 'title':
                newData.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'order':
                newData.sort((a, b) => (b.order || 0) - (a.order || 0));
                break;
            case 'applied':
                newData.sort((a, b) => (a.applied === b.applied) ? 0 : a.applied ? -1 : 1);
                break;
            default:
                break;
        }
        setData(newData);
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}><strong>Mes bonnes pratiques</strong><i> (A implémenter)</i></label><br />
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => sortDataByColumn('title')}><strong>Pratique</strong></th>
                        <th onClick={() => sortDataByColumn('order')}><strong>Ordre de priorité</strong></th>
                        <th onClick={() => sortDataByColumn('applied')}><strong>Appliquée</strong></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((card, index) => (
                        <tr key={index}>
                            <td>{card.title}</td>
                            <td>
                                <button className={styles.button} onClick={() => handleDecreaseOrder(index)}>-</button>
                                {card.order || ''}
                                <button className={styles.button} onClick={() => handleIncreaseOrder(index)}>+</button>
                            </td>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={card.applied} 
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookletBP;
