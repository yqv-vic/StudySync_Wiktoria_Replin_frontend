<template>
    <div class="card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <label>
          Email
          <input v-model="loginForm.email" type="email" required />
        </label>
  
        <label>
          Password
          <input v-model="loginForm.password" type="password" required />
        </label>
  
        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
  
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <p class="hint">
        Don’t have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { login as apiLogin } from "../api";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const loading = ref(false);
  const error = ref("");
  const exampleEmail = "wiktoria.test@example.com";
  
  const loginForm = ref({
    email: "",
    password: "",
  });
  
  async function handleLogin() {
    loading.value = true;
    error.value = "";
  
    try {
      const { data } = await apiLogin({
        email: loginForm.value.email,
        password: loginForm.value.password,
      });
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      router.push("/tasks");
    } catch (err) {
      error.value = err.response?.data?.error || "Login failed";
    } finally {
      loading.value = false;
    }
  }
  </script>
  