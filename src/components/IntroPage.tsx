import React from 'react';
import { CasaMilanoIntro } from './CasaMilanoIntro';

export interface IntroPageProps {
  onEnter: (targetSection?: string) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  return (
    <CasaMilanoIntro
      logoSrc="/logo.svg"
      sound={true}
      reducedMotion="auto"
      onComplete={() => onEnter('hero')}
    />
  );
};

export default IntroPage;
