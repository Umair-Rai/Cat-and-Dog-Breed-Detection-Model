import React, { useState } from 'react';
import BreedIdentifierSection from '../Breed Detection/BreedIdentifierSection';
import PetPhotoUpload from '../Breed Detection/PetPhotoUpload';
import PersonalizedRecommendations from '../Breed Detection/PersonalizedRecommendations';
import HowItWorks from '../Breed Detection/HowItWorks';

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
