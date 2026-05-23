// src/components/common/SplashScreen.tsx
import { t } from '@/i18n';
import type React from 'react';
import { useEffect, useState } from 'react';

import choutexLogo from '../../assets/images/chouTex_notext.png';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThemeLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${themeLoaded ? 'theme-loaded' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <img src={choutexLogo} alt={t('chouTex')} />
        </div>
        <h1 className="splash-title">{t('chouTex')}</h1>
        <div className="splash-loading">
          <div className="loading-spinner" />
          <p>{t('Loading chouTex...')}</p>
        </div>
      </div>
    </div>);

};

export default SplashScreen;