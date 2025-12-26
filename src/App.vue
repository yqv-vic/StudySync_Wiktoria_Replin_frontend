<!--structure was chatgpt generated-->
<template>
  <div class="layout">
    <Sidebar v-if="showSidebar" />

    <main class="content">

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();

// sidebar
const showSidebar = computed(() => {
  return route.path !== "/login" && route.path !== "/signup";
});
// welcome message
const user = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});
</script>

<style>
/* global styles */

body, html, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}
.layout {
  display: flex;
  min-height: 100vh;
}
.content {
  flex: 1;
  padding: 2rem;
}
.topbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.card {
  background: #020617;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.85);
  border: 1px solid #1f2937;
  max-width: 900px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
input,
textarea {
  background: #020617;
  border-radius: 0.5rem;
  border: 1px solid #4b5563;
  padding: 0.5rem 0.75rem;
  color: inherit;
  font: inherit;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 1px #818cf8;
}
button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #6366f1;
  color: white;
  font-weight: 600;
}

.error {
  color: #fca5a5;
}
</style>
