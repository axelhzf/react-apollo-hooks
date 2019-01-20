import { Card, Flex, Image, Text } from 'rebass';
import React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { PokemonCardFieldsFragment } from './generated/graphql';

export function PokemonCard(props: { pokemon: PokemonCardFieldsFragment }) {
  return (
    <Container m={2} borderRadius={4}>
      <Flex alignItems="center" px={2} py={5}>
        <Image src={props.pokemon.image} height={100} mx="auto" />
      </Flex>
      <Name py={20} textAlign="center" px={2}>
        #{props.pokemon.number} {props.pokemon.name}
      </Name>
    </Container>
  );
}

const Container = styled(Card)`
  background: #fff;
  border: 3px solid #1a385e;
`;

const Name = styled(Text)`
  background: #ef4846;
  color: #fff;
  text-decoration: none;
`;

PokemonCard.fragment = gql`
  fragment PokemonCardFields on Pokemon {
    id
    name
    number
    image
  }
`;
