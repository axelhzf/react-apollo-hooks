import { buildSchema, GraphQLSchema } from 'graphql';
import { addMockFunctionsToSchema } from 'graphql-tools';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { SchemaLink } from 'apollo-link-schema';
import { OperationsLink } from './OperationsLink';
import { MockLink } from './MockLink';
import * as fs from 'fs';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);

export async function createApolloClient() {
  const schema = await getSchema();
  addMockFunctionsToSchema({ schema });
  const operationsLink = new OperationsLink();
  const mockLink = new MockLink();
  const schemaLink = new SchemaLink({ schema });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([operationsLink, mockLink, schemaLink])
  });
  return { client, operationsLink, mockLink };
}

let cacheSchema: GraphQLSchema | undefined;
async function getSchema() {
  if (cacheSchema) return cacheSchema;
  const path = `${__dirname}/schema/pokemon-schema.graphql`;
  const source = await readFile(path, 'utf-8');
  cacheSchema = buildSchema(source);
  return cacheSchema;
}
