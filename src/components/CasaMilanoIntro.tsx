import React, { useEffect, useRef } from 'react';
import mountCasaMilanoIntro from './casaMilanoIntro';

export interface CasaMilanoIntroProps {
  logoSrc?: string;
  sound?: boolean;
  reducedMotion?: 'auto' | boolean;
  onComplete?: (info: { reason: string; shots: number; misses: number }) => void;
  zIndex?: number;
}

export const CasaMilanoIntro: React.FC<CasaMilanoIntroProps> = ({
  logoSrc = '/logo.svg',
  sound = true,
  reducedMotion = 'auto',
  onComplete,
  zIndex = 2147483000,
}) => {
  const introInstanceRef = useRef<any>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const intro = mountCasaMilanoIntro({
      logoSrc,
      sound,
      reducedMotion,
      zIndex,
      onComplete: (info: any) => {
        if (onCompleteRef.current) {
          onCompleteRef.current(info);
        }
      },
    });

    introInstanceRef.current = intro;

    return () => {
      if (introInstanceRef.current) {
        introInstanceRef.current.destroy();
        introInstanceRef.current = null;
      }
    };
  }, [logoSrc, sound, reducedMotion, zIndex]);

  return null;
};

export default CasaMilanoIntro;
