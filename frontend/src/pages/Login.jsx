import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Welcome Back</Heading>
            <Text color="gray.600">
              Sign in to continue to your Kanban Board
            </Text>
          </Box>
          
          <Box 
            bg="white" 
            p={8} 
            borderRadius="xl" 
            boxShadow="lg"
          >
            <LoginForm />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;