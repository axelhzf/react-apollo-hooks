import * as React from 'react';
import { useApollo } from './useApollo';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';
// @ts-ignore
import equals from 'is-equal-shallow';

type InitialState = { loading: boolean; data: undefined; error: undefined };
type SuccessState<D> = { loading: false; data: D; error: undefined };
type ErrorState = { loading: false; data: undefined; error: Error };

export type QueryResult<D> = InitialState | SuccessState<D> | ErrorState;

export type UseQueryArgs<TVariables = {}> = {
  query: any;
  variables?: TVariables;
  skip?: boolean;
  pollInterval?: number;
  metadata?: any;
  context?: any;
  fetchPolicy?: FetchPolicy;
  errorPolicy?: ErrorPolicy;
  notifyOnNetworkStatusChange?: boolean;
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

const noOp = () => {}; // tslint:disable-line:no-empty

export function useQuery<D = any, V = any>(args: UseQueryArgs<V>): State<D> {
  const client = useApollo();
  const [state, dispatch] = React.useReducer<State<D>, Action<D>>(reducer, {
    loading: false,
    data: undefined,
    error: undefined
  });
  const argsRef = React.useRef<UseQueryArgs<V>>(
    {} as any
  ) as React.MutableRefObject<UseQueryArgs<V>>;
  const unsubscribeRef = React.useRef(noOp);

  const isEqual =
    argsRef.current.query === args.query &&
    equals(argsRef.current.variables, args.variables) &&
    argsRef.current.fetchPolicy === args.fetchPolicy &&
    argsRef.current.pollInterval === args.pollInterval &&
    argsRef.current.context === args.context &&
    argsRef.current.metadata === args.metadata &&
    argsRef.current.errorPolicy === args.errorPolicy &&
    argsRef.current.errorPolicy === args.errorPolicy &&
    argsRef.current.notifyOnNetworkStatusChange ===
      args.notifyOnNetworkStatusChange &&
    argsRef.current.skip === args.skip;

  if (!isEqual) {
    argsRef.current = args;
    unsubscribeRef.current();

    if (!args.skip) {
      const observable = client.watchQuery({
        query: args.query,
        variables: args.variables,
        fetchPolicy: args.fetchPolicy,
        pollInterval: args.pollInterval,
        context: args.context,
        metadata: args.metadata,
        errorPolicy: args.errorPolicy,
        notifyOnNetworkStatusChange: args.notifyOnNetworkStatusChange
      });
      dispatch({ type: 'fetch' });
      const subscription = observable.subscribe(
        ({ data }) => {
          dispatch({ type: 'success', data: data as D });
        },
        error => {
          dispatch({ type: 'error', error });
        }
      );
      unsubscribeRef.current = () => subscription.unsubscribe();
    } else {
      unsubscribeRef.current = noOp;
    }
  }

  React.useEffect(() => {
    return () => unsubscribeRef.current();
  }, []);

  return state;
}
