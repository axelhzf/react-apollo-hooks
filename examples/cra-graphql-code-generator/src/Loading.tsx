import React from 'react';
import { Flex, Text } from 'rebass';

export function Loading() {
  return (
    <Flex justifyContent="center" my={5}>
      <Text fontSize={3}>Loading...</Text>
    </Flex>
  );
}
