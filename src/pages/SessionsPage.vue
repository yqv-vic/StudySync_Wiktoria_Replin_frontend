<template>
  <section class="card">
    <h2>Study Sessions</h2>

    <!--create session-->
    <form @submit.prevent="createSession" class="session-form">
      <label>
        Title
        <input v-model="form.title" required />
      </label>
      <label>
        Start time
        <input type="datetime-local" v-model="form.startTime" required />
      </label>
      <label>
        End time
        <input type="datetime-local" v-model="form.endTime" required />
      </label>
      <label>
        Mode
        <select v-model="form.mode">
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </label>
      <button type="submit">Create session</button>
    </form>

    <!-- sessions list -->
    <div v-if="loading">Loading sessions...</div>

    <ul v-else class="session-list">
      <li v-for="session in sessions" :key="session.id" class="session-item">
        <div>
          <strong>{{ session.title }}</strong>
          <div>
            {{ formatDate(session.startTime) }} →
            {{ formatDate(session.endTime) }}
          </div>
          <div>Mode: {{ session.mode || "—" }}</div>
        </div>
        <button @click="joinSession(session.id)">Join</button>
      </li>
      <li v-if="sessions.length === 0" class="empty">
        No sessions yet
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";

const sessions = ref([]);
const loading = ref(false);
const error = ref("");
const form = ref({
  title: "",
  startTime: "",
  endTime: "",
  mode: "ONLINE",
});

function formatDate(value) {
  return new Date(value).toLocaleString();
}

async function loadSessions() {
  loading.value = true;
  try {
    const { data } = await api.get("/sessions");
    sessions.value = data;
  } catch {
    error.value = "Failed to load sessions";
  } finally {
    loading.value = false;
  }
}
async function createSession() {
  try {
    await api.post("/sessions", {
      title: form.value.title,
      startTime: new Date(form.value.startTime).toISOString(),
      endTime: new Date(form.value.endTime).toISOString(),
      mode: form.value.mode,
    });
    form.value = {
      title: "",
      startTime: "",
      endTime: "",
      mode: "ONLINE",
    };
    loadSessions();
  } catch {
    error.value = "Failed to create session";
  }
}
async function joinSession(id) {
  try {
    await api.post(`/sessions/${id}/join`);
    alert("Joined session!");
  } catch {
    error.value = "Failed to join session";
  }
}

onMounted(loadSessions);
</script>

<style scoped>
.session-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.session-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.session-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #1f2937;
  border-radius: 0.75rem;
}
.empty {
  text-align: center;
  color: #9ca3af;
}
</style>
