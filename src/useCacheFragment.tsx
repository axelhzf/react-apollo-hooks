import * as React from 'react';
import { DocumentNode } from 'graphql';
import { useApollo } from './useApollo';

export function useCacheFragment<D>(args: { fragment: DocumentNode; type: string }) {
  const apollo = useApollo();
  const cache = apollo.store.getCache();

  const readFragment = React.useMemo(() => {
    return (id: string) => {
      const cacheId = `${args.type}:${id}`;
      const cachedData = cache.readFragment({
        id: cacheId,
        fragment: args.fragment
      });
      return cachedData as D | null;
    };
  }, []);

  const writeFragment = React.useMemo(() => {
    return (props: { id: string; data: D }) => {
      const cacheId = `${args.type}:${props.id}`;
      cache.writeFragment({
        id: cacheId,
        fragment: args.fragment,
        data: {
          __typename: args.type,
          ...(props.data as any)
        }
      });
    };
  }, []);

  return { readFragment, writeFragment };
}
