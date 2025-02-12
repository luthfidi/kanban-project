import React from "react";
import { Box, Text, Badge, IconButton, HStack } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const taskColors = {
  default: { bg: "gray.100", hover: "gray.200" },
  blue: { bg: "blue.200", hover: "blue.300" },
  green: { bg: "green.200", hover: "green.300" },
  purple: { bg: "purple.200", hover: "purple.300" },
  orange: { bg: "orange.200", hover: "orange.300" },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const colorScheme = taskColors[task.color || "default"];

  const formatDueDate = (dateString) => {
    if (!dateString) return "No Due Date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "DUE: JAN 01, 0001";
      
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString().padStart(4, '0');
      
      return `DUE: ${month} ${day}, ${year}`;
    } catch (error) {
      return "DUE: JAN 01, 0001";
    }
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      bg={colorScheme.bg}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      _hover={{ boxShadow: "md", bg: colorScheme.hover }}
      className="task-card"
      position="relative"
      cursor="grab"
    >
      <Box position="relative">
        <Box pr={16} mb={1} maxWidth="100%" wordBreak="break-word" whiteSpace="normal">
          <Text fontWeight="semibold">{task.title}</Text>
        </Box>
        <Box>
          <Text
            noOfLines={2}
            mb={2}
            color="gray.600"
            maxWidth="100%"
            wordBreak="break-word"
            whiteSpace="normal"
          >
            {task.description}
          </Text>
          <HStack spacing={2} wrap="wrap">
            {task.category && (
              <Badge 
                colorScheme="red" 
                bg="red.400"
                color="gray.100"
              >
                {task.category.toUpperCase()}
              </Badge>
            )}
            <Badge 
              colorScheme="red"
              bg="red.400"
              color="gray.100"
            >
              {formatDueDate(task.due_date)}
            </Badge>
          </HStack>
        </Box>
        <HStack 
          position="absolute" 
          top={0} 
          right={0} 
          spacing={1}
          onClick={e => e.stopPropagation()}
        >
          <IconButton
            icon={<FiEdit2 />}
            variant="ghost"
            size="sm"
            aria-label="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            cursor="pointer"
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
            onPointerDown={(e) => e.stopPropagation()}
            cursor="pointer"
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default TaskCard;