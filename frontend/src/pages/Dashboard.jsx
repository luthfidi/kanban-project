import React, { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  HStack,
  useDisclosure,
  Container,
  Text,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import KanbanBoard from '../components/Dashboard/KanbanBoard';
import TaskForm from '../components/Dashboard/TaskForm';
import { useAuth } from '../contexts/AuthContext';
import * as taskService from '../services/tasks';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  const handleOpenTaskForm = (task = null) => {
    setSelectedTask(task);
    onOpen();
  };

  const handleTaskSaved = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedTask(null);
    onClose();
    toast({
      title: 'Success',
      description: `Task ${selectedTask ? 'updated' : 'created'} successfully`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setRefreshKey(prev => prev + 1);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={8}>
          <Box>
            <Heading size="lg">Welcome, {user?.name}</Heading>
            <Text color="gray.600" mt={1}>
              Manage your tasks efficiently with Kanban Board
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() => handleOpenTaskForm()}
          >
            New Task
          </Button>
        </HStack>

        <Box>
          <KanbanBoard
            refreshKey={refreshKey}
            onEditTask={handleOpenTaskForm}
            onDeleteTask={handleDeleteTask}
          />
        </Box>

        <TaskForm
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskSaved={handleTaskSaved}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;