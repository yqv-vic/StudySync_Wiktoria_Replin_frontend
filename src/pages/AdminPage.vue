<template>
    <section class="card">
      <h2>Admin Dashboard</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.email }} ({{ user.role }})
          <button
            v-if="user.role !== 'ADMIN'"
            @click="deleteUser(user.id)">
            Delete
          </button>
        </li>
      </ul>
      <p v-if="error" class="error">{{ error }}</p>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import api from "../api";
  
  const users = ref([]);
  const error = ref("");
  
  async function loadUsers() {
    try {
      const { data } = await api.get("/admin/users");
      users.value = data;
    } catch {
      error.value = "Access denied";
    }
  }
  async function deleteUser(id) {
    try {
      await api.delete(`/admin/users/${id}`);
      users.value = users.value.filter(u => u.id !== id);
    } catch {
      error.value = "Failed to delete user";
    }
  }
  
  onMounted(loadUsers);
  </script>
  