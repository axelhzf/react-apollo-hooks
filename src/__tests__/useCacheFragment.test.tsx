import * as React from 'react';
import gql from 'graphql-tag';
import { cleanup, render, getByTestId, fireEvent } from 'react-testing-library';
import { useCacheFragment } from '../useCacheFragment';
import { createApolloClient } from './createApolloClient';
import { ApolloHooksProvider } from '../ApolloHooksProvider';

describe('useMutation', () => {
  afterEach(cleanup);

  it('should write and read fragment on the cache', async function() {
    const { client } = await createApolloClient();

    client.cache.writeFragment({
      id: `Pokemon:1`,
      fragment,
      data: {
        __typename: 'Pokemon',
        name: 'Bulbasur'
      }
    });

    function Component(props: { id: string }) {
      const forceUpdate = useForceUpdate();
      const { writeFragment, readFragment } = useCacheFragment<any>({
        fragment,
        type: 'Pokemon'
      });
      const pokemon = readFragment(props.id);

      const rename = React.useCallback(() => {
        writeFragment({ id: props.id, data: { name: 'Charmander' } });
        forceUpdate();
      }, []);

      return (
        <>
          <div data-testid="name">{pokemon.name}</div>
          <button data-testid="button" onClick={rename}>
            Rename
          </button>
        </>
      );
    }

    const { container } = render(
      <ApolloHooksProvider client={client}>
        <Component id={'1'} />
      </ApolloHooksProvider>
    );

    expect(getByTestId(container, 'name').textContent).toEqual('Bulbasur');
    fireEvent.click(getByTestId(container, 'button'));
    expect(getByTestId(container, 'name').textContent).toEqual('Charmander');
  });
});

function useForceUpdate() {
  const [_, set] = React.useState({});
  return () => set({});
}

const fragment = gql`
  fragment PokemonFragment on Pokemon {
    name
  }
`;
