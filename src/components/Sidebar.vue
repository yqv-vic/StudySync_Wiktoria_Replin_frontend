<template>
  <aside class="sidebar">
    <h2 class="logo">StudySync</h2>
    <nav>
      <RouterLink to="/tasks" class="link">Tasks</RouterLink>
      <RouterLink to="/pomodoro" class="link">Pomodoro</RouterLink>
      <RouterLink to="/sessions" class="link">Sessions</RouterLink>
      <RouterLink to="/ai" class="link">AI Helper</RouterLink>
      <!--admin-->
      <RouterLink
        v-if="user?.role === 'ADMIN'"
        to="/admin"
        class="link">
        Admin
      </RouterLink>
      <!--logout -->
      <button class="link logout" @click="handleLogout">
        Logout
      </button>
    </nav>
  </aside>
</template>

<script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));
  
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  }
  </script>
  
<style scoped>
.sidebar {
  width: 220px;
  background: #020617;
  border-right: 1px solid #1f2937;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e5e7eb;
}
.link {
  display: block;
  margin-bottom: 1rem;
  color: #cbd5e1;
  text-decoration: none;
}
.link.router-link-active {
  color: #818cf8;
  font-weight: 600;
}
.logout {
  margin-top: 2rem;
  color: #fca5a5;
}
</style>
