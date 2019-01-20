import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@axelhzf/react-apollo-hooks';
import { RouteComponentProps } from 'react-router';
import {
  PokemonByNameQuery,
  PokemonByNameVariables
} from './generated/graphql';
import { Box, Flex, Image, Text, Card } from 'rebass';
import { PokemonCard } from './PokemonCard';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import { ErrorPage } from './ErrorPage';

export function Pokemon(props: RouteComponentProps<{ name: string }>) {
  const name = props.match.params.name;
  const variables = React.useMemo(() => ({ name }), [name]);
  const { loading, error, data } = useQuery<
    PokemonByNameQuery,
    PokemonByNameVariables
  >({ query, variables });
  if (error) return <ErrorPage />;
  if (loading || !data) return <Loading />;
  const pokemon = data.pokemonByName;
  if (!pokemon) return <ErrorPage message="Pokemon not found" />;
  return (
    <Box mx="auto" width={600}>
      <Flex justifyContent="center" my={4}>
        <Card bg="white" borderRadius={4} border="3px solid #1A385E;">
          <Image my={3} p={3} src={pokemon.image} height={300} />
          <Box bg="#EF4846" p={3} color="#fff">
            <Text fontSize={5} my={2}>
              #{pokemon.number} {pokemon.name}
            </Text>
            <Text fontSize={3} my={2}>
              Type: {pokemon.types}
            </Text>
          </Box>
        </Card>
      </Flex>
      <Box>
        <Flex flexWrap="wrap" justifyContent="space-around">
          {pokemon.evolutions.map(evolution => (
            <Box key={evolution.id} width={1 / 3}>
              <Link to={`/${evolution.name}`}>
                <PokemonCard pokemon={evolution} />
              </Link>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

const query = gql`
  query PokemonByName($name: String!) {
    pokemonByName(name: $name) {
      id
      name
      image
      types
      number
      evolutions {
        ...PokemonCardFields
      }
    }
  }
  ${PokemonCard.fragment}
`;
