<template>
    <div class="card">
      <h2>Sign up</h2>
  
      <form @submit.prevent="handleSignup">
        <label>
          Name
          <input v-model="form.name" type="text" required />
        </label>
        <label>
          Email
          <input v-model="form.email" type="email" required />
        </label>
        <label>
          Password
          <input v-model="form.password" type="password" required />
        </label>
        <button type="submit" :disabled="loading">
          {{ loading ? "Creating account..." : "Sign up" }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
  
      <p class="hint">
        Already have an account?
        <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import api from "../api";
  
  const router = useRouter();
  const loading = ref(false);
  const error = ref("");
  
  const form = ref({
    name: "",
    email: "",
    password: "",
  });
  
  async function handleSignup() {
    loading.value = true;
    error.value = "";

    try {
        const { data } = await api.post("/auth/register", form.value);

        // sstore user
        localStorage.setItem("user", JSON.stringify(data));

        // redirect to login
        router.push("/login");
    } catch (err) {
        error.value = err.response?.data?.error || "Signup failed";
    } finally {
        loading.value = false;
    }
    }
  </script>
  
  