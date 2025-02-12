import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  useToast,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import * as taskService from '../../services/tasks';

const taskColors = {
  default: { bg: 'gray.100', hover: 'gray.200' },
  blue: { bg: 'blue.200', hover: 'blue.300' },
  green: { bg: 'green.200', hover: 'green.300' },
  purple: { bg: 'purple.200', hover: 'purple.300' },
  orange: { bg: 'orange.200', hover: 'orange.300' },
};

const ColorOption = ({ color, bg, isSelected, onClick }) => (
  <Button
    w="40px"
    h="40px"
    bg={bg}
    border="2px"
    borderColor={isSelected ? 'blue.500' : 'transparent'}
    borderRadius="md"
    onClick={() => onClick(color)}
    _hover={{ transform: 'scale(1.1)' }}
  />
);

const TaskForm = ({ isOpen, onClose, task = null, onTaskSaved }) => {
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Category: '',
    DueDate: '',
    Status: 'todo',
    Color: 'default',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (task) {
      let dueDateStr = '';
      if (task.due_date) {
        try {
          const date = new Date(task.due_date);
          if (!isNaN(date.getTime())) {
            dueDateStr = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error parsing task due date:', error);
        }
      }

      setFormData({
        Title: task.title || '',
        Description: task.description || '',
        Category: task.category || '',
        DueDate: dueDateStr,
        Status: task.status || 'todo',
        Color: task.color || 'default',
      });
    } else {
      // Reset form when opening a new task
      setFormData({
        Title: '',
        Description: '',
        Category: '',
        DueDate: '',
        Status: 'todo',
        Color: 'default',
      });
    }
  }, [task, isOpen]); // Added isOpen dependency to reset form when modal opens

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Title.trim()) {
      newErrors.Title = 'Title is required';
    }
    if (!formData.DueDate) {
      newErrors.DueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      Color: color,
    }));
  };

  const formatDateForGo = (dateString) => {
    if (!dateString) return null;
    
    // Parse input date (YYYY-MM-DD) and set time to midnight UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Format according to RFC3339
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Format data for backend
      const formattedData = {
        ...formData,
        DueDate: formData.DueDate ? formatDateForGo(formData.DueDate) : null
      };

      // Log for debugging
      console.log('Raw date from form:', formData.DueDate);
      console.log('Formatted date:', formattedData.DueDate);
      console.log('Submitting task data:', formattedData);

      let savedTask;
      if (task) {
        savedTask = await taskService.updateTask(task.id, formattedData);
      } else {
        savedTask = await taskService.createTask(formattedData);
      }

      toast({
        title: `Task ${task ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      onTaskSaved(savedTask);
      onClose();
    } catch (error) {
      console.error('Task operation error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${task ? 'update' : 'create'} task`,
        status: 'error',
        duration: 3000,
      });
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task ? 'Edit Task' : 'Create New Task'}</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.Title}>
              <FormLabel>Title</FormLabel>
              <Input
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.Title}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                name="Category"
                value={formData.Category}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Card Color</FormLabel>
              <HStack spacing={2}>
                {Object.entries(taskColors).map(([color, { bg }]) => (
                  <ColorOption
                    key={color}
                    color={color}
                    bg={bg}
                    isSelected={formData.Color === color}
                    onClick={handleColorSelect}
                  />
                ))}
              </HStack>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.DueDate}>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                name="DueDate"
                value={formData.DueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.DueDate}</FormErrorMessage>
            </FormControl>

            {task && (
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </Select>
              </FormControl>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
          >
            {task ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskForm;