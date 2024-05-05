import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletBP.module.css';

const BookletBP: React.FC = () => {
    const [data, setData] = useState([
        { id: '32', title: 'Réduire le volume de données au strict nécessaire', order: 3, applied: false },
        { id: '32', title: 'Favoriser les polices standards', order: 3, applied: false },
        { id: '32', title: 'Adopter le carbone aware computing', order: 2, applied: false },
        { id: '32', title: 'ORM - éviter les requêtes multiples', order: 1, applied: false },
        { id: '32', title: 'Carte', order: null, applied: false },
        { id: '32', title: 'Carte', order: null, applied: false },
        { id: '32', title: 'Carte', order: null, applied: true },
        { id: '32', title: 'Carte', order: null, applied: false },
        { id: '32', title: 'Carte', order: null, applied: true },
        { id: '32', title: 'Carte', order: null, applied: false },
        { id: '32', title: 'Carte', order: null, applied: true },
        { id: '32', title: 'Carte', order: null, applied: true }
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
            <label className={styles.label}><strong>Mes bonnes pratiques</strong></label><br />
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
