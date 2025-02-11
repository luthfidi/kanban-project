import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';

const Container = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Container;