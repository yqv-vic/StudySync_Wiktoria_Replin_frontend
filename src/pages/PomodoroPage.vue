<template>
    <div class="pomodoro-container">
  
      <!--timer-->
      <div class="timer-circle">
        <svg viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#334155"
            stroke-width="12"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#818cf8"
            stroke-width="12"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            class="progress"
          />
        </svg>
        <div class="timer-text">
          {{ formattedTime }}
        </div>
      </div>
  
      <!--current mode-->
      <h2 class="mode-text">
        {{ isBreak ? "Break" : "Focus" }}
      </h2>
  
      <!--controls-->
      <div class="controls">
        <button @click="toggleTimer">
          {{ running ? "Pause" : "Start" }}
        </button>
        <button @click="resetTimer">Reset</button>
      </div>
      <!--stats-->
      <div class="stats">
        <p><strong>Today</strong></p>
        <p>Focus sessions: {{ completedSessions }}</p>
        <p>Total focus time: {{ totalFocusMinutes }} min</p>
      </div>
      <!--ai-like recom-->
      <div v-if="recommendation" class="ai-box">
      💡 <strong>AI Recommendation</strong>
      <p>{{ recommendation }}</p>
    </div>


  
      <!--settings -->
      <div class="settings card">
        <h3>Settings</h3>
        <label>
          Focus (minutes)
          <input type="number" v-model.number="focusMinutes" min="1" />
        </label>
        <label>
          Short break (minutes)
          <input type="number" v-model.number="shortBreak" min="1" />
        </label>
        <label>
          Long break (minutes)
          <input type="number" v-model.number="longBreak" min="1" />
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="useLongBreak" />
          Enable long breaks
        </label>
        <label>
          Long break every (sessions)
          <input type="number" v-model.number="cyclesBeforeLong" min="1" />
        </label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onUnmounted } from "vue";
  import { getTasks } from "../api";

  const focusMinutes = ref(25);
  const shortBreak = ref(5);
  const longBreak = ref(15);
  const useLongBreak = ref(true);
  const cyclesBeforeLong = ref(4);
  const isBreak = ref(false);
  const sessionCount = ref(0);
  const timeLeft = ref(focusMinutes.value * 60);
  const running = ref(false);
  const completedSessions = ref(0);
  const totalFocusMinutes = ref(0);
  const lastSessionDate = ref(null);
  const tasks = ref([]);
  const recommendation = ref("");
  
  let interval = null;
  
  // timer formatting
  const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeLeft.value % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  });
  
  // progress
  const circumference = 2 * Math.PI * 90;
  const dashOffset = computed(() => {
    const total = (isBreak.value ? (useLongBreak.value && sessionCount.value % cyclesBeforeLong.value === 0 ? longBreak.value : shortBreak.value) : focusMinutes.value) * 60;
    return circumference - (timeLeft.value / total) * circumference;
  });
  
  // functions
  function toggleTimer() {
    if (running.value) {
      running.value = false;
      clearInterval(interval);
      return;
    }
    running.value = true;
    interval = setInterval(tick, 1000);
  }
  function resetTimer() {
    running.value = false;
    clearInterval(interval);
    isBreak.value = false;
    timeLeft.value = focusMinutes.value * 60;
  }
  function tick() {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      return;
    }
    // session finished
    if (!isBreak.value) {
      sessionCount.value++;
      completedSessions.value++;
      totalFocusMinutes.value += focusMinutes.value;
      saveStats();
      generateRecommendation(); // 👈 AI trigger
    }
    // switching mode
    if (isBreak.value) {
      // break - focus
      isBreak.value = false;
      timeLeft.value = focusMinutes.value * 60;
    } else {
      // focus - break
      isBreak.value = true;
      if (useLongBreak.value && sessionCount.value % cyclesBeforeLong.value === 0) {
        timeLeft.value = longBreak.value * 60;
      } else {
        timeLeft.value = shortBreak.value * 60;
      }
    }
  }

  function loadStats() {
    const saved = JSON.parse(localStorage.getItem("pomodoroStats"));
    const today = new Date().toDateString();
    if (saved && saved.date === today) {
      completedSessions.value = saved.completedSessions;
      totalFocusMinutes.value = saved.totalFocusMinutes;
    } else {
      completedSessions.value = 0;
      totalFocusMinutes.value = 0;
    }
  }
  
  onUnmounted(() => {
    clearInterval(interval);
  })
  loadStats();
  loadTasksForAI();

  function saveStats() {
    localStorage.setItem(
      "pomodoroStats",
      JSON.stringify({
        completedSessions: completedSessions.value,
        totalFocusMinutes: totalFocusMinutes.value,
        date: new Date().toDateString(),
      })
    );
  }
  async function loadTasksForAI() {
    try {
      const { data } = await getTasks();
      tasks.value = data.filter(t => t.status !== "DONE");
    } catch (err) {
      console.error("AI task load failed", err);
    }
  }

  function generateRecommendation() {
    if (tasks.value.length === 0) {
      recommendation.value = "Great job! You have no pending tasks 🎉";
      return;
    }
    const sorted = [...tasks.value].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const next = sorted[0];
    const due = next.dueDate
      ? new Date(next.dueDate).toLocaleDateString()
      : "no due date";

    recommendation.value = `You should work next on "${next.title}" (due ${due}).`;
  }

  </script>
  
  <style scoped>
  .pomodoro-container {
    max-width: 380px;
    margin: 0 auto;
    text-align: center;
    color: #e5e7eb;
  }
  .timer-circle {
    position: relative;
    width: 200px;
    margin: 2rem auto;
  }
  svg {
    width: 200px;
    height: 200px;
  }
  .progress {
    transition: stroke-dashoffset 0.2s linear;
  }
  .timer-text {
    position: absolute;
    top: 68px;
    left: 0;
    width: 100%;
    font-size: 2.4rem;
    font-weight: 600;
  }
  .mode-text {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  .controls button {
    margin: 0.4rem;
  }
  .settings {
    margin-top: 2rem;
    padding: 1rem;
  }
  .settings input[type="number"] {
    margin-top: 0.3rem;
    padding: 0.4rem;
    width: 100%;
    background: #020617;
    border: 1px solid #334155;
    border-radius: 0.4rem;
    color: #e5e7eb;
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .stats {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #cbd5e1;
  }
  .ai-box {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #020617;
    border: 1px solid #334155;
    color: #cbd5e1;
    font-size: 0.9rem;
  }

  </style>
  