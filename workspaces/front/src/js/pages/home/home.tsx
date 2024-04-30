import React from 'react';
import Header from "@app/js/components/header/Header";
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from '@app/js/components/BadPracticeCard/BadPracticeCard';
import FormationCard from '@app/js/components/FormationCard/FormationCard';

function Home() {
  return (
    <div>
      <Header />
      <BestPracticeCard />
      <BadPracticeCard />
      <FormationCard />
    </div>
  );
}

export default Home;