import * as React from 'react';
import gql from 'graphql-tag';
import { cleanup, render, fireEvent, getByTestId } from 'react-testing-library';
import { useMutation, MutationResult } from '../useMutation';
import { createApolloClient } from './createApolloClient';
import { ApolloHooksProvider } from '../ApolloHooksProvider';

describe('useMutation', () => {
  afterEach(cleanup);

  it('should execute the mutation', async function() {
    const cb = jest.fn();
    function Component() {
      const [mutate, result] = useMutation(mutation);
      cb(result);
      return <button data-testid="button" onClick={() => mutate({})} />;
    }
    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloHooksProvider client={client}>
        <Component />
      </ApolloHooksProvider>
    );
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);
    expectInitial(calls[0]);
    expectLoading(calls[1]);
    expectData(calls[2]);
  });

  it('should handle mutation errors', async function() {
    const cb = jest.fn();
    function Component() {
      const [mutate, result] = useMutation(mutation);
      cb(result);
      async function handleOnClick() {
        try {
          await mutate({});
          // tslint:disable-next-line:no-empty
        } catch (e) {}
      }
      return <button data-testid="button" onClick={handleOnClick} />;
    }
    const { client, operationsLink, mockLink } = await createApolloClient();
    mockLink.setMocks(() => {
      return { error: new Error('Server error') };
    });

    const { container } = render(
      <ApolloHooksProvider client={client}>
        <Component />
      </ApolloHooksProvider>
    );
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(3);
    expectInitial(calls[0]);
    expectLoading(calls[1]);
    expectError(calls[2]);
  });

  it('should return the data on the mutate method', async function() {
    const cb = jest.fn();
    function Component() {
      const [mutate] = useMutation(mutation);
      async function handleOnClick() {
        const data = await mutate({});
        cb(data);
      }
      return <button data-testid="button" onClick={handleOnClick} />;
    }
    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloHooksProvider client={client}>
        <Component />
      </ApolloHooksProvider>
    );
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls[0][0]).toBeDefined();
  });

  it('should call custom update function', async function() {
    const cb = jest.fn();
    function Component() {
      const [mutate] = useMutation(mutation);
      return (
        <button data-testid="button" onClick={() => mutate({ update: cb })} />
      );
    }
    const { client, operationsLink } = await createApolloClient();
    const { container } = render(
      <ApolloHooksProvider client={client}>
        <Component />
      </ApolloHooksProvider>
    );
    fireEvent.click(getByTestId(container, 'button'));
    await operationsLink.waitForPendingOperations();

    const { calls } = cb.mock;
    expect(calls.length).toEqual(1);
  });
});

function getMutationResult(call: any[]) {
  return call[0] as MutationResult<any>;
}

function expectInitial(call: any[]) {
  expect(getMutationResult(call)).toEqual({
    data: undefined,
    error: undefined,
    loading: false
  });
}

function expectLoading(call: any[]) {
  expect(getMutationResult(call)).toEqual({
    data: undefined,
    error: undefined,
    loading: true
  });
}

function expectData(call: any[]) {
  expect(getMutationResult(call)).toMatchObject({
    error: undefined,
    loading: false
  });
  expect(getMutationResult(call).data).toBeDefined();
}

function expectError(call: any[]) {
  expect(getMutationResult(call)).toMatchObject({
    data: undefined,
    loading: false
  });
  expect(getMutationResult(call).error).toBeDefined();
}

const mutation = gql`
  mutation {
    catchPokemon(pokemonId: 5) {
      name
    }
  }
`;
