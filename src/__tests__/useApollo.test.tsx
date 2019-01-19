import * as React from 'react';
import { ApolloAppContextProvider, useApollo } from '../useApollo';
import { render } from 'react-testing-library';
import { createApolloClient } from './createApolloClient';
import { cleanup } from 'react-testing-library';

describe('apolloHook', () => {
  afterEach(cleanup);

  it('should inject apollo client', async function() {
    const cb = jest.fn();

    function Component() {
      const apollo = useApollo();
      cb(apollo);
      return null;
    }

    const { client } = await createApolloClient();

    render(
      <ApolloAppContextProvider client={client}>
        <Component />
      </ApolloAppContextProvider>
    );

    expect(cb.mock.calls).toEqual([[client]]);
  });
});
