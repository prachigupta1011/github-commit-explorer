<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const error = ref("");
const router = useRouter();

function search() {
  if (!username.value.trim()) {
    error.value = "Required";
    return;
  }

  router.push(`/repos/${username.value}`);
}
</script>

<template>
  <div class="p-10 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">GitHub Explorer</h1>

    <input
        v-model="username"
        class="border p-2 w-full mb-3"
        placeholder="GitHub username"
    />

    <button
        @click="search"
        class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Search
    </button>

    <p class="text-red-600 mt-2" v-if="error">
      {{ error }}
    </p>
  </div>
</template>
