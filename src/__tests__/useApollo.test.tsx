import * as React from 'react';
import { useApollo } from '../useApollo';
import { render } from 'react-testing-library';
import { createApolloClient } from './createApolloClient';
import { cleanup } from 'react-testing-library';
import { ApolloHooksProvider } from '../ApolloHooksProvider';

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
      <ApolloHooksProvider client={client}>
        <Component />
      </ApolloHooksProvider>
    );

    expect(cb.mock.calls).toEqual([[client]]);
  });
});
