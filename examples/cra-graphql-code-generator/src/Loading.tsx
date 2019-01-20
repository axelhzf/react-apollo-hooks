import React from 'react';
import { Flex, Text } from 'rebass';

export function Loading() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if (!show) return null;
  return (
    <Flex justifyContent="center" my={5}>
      <Text fontSize={3}>Loading...</Text>
    </Flex>
  );
}
