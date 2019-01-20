import { useQuery } from '@axelhzf/react-apollo-hooks';
import { Box, Flex } from 'rebass';
import React from 'react';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { PokemonsQuery, PokemonsVariables } from './generated/graphql';
import styled from 'styled-components/macro';
import { PokemonCard } from './PokemonCard';
import { Loading } from './Loading';
import { ErrorPage } from './ErrorPage';

export function Pokemons() {
  const { loading, data, error } = useQuery<PokemonsQuery, PokemonsVariables>({
    query
  });
  if (loading || !data) return <Loading />;
  if (error) return <ErrorPage />;
  return (
    <Box mx="auto" width={900}>
      <Flex flexWrap="wrap">
        {data.pokemons!.map(pokemon => {
          return (
            <Box key={pokemon.id} width={1 / 3}>
              <CardLink to={`/${pokemon.name}`}>
                <PokemonCard pokemon={pokemon} />
              </CardLink>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

const CardLink = styled(Link)`
  text-decoration: none;
`;

const query = gql`
  query Pokemons {
    pokemons {
      ...PokemonCardFields
    }
  }
  ${PokemonCard.fragment}
`;
