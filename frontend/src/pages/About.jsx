import React from 'react';
import AboutHero from '../components/about/AboutHero';
import FeaturesGrid from '../components/about/FeaturesGrid';

const About = () => {
  return (
    <div className="page-section" style={{ pointerEvents: 'auto' }}>
      <div className="about-page-content">
        <AboutHero />
        <FeaturesGrid />
      </div>
    </div>
  );
};

export default About;