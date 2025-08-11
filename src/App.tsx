import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import DashboardLayout from './components/layout/DashboardLayout';
import ColaboradoresHome from './components/pages/ColaboradoresHome';
import ColaboradorForm from './components/pages/ColaboradorForm';

type AppView = 'home' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [formStep, setFormStep] = useState(1);

  const handleCreateNew = () => {
    setCurrentView('form');
    setFormStep(1);
  };

  const handleBackToList = () => {
    setCurrentView('home');
  };

  const handleStepChange = (step: number) => {
    setFormStep(step);
  };

  const handlePreviousStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    } else {
      setCurrentView('home');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout 
        showBreadcrumbs={currentView === 'form'}
        currentStep={formStep}
        totalSteps={2}
        onNavigateHome={handleBackToList}
      >
        {currentView === 'home' && (
          <ColaboradoresHome onCreateNew={handleCreateNew} />
        )}
        
        {currentView === 'form' && (
          <ColaboradorForm 
            onBack={handlePreviousStep}
            currentStep={formStep}
            onStepChange={handleStepChange}
            onNavigateHome={handleBackToList}
          />
        )}
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default App;
