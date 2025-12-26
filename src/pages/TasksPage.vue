<template>
    <section class="card">
      <p class="welcome">
        Welcome, <strong>{{ user?.name }}</strong> 
      </p>
      <h2>Your Tasks</h2>
      <form @submit.prevent="handleCreateTask" class="task-form">
        <label>
          Title
          <input v-model="newTask.title" type="text" required />
        </label>
        <label>
          Subject
          <input v-model="newTask.subject" type="text" />
        </label>
        <label>
          Due date
          <input v-model="newTask.dueDate" type="datetime-local" />
        </label>
        <label>
          Type
          <select v-model="newTask.type">
            <option value="TASK">Task</option>
            <option value="EXAM">Exam</option>
            <option value="PROJECT">Project</option>
            <option value="MEETING">Meeting</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>
          Priority
          <select v-model="newTask.priority">
            <option :value="1">1 – Very High</option>
            <option :value="2">2 – High</option>
            <option :value="3">3 – Medium</option>
            <option :value="4">4 – Low</option>
            <option :value="5">5 – Very Low</option>
          </select>
        </label>
        <label>
          Description
          <textarea v-model="newTask.description" rows="2"></textarea>
        </label>
        <button type="submit" :disabled="creatingTask">
          {{ creatingTask ? "Adding..." : "Add task" }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
  
      <div v-if="tasksLoading" class="loading">Loading tasks...</div>
  
      <ul v-else class="task-list">
        <li v-if="tasks.length === 0" class="empty">
          No tasks yet. Add your first one
        </li>
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <div>
            <h3>{{ task.title }}</h3>
            <p v-if="task.subject"><strong>Subject:</strong> {{ task.subject }}</p>
            <p v-if="task.description"><strong>Description: </strong>{{ task.description }}</p>
            <p v-if="task.dueDate">
              <strong>Due:</strong> {{ formatDate(task.dueDate) }}
            </p>
            <p><strong>Type:</strong> {{ task.type }}</p>
            <p><strong>Priority:</strong> {{ task.priority }}</p>
          </div>
          <button @click="handleDeleteTask(task.id)">Delete</button>
        </li>
      </ul>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getTasks, createTask, deleteTask } from "../api";
  
  const user = JSON.parse(localStorage.getItem("user"));
  const tasks = ref([]);
  const newTask = ref({
    title: "",
    subject: "",
    dueDate: "",
    type: "",
    priority: "",
    description: "",
  });
  
  const tasksLoading = ref(false);
  const creatingTask = ref(false);
  const error = ref("");
  
  function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
  }
  
  async function loadTasks() {
    tasksLoading.value = true;
    try {
      const { data } = await getTasks();
      tasks.value = data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to load tasks";
    } finally {
      tasksLoading.value = false;
    }
  }
  
  async function handleCreateTask() {
    creatingTask.value = true;
    try {
      const payload = {
        title: newTask.value.title,
        subject: newTask.value.subject || null,
        description: newTask.value.description || null,
        dueDate: newTask.value.dueDate
          ? new Date(newTask.value.dueDate).toISOString()
          : null,
        type: newTask.value.type,
        priority: newTask.value.priority,
      };
      const { data } = await createTask(payload);
      tasks.value.unshift(data);
      newTask.value = { title: "", subject: "", dueDate: "", description: "" };
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to create task";
    } finally {
      creatingTask.value = false;
    }
  }
  
  async function handleDeleteTask(id) {
    try {
      await deleteTask(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete task";
    }
  }
  
  onMounted(loadTasks);
  </script>
  
  <style scoped>
  .welcome {
    font-size: 0.95rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  </style>
  