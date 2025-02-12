import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Grid, useToast } from '@chakra-ui/react';
import TaskColumn from './TaskColumn';
import * as taskService from '../../services/tasks';

const KanbanBoard = ({ refreshKey, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState([]);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]); // Menggunakan refreshKey dari props

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
      const result = await taskService.updateTask(taskId, { 
        ...updatedTask, 
        Status: newStatus,
        DueDate: updatedTask.due_date // Pastikan tanggal tetap terkirim
      });
      
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

  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done'),
  };

  return (
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
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={groupedTasks.in_progress}
          status="in_progress"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <TaskColumn
          title="Done"
          tasks={groupedTasks.done}
          status="done"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </Grid>
    </DndContext>
  );
};

export default KanbanBoard;