import React from 'react';
import { ApolloHooksContext } from './ApolloHooksProvider';

export function useApollo() {
  return React.useContext(ApolloHooksContext);
}
