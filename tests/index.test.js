
import React from 'react';
import { render } from '@testing-library/react-native';
import SwipeModal from '../src';
import { View } from 'react-native';

describe('SwipeModal Tests', () => {

  it('Should render without any errors', () => {

    render(
      <SwipeModal>
        <View />
      </SwipeModal>
    );
  
  });

});
