import React from 'react';
import { Flex, Text } from 'rebass';

export function ErrorPage(props: { message?: string }) {
  return (
    <Flex alignItems="center" my={5} flexDirection={'column'}>
      <Text fontSize={7}> 😭</Text>
      <Text fontSize={5} color="#EF4846">
        {props.message || 'There was an error'}
      </Text>
    </Flex>
  );
}
