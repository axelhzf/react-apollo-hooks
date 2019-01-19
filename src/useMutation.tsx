import * as React from 'react';
import { useApollo } from './useApollo';
import { MutationUpdaterFn } from 'apollo-client';

type InitialState = { loading: boolean; data: undefined; error: undefined };
type SuccessState<D> = { loading: false; data: D; error: undefined };
type ErrorState = { loading: false; data: undefined; error: Error };

export type MutationResult<D> = InitialState | SuccessState<D> | ErrorState;

type UseMutationReturnType<D, V> = [(args: MutateArgs<V>) => Promise<D>, MutationResult<D>];

type MutateArgs<V> = {
  variables?: V;
  update?: MutationUpdaterFn;
};

type State<D> = MutationResult<D>;

type Action<D> = { type: 'fetch' } | { type: 'success'; data: D } | { type: 'error'; error: Error };

function reducer<D>(state: State<D>, action: Action<D>): State<D> {
  switch (action.type) {
    case 'fetch':
      return { ...state, loading: true, data: undefined, error: undefined };
    case 'success':
      return { ...state, loading: false, data: action.data, error: undefined };
    case 'error':
      return { ...state, loading: false, data: undefined, error: action.error };
  }
}

export function useMutation<D = any, V = any>(
  mutation: any
): UseMutationReturnType<D, V> {
  const client = useApollo();
  const [state, dispatch] = React.useReducer<State<D>, Action<D>>(reducer, {
    loading: false,
    data: undefined,
    error: undefined
  });
  const mutate = async (mutateArgs: MutateArgs<V>) => {
    dispatch({ type: 'fetch' });
    try {
      const response = await client.mutate({
        mutation,
        variables: mutateArgs.variables,
        update: mutateArgs.update
      });

      const data = response.data as D;
      dispatch({ type: 'success', data });

      return data;
    } catch (error) {
      dispatch({ type: 'error', error });
      throw error;
    }
  };
  return [mutate, state];
}
