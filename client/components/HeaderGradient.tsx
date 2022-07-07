import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

export function HeaderGradient() {
  return (
    <LinearGradient
      colors={['#342e57', '#282442']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    />
  );
}
