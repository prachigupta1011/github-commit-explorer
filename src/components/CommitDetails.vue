<script setup lang="ts">
import type { CommitDetails } from "@/types/github";

defineProps<{ details: CommitDetails }>();
</script>

<template>
  <div>
    <h4>Commit Details</h4>

    <p>Total changes: {{ details.stats.total }}</p>
    <p>Additions: {{ details.stats.additions }}</p>
    <p>Deletions: {{ details.stats.deletions }}</p>

    <div v-for="file in details.files" :key="file.filename">
      <h5>{{ file.filename }}</h5>
      <p>+{{ file.additions }} / -{{ file.deletions }}</p>
      <pre>{{ file.patch }}</pre>
    </div>
  </div>
</template>
