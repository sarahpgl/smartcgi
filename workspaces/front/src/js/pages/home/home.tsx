import React from 'react';
import Header from "@app/js/components/header/Header";
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from '@app/js/components/BadPracticeCard/BadPracticeCard';
import FormationCard from '@app/js/components/FormationCard/FormationCard';
import ExpertCard from '@app/js/components/ExpertCard/ExpertCard';

function Home() {
  return (
    <div>
      <Header />
      <BestPracticeCard />
      <BadPracticeCard />
      <FormationCard />
      <ExpertCard />
    </div>
  );
}

export default Home;