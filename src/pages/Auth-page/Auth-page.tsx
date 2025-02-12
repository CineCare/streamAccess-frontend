// AuthPage.tsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, useTheme  } from '@mui/material';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';
import Logo from '../../assets/logo.svg';
// import LogoText from '../../assets/logo-text.svg';
import AccessibilityOptions from '../../components/AccessibilityOptions/AccessibilityOptions';

const AuthPage: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0); // 0 pour Signup, 1 pour Login
  
  //@ts-expect-error event unused
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '60vw', margin: 'auto', padding: 2, textAlign: 'center' }}>
      <Box component="figure" sx={{ display: 'inline-block' }}>
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 700,
          fontSize: "4rem",
        }}
      >
        <span style={{ color: theme.palette.text.primary }}>Stream</span>
        <span style={{ color: theme.palette.primary.light }}>Access</span>
      </Typography>
      {/* <img src={LogoText} alt="Logo de StreamAccess" role="img" />
        <Typography component="figcaption" sx={{ visibility: 'hidden' }}>
          StreamAccess - Accès au streaming thérapeutique
        </Typography> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <img src={Logo} alt="Logo" style={{ width: '10rem', height: 'auto' }} />
      </Box>

      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Inscription" />
        <Tab label="Connexion" />
        <Tab label="Options d'accessibilité" />
      </Tabs>
      <Box sx={{ marginTop: 4 }}>
      {value === 0 && <SignupForm />}
        {value === 1 && <LoginForm onLogin={() => {}} />}
        {value === 2 && <AccessibilityOptions />}
      </Box>
    </Box>
  );
};

export default AuthPage;
