import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ onSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={(response) => onSuccess(response)}
      onError={() => console.log('Login Failed')}
    />
  );
};

export default GoogleAuth;
