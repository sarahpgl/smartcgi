import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletMP.module.css';

const BookletMP: React.FC = () => {


    const [data, setData] = useState([
        { id: '32', title: 'Requêtes SQL multiples au sein d’une boucle', order:3, banned: false },
        { id: '32', title: 'Reconnexion systématique à la base de données', order:3, banned: false },
        { id: '32', title: 'N’utiliser qu’un seul type de stockage de données ',order:2, banned: false },
        { id: '32', title: 'Carte', order:1, banned: false },
        { id: '32', title: 'Carte', order:null, banned: false },
        { id: '32', title: 'Carte', order:null, banned: false },
        { id: '32', title: 'Carte', order:null, banned: true },
        { id: '32', title: 'Carte', order:null, banned: false },
        { id: '32', title: 'Carte', order:null, banned: true },
        { id: '32', title: 'Carte', order:null, banned: false },
        { id: '32', title: 'Carte', order:null, banned: true },
        { id: '32', title: 'Carte', order:null, banned: true }
    ]);

    const navigate = useNavigate();

    const handleCheckboxChange = (index: number) => {
        const newData = [...data];
        newData[index].banned = !newData[index].banned;
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
            case 'banned':
                newData.sort((a, b) => (a.banned === b.banned) ? 0 : a.banned ? -1 : 1);
                break;
            default:
                break;
        }
        setData(newData);
    };


    return (
        <div className={styles.container}>
            <label className={styles.label}><strong>Mes mauvaises pratiques</strong></label><br />
            <table className={styles.table}>
                <thead>
                    <tr>
                    <th onClick={() => sortDataByColumn('title')}><strong>Pratique</strong></th>
                        <th onClick={() => sortDataByColumn('order')}><strong>Ordre de priorité</strong></th>
                        <th onClick={() => sortDataByColumn('banned')}><strong>Bannie</strong></th>
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
                                    checked={card.banned} 
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

export default BookletMP;
