import ApolloClient from 'apollo-client/ApolloClient';
import * as React from 'react';
import { ApolloAppContextProvider } from '../useApollo';

export function ApolloTestContextProvider(props: {
  client: ApolloClient<any>;
  children: React.ReactNode;
}) {
  return (
    <ApolloAppContextProvider client={props.client}>
      {props.children}
    </ApolloAppContextProvider>
  );
}
