import './App.css';
import { useState } from 'react';
import Header from './Component/Header';
import Footer from './Component/Footer';
import BreedIdentifierSection from './Breed Detection/BreedIdentifierSection';
import PetPhotoUpload from './Breed Detection/PetPhotoUpload';
import PersonalizedRecommendations from './Breed Detection/PersonalizedRecommendations';
import HowItWorks from './Breed Detection/HowItWorks';
function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  return (
    <>
      <Header />
      <BreedIdentifierSection />
      <PetPhotoUpload onUpload={() => setIsUploaded(true)} />
      <PersonalizedRecommendations isUploaded={isUploaded} />
      <HowItWorks/>
      {/* rest of your app */}
      <Footer/>
    </>
  );
}

export default App;
