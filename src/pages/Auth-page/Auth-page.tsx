// AuthPage.tsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../providers/store';
// import { RootState, AppDispatch } from '../../providers/store';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';

const AuthPage: React.FC = () => {
  const [value, setValue] = useState(0); // 0 pour Signup, 1 pour Login

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '80vw', margin: 'auto', padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {value === 0 ? 'Inscription' : 'Connexion'}
      </Typography>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Inscription" />
        <Tab label="Connexion" />
      </Tabs>
      {value === 0 ? <SignupForm /> : <LoginForm onLogin={() => {}} />}
    </Box>
  );
};

export default AuthPage;