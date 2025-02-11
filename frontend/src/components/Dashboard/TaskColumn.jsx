import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, status, onEditTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Box
      ref={setNodeRef}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      minH="70vh"
      className="shadow-md"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {title} ({tasks.length})
      </Text>
      <VStack spacing={4} align="stretch">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default TaskColumn;