import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroller en haut de la page lors du changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Pour les routes admin, pas de transition pour éviter les conflits
  if (isAdminRoute) {
    return <React.Fragment key={location.pathname}>{children}</React.Fragment>;
  }

  // Pour les routes publiques, utiliser key pour forcer le re-render lors du changement de route
  return (
    <div 
      key={location.pathname}
      className="page-transition"
      style={{
        animation: 'fadeIn 0.2s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
