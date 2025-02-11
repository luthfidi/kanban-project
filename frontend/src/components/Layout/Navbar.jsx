import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuButton as ChakraMenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} px={4} shadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            Kanban Board
          </Text>

          <Menu>
            <ChakraMenuButton
              as={Button}
              variant="ghost"
              rightIcon={<FiChevronDown />}
              padding={2}
            >
              <Flex alignItems="center">
                <Avatar
                  size="sm"
                  name={user?.name}
                  marginRight={2}
                />
                <Text>{user?.name}</Text>
              </Flex>
            </ChakraMenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
