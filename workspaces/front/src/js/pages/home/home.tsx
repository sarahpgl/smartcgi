import React from 'react';
import Header from "@app/js/components/header/Header";
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from '@app/js/components/BadPracticeCard/BadPracticeCard';
import FormationCard from '@app/js/components/FormationCard/FormationCard';
import ExpertCard from '@app/js/components/ExpertCard/ExpertCard';
import PlayerHand from '@app/js/components/PlayerHand/PlayerHand';

function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Header />
      <BestPracticeCard />
      <BadPracticeCard />
      <FormationCard />
      <ExpertCard />
      <PlayerHand />
    </div>
  );
}

export default Home;