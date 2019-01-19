import React from 'react';
import ApolloClient from 'apollo-client';

export const ApolloHooksContext = React.createContext<ApolloClient<any>>(
  undefined as any
);

export function ApolloHooksProvider(props: {
  client: ApolloClient<any>;
  children: React.ReactNode;
}) {
  return (
    <ApolloHooksContext.Provider value={props.client}>
      {props.children}
    </ApolloHooksContext.Provider>
  );
}
