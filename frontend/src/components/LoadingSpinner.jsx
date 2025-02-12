import React from 'react';
import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Flex
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
      background="white"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg" fontWeight="medium">
          Loading...
        </Text>
      </VStack>
    </Flex>
  );
};

export default LoadingSpinner;