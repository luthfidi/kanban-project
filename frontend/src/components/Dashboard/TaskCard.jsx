import React from 'react';
import { Box, Text, Badge, IconButton, HStack } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { format, parseISO } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const taskColors = {
  default: { bg: 'gray.100', hover: 'gray.200' },
  blue: { bg: 'blue.200', hover: 'blue.300' },
  green: { bg: 'green.200', hover: 'green.300' },
  purple: { bg: 'purple.200', hover: 'purple.300' },
  orange: { bg: 'orange.200', hover: 'orange.300' },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const colorScheme = taskColors[task.color || 'default'];

  const formatDueDate = (dateString) => {
    try {
      if (!dateString) return "No Due Date";
      const date = parseISO(dateString);
      return format(date, 'MMM dd');
    } catch (error) {
      return "No Due Date";
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={colorScheme.bg}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      _hover={{ boxShadow: "md", bg: colorScheme.hover }}
      className="task-card"
      position="relative"
    >
      <HStack justify="space-between" mb={2} {...attributes} {...listeners}>
        <Text fontWeight="semibold">{task.title}</Text>
        <HStack>
          <IconButton
            icon={<FiEdit2 />}
            variant="ghost"
            size="sm"
            aria-label="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          />
          <IconButton
            icon={<FiTrash2 />}
            variant="ghost"
            size="sm"
            aria-label="Delete task"
            color="red.500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          />
        </HStack>
      </HStack>

      <Text noOfLines={2} mb={2} color="gray.600" {...attributes} {...listeners}>
        {task.description}
      </Text>

      <HStack spacing={2} {...attributes} {...listeners}>
        {task.category && (
          <Badge colorScheme="red">{task.category}</Badge>
        )}
        <Badge colorScheme="red">
          Due: {formatDueDate(task.due_date)}
        </Badge>
      </HStack>
    </Box>
  );
};

export default TaskCard;