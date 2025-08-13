import React, { useState } from 'react';
import BreedIdentifierSection from './BreedIdentifierSection';
import PetPhotoUpload from './PetPhotoUpload';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import HowItWorks from './HowItWorks';

const BreedDetection = () => {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <>
      <BreedIdentifierSection />
      <PetPhotoUpload onUpload={() => setIsUploaded(true)} />
      <PersonalizedRecommendations isUploaded={isUploaded} />
      <HowItWorks />
    </>
  );
};

export default BreedDetection;
