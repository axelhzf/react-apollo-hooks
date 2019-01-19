import * as React from 'react';
import { useApollo } from './useApollo';

type InitialState = { loading: boolean; data: undefined; error: undefined };
type SuccessState<D> = { loading: false; data: D; error: undefined };
type ErrorState = { loading: false; data: undefined; error: Error };

export type QueryResult<D> = InitialState | SuccessState<D> | ErrorState;

export type UseQueryArgs<TVariables = {}> = {
  query: any;
  variables?: TVariables;
  skip?: boolean;
  pollInterval?: number;
};

type State<D> = QueryResult<D>;

type Action<D> =
  | { type: 'fetch' }
  | { type: 'success'; data: D }
  | { type: 'error'; error: Error };

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

export function useQuery<D = any, V = any>(args: UseQueryArgs<V>): State<D> {
  const { variables, query, pollInterval } = args;
  const client = useApollo();

  const [state, dispatch] = React.useReducer<State<D>, Action<D>>(reducer, {
    loading: false,
    data: undefined,
    error: undefined
  });

  const observable = React.useMemo(
    () => {
      if (args.skip) return;
      const observable = client.watchQuery({
        query,
        variables,
        fetchPolicy: 'network-only',
        pollInterval
      });
      dispatch({ type: 'fetch' });
      return observable;
    },
    [args.skip, args.query, args.variables]
  );

  React.useEffect(
    () => {
      if (!observable) return;
      const subscription = observable.subscribe(
        ({ data }) => {
          dispatch({ type: 'success', data: data as D });
        },
        error => {
          dispatch({ type: 'error', error });
        }
      );
      return () => subscription.unsubscribe();
    },
    [observable]
  );

  return state;
}
