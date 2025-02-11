import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Create Account</Heading>
            <Text color="gray.600">
              Get started with your Kanban Board account
            </Text>
          </Box>
          
          <Box 
            bg="white" 
            p={8} 
            borderRadius="xl" 
            boxShadow="lg"
          >
            <RegisterForm />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Register;