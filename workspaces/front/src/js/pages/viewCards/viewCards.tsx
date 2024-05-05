import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import FormationCard from "@app/js/components/FormationCard/FormationCard";
import ExpertCard from "@app/js/components/ExpertCard/ExpertCard";
import QuestionnaireBP from "@app/js/components/QuestionnaireBP/QuestionnaireBP";
import QuestionnaireMP from "@app/js/components/QuestionnaireMP/QuestionnaireMP";
import PracticeQuestion from "@app/js/components/PracticeQuestion/PracticeQuestion";
import next from '@app/icons/next.webp';
import closeIcon from '@app/icons/close.webp';
import styles from './viewCards.module.css';

function ViewCards() {

    const cards = [
        { type: 'BestPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BestPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150 },
        { type: 'BestPractice', id: '32', title: 'Carte 4', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 200 },
        { type: 'BestPractice', id: '32', title: 'Carte 5', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 6', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 7', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BestPractice', id: '32', title: 'Carte 8', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 9', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 10', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 11', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150 },
        { type: 'BestPractice', id: '32', title: 'Carte 12', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 13', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 14', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BestPractice', id: '32', title: 'Carte 15', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150 },
        { type: 'BestPractice', id: '32', title: 'Carte 16', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 17', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 18', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BestPractice', id: '32', title: 'Carte 19', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150 },
        { type: 'BestPractice', id: '32', title: 'Carte 20', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 21', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 22', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BadPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'ProductOwner' },
        { type: 'BadPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'ProductOwner' },
        { type: 'BadPractice', id: '32', title: 'Carte 4', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Architect' },
        { type: 'BadPractice', id: '32', title: 'Carte 5', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Architect' },
        { type: 'BadPractice', id: '32', title: 'Carte 6', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Architect' },
        { type: 'BadPractice', id: '32', title: 'Carte 7', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Developer' },
        { type: 'BadPractice', id: '32', title: 'Carte 8', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Developer' },
        { type: 'BadPractice', id: '32', title: 'Carte 9', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Developer' },
        { type: 'BadPractice', id: '32', title: 'Carte 10', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 11', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 12', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'Formation', id: '32', actor: 'ProductOwner', title: 'Carte 1', contents: 'blablabla blabal blabal' },
        { type: 'Formation', id: '32', actor: 'Developer', title: 'Carte 2', contents: 'blablabla blabal blabal' },
        { type: 'Formation', id: '32', actor: 'Architect', title: 'Carte 3', contents: 'blablabla blabal blabal' },
        { type: 'Expert', id: '32', actor: 'ProductOwner', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { type: 'Expert', id: '32', actor: 'Developer', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { type: 'Expert', id: '32', actor: 'Architect', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' }
    ];

    const [startCardIndex, setStartCardIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuestionnaireBPOpen, setIsQuestionnaireBPOpen] = useState(false);

    const nextPage = () => {
        if (startCardIndex + 14 < cards.length) {
            setStartCardIndex(startCardIndex + 14);
        }
    };

    const previousPage = () => {
        if (startCardIndex - 14 >= 0) {
            setStartCardIndex(startCardIndex - 14);
        }
    };

    const isNextDisabled = startCardIndex + 14 >= cards.length;
    const isPreviousDisabled = startCardIndex === 0;

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
        if (card.type === 'BestPractice'||'BadPractice') {
            setIsQuestionnaireBPOpen(true);
        } else {
            setIsQuestionnaireBPOpen(false);
        }
    };

    const closeModal = () => {
        setSelectedCard(null);
        setIsModalOpen(false);
        setIsQuestionnaireBPOpen(false);
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.cardsContainer}>
                    {cards.slice(startCardIndex, startCardIndex + 14).map((card, index) => (
                        <div key={index} className={styles.card} onClick={() => openModal(card)}>
                            {card.type === 'BestPractice' && <BestPracticeCard cardType={card.type} id={card.id} title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} />}
                            {card.type === 'BadPractice' && <BadPracticeCard title={card.title} contents={card.contents} targetedPlayer={card.targetedPlayer} />}
                            {card.type === 'Formation' && <FormationCard title={card.title} contents={card.contents} actor={card.actor} />}
                            {card.type === 'Expert' && <ExpertCard title={card.title} contents={card.contents} actor={card.actor} />}
                        </div>
                    ))}
                </div>
                <div className={styles.navigationButtons}>
                    <img src={next} alt="Previous" className={`${styles.prevButton} ${isPreviousDisabled ? styles.disabled : ''}`} onClick={previousPage} />
                    <img src={next} alt="Next" className={`${styles.nextButton} ${isNextDisabled ? styles.disabled : ''}`} onClick={nextPage} />
                </div>
            </div>
            {isModalOpen && (
                <div className={styles.modalBackdrop}>
                    <div className={`${styles.modalContent}`}> {}
                        <div className={styles.closeButton} onClick={closeModal}>
                            <img src={closeIcon} alt="Close" />
                        </div>
                        {selectedCard && (
                            <div>
                                {selectedCard.type === 'BestPractice' && (
                                    <>
                                        {isQuestionnaireBPOpen && (
                                                <PracticeQuestion card={selectedCard} />
                                        )}
                                    </>
                                )}
                                {selectedCard.type === 'BadPractice' && (
                                    <>
                                        {isQuestionnaireBPOpen && (
                                            <PracticeQuestion card={selectedCard} />
                                        )}
                                    </>
                                )}
                                {(selectedCard.type === 'Formation' || selectedCard.type === 'Expert') && ( 
                                    <div className={`${styles.bigCard}`}>
                                        {selectedCard.type === 'Formation' && (
                                            <FormationCard title={selectedCard.title} contents={selectedCard.contents} actor={selectedCard.actor} />
                                        )}
                                        {selectedCard.type === 'Expert' && (
                                            <ExpertCard title={selectedCard.title} contents={selectedCard.contents} actor={selectedCard.actor} />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewCards;