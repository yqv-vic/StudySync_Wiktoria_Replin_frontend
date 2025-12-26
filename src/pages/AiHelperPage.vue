<template>
    <section class="card">
      <h2>AI Study Helper</h2>
  
      <!--study tips-->
      <label>
        What do you need to study?
        <textarea v-model="tipsInput" rows="3" />
      </label>
      <button @click="getTips">Generate study tips</button>
      <pre v-if="tipsResult">{{ tipsResult }}</pre>
      <hr />
  
      <!--notes summary-->
      <h3>Notes Summariser</h3>
      <label>
        Paste your notes
        <textarea v-model="summaryInput" rows="4" />
      </label>
      <button @click="summarise">Summarise notes</button>
      <pre v-if="summaryResult">{{ summaryResult }}</pre>
    </section>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import api from "../api";
  
  const tipsInput = ref("");
  const summaryInput = ref("");
  const tipsResult = ref("");
  const summaryResult = ref("");
  
  async function getTips() {
    const { data } = await api.post("/ai/study-helper", {
      text: tipsInput.value,
      mode: "tips",
    });
    tipsResult.value = data.result;
  }
  
  async function summarise() {
    const { data } = await api.post("/ai/study-helper", {
      text: summaryInput.value,
      mode: "summary",
    });
    summaryResult.value = data.result;
  }
  </script>
  