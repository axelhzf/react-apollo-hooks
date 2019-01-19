import React from 'react';
import ApolloClient from 'apollo-client';

export const ApolloContext = React.createContext<ApolloClient<any>>(undefined as any);

export function ApolloAppContextProvider(props: {
  client: ApolloClient<any>;
  children: React.ReactNode;
}) {
  return (
    <ApolloContext.Provider value={props.client}>
      {props.children}
    </ApolloContext.Provider>
  );
}

export function useApollo() {
  return React.useContext(ApolloContext);
}
