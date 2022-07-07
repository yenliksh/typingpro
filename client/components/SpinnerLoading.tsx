import i18n from 'i18n-js';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

interface ISpinnerLoadingProps {
  visible?: boolean;
}

export const SpinnerLoading: React.FC<ISpinnerLoadingProps> = ({ visible }) => {
  return (
    <Spinner
      visible={visible}
      textContent={i18n.t('loading')}
      textStyle={{ color: '#fff' }}
    />
  );
};
