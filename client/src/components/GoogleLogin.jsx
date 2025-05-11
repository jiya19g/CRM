import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ onSuccess }) => {
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => console.log('Login Failed')}
        shape="pill"
        theme="filled_blue"
        size="large"
        text="signin_with"
      />
    </div>
  );
};

export default GoogleAuth;