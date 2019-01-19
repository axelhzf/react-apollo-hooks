import * as React from 'react';
import { QueryResult, useQuery } from '../useQuery';
import gql from 'graphql-tag';
import { cleanup, fireEvent, render, getByTestId } from 'react-testing-library';
import { createApolloClient } from './createApolloClient';
import { ApolloTestContextProvider } from './ApolloTestContextProvider';

describe('useQuery', () => {
  afterEach(cleanup);

  it('should fetch data on initial render', async function() {
    const cb = jest.fn();

    function Component() {
      const [variables] = React.useState({ name: 'pikachu' });
      const queryResult = useQuery({ query, variables });
      cb(queryResult);
      return null;
    }

    const { client, operationsLink } = await createApolloClient();
    render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;

    expect(calls.length).toEqual(3);
    expectInitial(calls[0]);
    expectLoading(calls[1]);
    expectData(calls[2]);
  });

  it('should handle errors on initial render', async function() {
    const cb = jest.fn();

    function Component() {
      const queryResult = useQuery({ query });
      cb(queryResult);
      return null;
    }

    const { client, mockLink, operationsLink } = await createApolloClient();

    mockLink.setMocks(() => {
      return { error: new Error('There was a problem with your query') };
    });

    render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);

    expectInitial(calls[0]);
    expectLoading(calls[1]);
    expectError(calls[2]);
  });

  it('should refetch data when variables has changed', async function() {
    const cb = jest.fn();

    function Component() {
      const [variables, setVariables] = React.useState({ name: 'bulbasur' });
      const queryResult = useQuery({ query, variables });
      cb(queryResult);
      return (
        <button
          data-testid="button"
          onClick={() => setVariables({ name: 'pikachu' })}
        />
      );
    }

    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();
    cb.mockClear();
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);
    expectData(calls[0]); // this render is because of the setVariables call
    expectLoading(calls[1]);
    expectData(calls[2]);

    expect(
      operationsLink
        .getCompletedOperations()
        .map(operation => operation.variables)
    ).toEqual([{ name: 'bulbasur' }, { name: 'pikachu' }]);
  });

  it('should refetch data when query has changed', async function() {
    const cb = jest.fn();

    function Component() {
      const [params, setParams] = React.useState<any>({
        query,
        variables: { name: 'bulbasur' }
      });
      const queryResult = useQuery({
        query: params.query,
        variables: params.variables
      });
      cb(queryResult);
      return (
        <button
          data-testid="button"
          onClick={() => setParams({ query: query2, variables: undefined })}
        />
      );
    }

    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();
    cb.mockClear();
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);
    expectData(calls[0]); // this render is because of the setVariables call
    expectLoading(calls[1]);
    expectData(calls[2]);

    expect(
      operationsLink
        .getCompletedOperations()
        .map(operation => operation.operationName)
    ).toEqual(['GetPokemonByName', 'GetAllPokemons']);
  });

  it('should skip render when skip prop is passed', async function() {
    const cb = jest.fn();

    function Component() {
      const queryResult = useQuery({ query, skip: true });
      cb(queryResult);
      return null;
    }

    const { client, operationsLink } = await createApolloClient();
    render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(1);

    expectInitial(calls[0]);
  });

  it('should fetch data when skip prop pass from true to false', async function() {
    const cb = jest.fn();

    function Component() {
      const [variables] = React.useState({ name: 'bulbasur' });
      const [skip, setSkip] = React.useState(true);
      const queryResult = useQuery({ query, skip, variables });
      cb(queryResult);
      return (
        <button data-testid="button" onClick={() => setSkip(false)}>
          Disable Skip
        </button>
      );
    }

    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloTestContextProvider client={client}>
        <Component />
      </ApolloTestContextProvider>
    );
    await operationsLink.waitForPendingOperations();
    cb.mockClear();
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);

    expectInitial(calls[0]);
    expectLoading(calls[1]);
    expectData(calls[2]);
  });
});

function getQueryResult(call: any[]) {
  return call[0] as QueryResult<any>;
}

function expectInitial(call: any[]) {
  expect(getQueryResult(call)).toEqual({
    data: undefined,
    error: undefined,
    loading: false
  });
}

function expectLoading(call: any[]) {
  expect(getQueryResult(call)).toEqual({
    data: undefined,
    error: undefined,
    loading: true
  });
}

function expectData(call: any[]) {
  expect(getQueryResult(call)).toMatchObject({
    error: undefined,
    loading: false
  });
  expect(getQueryResult(call).data).toBeDefined();
}

function expectError(call: any[]) {
  expect(getQueryResult(call)).toMatchObject({
    data: undefined,
    loading: false
  });
  expect(getQueryResult(call).error).toBeDefined();
}

const query = gql`
  query GetPokemonByName($name: String!) {
    pokemon(name: $name) {
      name
      number
    }
  }
`;

const query2 = gql`
  query GetAllPokemons {
    pokemons(first: 0) {
      name
      number
    }
  }
`;
