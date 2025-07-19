
'use client';

import { useEffect } from 'react';
import { Steps } from 'intro.js-react';
import { useOnboarding } from '@/context/onboarding-context';

export function OnboardingTour() {
  const { isTourActive, startTour, stopTour, hasOnboarded, setHasOnboarded } = useOnboarding();

  useEffect(() => {
    // Start tour automatically if the user hasn't completed it before
    if (!hasOnboarded && !isTourActive) {
      startTour();
    }
  }, [hasOnboarded, isTourActive, startTour]);

  const onExit = () => {
    stopTour();
    setHasOnboarded();
  };

  const tourSteps = [
    {
      element: '#sidebar-dashboard-link',
      intro: 'Welcome to FinanceAI Navigator! This is your Dashboard, where you can see a complete overview of your finances.',
    },
    {
      element: '#dashboard-networth-card',
      intro: 'Track your Net Worth and see your financial progress over time.',
    },
     {
      element: '#dashboard-health-card',
      intro: 'Our AI analyzes your data to give you a Financial Health Score and personalized tips for improvement.',
    },
    {
      element: '#sidebar-import-link',
      intro: "Let's get started! Click here to import your financial data. You can upload a file or just use our sample data.",
    },
    {
        element: '#dashboard-empty-state',
        intro: "Once your data is imported, this dashboard will come to life with charts and insights. Let's head to the import page now!",
        title: "You're all set!",
    }
  ];

  return (
    <Steps
      enabled={isTourActive}
      steps={tourSteps}
      initialStep={0}
      onExit={onExit}
      onComplete={onExit}
      options={{
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: 'Next',
        prevLabel: 'Back',
        doneLabel: "Let's Go!",
        tooltipClass: 'custom-intro-tooltip',
        highlightClass: 'custom-intro-highlight',
      }}
    />
  );
}
