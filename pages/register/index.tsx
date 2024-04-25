import React, { useState } from 'react';
import RegisterForm from '../../components/RegisterForm';
import PopupContent from '../../components/PopupContent';

const IndexPage: React.FC = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleErrorClose = () => {
    setShowErrorPopup(false);
  };

  const handleRegisterError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setShowErrorPopup(true);
  };

  return (
    <div className='bg-gray-100 w-full h-screen flex justify-center items-center'>
      <PopupContent
        show={showErrorPopup}
        message={errorMessage}
        onClose={handleErrorClose}
      />
      <RegisterForm onRegisterError={handleRegisterError} />
    </div>
  );
};

export default IndexPage;
