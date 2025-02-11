import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box, Grid, useToast } from '@chakra-ui/react';
import TaskColumn from './TaskColumn';
import TaskForm from './TaskForm';  // Import TaskForm
import * as taskService from '../../services/tasks';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const updatedTask = tasks.find(task => task.id === taskId);
    if (updatedTask.status === newStatus) return;

    try {
      await taskService.updateTask(taskId, { ...updatedTask, status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
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

  const handleTaskSaved = () => {
    fetchTasks();
    setSelectedTask(null);
  };

  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done'),
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          p={4}
        >
          <TaskColumn
            title="To Do"
            tasks={groupedTasks.todo}
            status="todo"
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={groupedTasks.in_progress}
            status="in_progress"
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Done"
            tasks={groupedTasks.done}
            status="done"
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </Grid>
      </DndContext>

      <TaskForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskSaved={handleTaskSaved}
      />
    </>
  );
};

export default KanbanBoard;