<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/store/githubStore";
import CommitDetails from "@/components/CommitDetails.vue";

const route = useRoute();
const username = route.params.username as string;

const store = useGithubStore();

// Selected repository (null initially)
const selectedRepo = ref<string | null>(null);

// Pagination and sorting
const page = ref(1);
const sortOrder = ref("newest");

// Load repositories on page mount
onMounted(() => {
  store.fetchRepos(username);
});

// When a user clicks a repo
function load(repo: string) {
  console.log("LOAD CALLED WITH:", repo);
  selectedRepo.value = repo;
  page.value = 1; // Reset page when repo changes
  store.fetchCommits(username, repo, page.value);
}

// Load next page of commits
function loadMore() {
  page.value++;
  store.fetchCommits(username, selectedRepo.value!, page.value);
}

// Sorted commit list
const sortedCommits = computed(() =>
    [...store.commits].sort((a, b) => {
      const d1 = new Date(a.commit.author.date).getTime();
      const d2 = new Date(b.commit.author.date).getTime();
      return sortOrder.value === "newest" ? d2 - d1 : d1 - d2;
    })
);

function openDetails(c: any) {
  // Extract repo name directly from GitHub commit API URL
  const repoName = c.url.split("/")[6];

  console.log("Repo extracted:", repoName);

  store.fetchCommitDetails(username, selectedRepo.value, c.sha);
}

</script>

<template>
  <div class="p-6 space-y-6">

    <!-- Title -->
    <h2 class="text-2xl font-bold text-gray-800">
      Repositories for <span class="text-blue-600">{{ username }}</span>
    </h2>

    <!-- Repo Errors -->
    <p class="text-red-600" v-if="store.error">{{ store.error }}</p>

    <!-- Repositories List -->
    <div class="grid gap-3 md:grid-cols-2">
      <button
          v-for="r in store.repos"
          :key="r.id"
          @click="load(r.name)"
          class="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md text-left transition"
      >
        <h3 class="font-semibold text-lg text-gray-900">{{ r.name }}</h3>
        <p class="text-gray-600">{{ r.description }}</p>
      </button>
    </div>

    <!-- Commits Section -->
    <div v-if="selectedRepo" class="mt-10 space-y-6">

      <!-- Section Title -->
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">
          Commits in <span class="text-blue-600">{{ selectedRepo }}</span>
        </h3>

        <!-- Sorting -->
        <select
            v-model="sortOrder"
            class="border p-2 rounded-lg"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <!-- Commits List -->
      <div class="space-y-4">
        <div
            v-for="c in sortedCommits"
            :key="c.sha"
            class="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800">{{ c.commit.message }}</p>
              <p class="text-gray-500 text-sm">
                {{ c.commit.author.name }} — {{ c.commit.author.date }}
              </p>
            </div>

            <div class="flex gap-2">
              <!-- Add to Favourite -->
              <button
                  @click="store.addFavourite(c)"
                  class="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200"
              >
                ⭐ Fav
              </button>

              <!-- Remove Fav -->
              <button
                  @click="store.removeFavourite(c.sha)"
                  class="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200"
              >
                ❌
              </button>

              <!-- Details -->
              <button
                  @click="openDetails(c)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div class="text-center">
        <button
            @click="loadMore"
            class="px-5 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 shadow"
        >
          Load More
        </button>
      </div>

      <!-- Favourite Commits Section -->
      <div class="mt-10">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">⭐ Favourite Commits</h3>

        <div v-if="store.favourites.length === 0" class="text-gray-500">
          No favourite commits added yet.
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div
              v-for="f in store.favourites"
              :key="f.sha"
              class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm relative"
          >
            <button
                @click="store.removeFavourite(f.sha)"
                class="absolute top-2 right-2 text-red-600 text-lg hover:text-red-800"
            >
              ✖
            </button>

            <p class="font-medium text-gray-800">{{ f.message }}</p>
            <p class="text-gray-500 text-sm">SHA: {{ f.sha }}</p>
          </div>
        </div>
      </div>

      <!-- Commit Details Section -->
      <div v-if="store.commitDetails" class="mt-10 p-6 bg-white border rounded-2xl shadow-lg">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Commit Details</h3>

        <p class="text-gray-700 mb-3">
          <strong>Total Changes:</strong> {{ store.commitDetails.stats.total }}
        </p>

        <p class="text-green-700 mb-1">
          <strong>Additions:</strong> +{{ store.commitDetails.stats.additions }}
        </p>

        <p class="text-red-700 mb-4">
          <strong>Deletions:</strong> -{{ store.commitDetails.stats.deletions }}
        </p>

        <div class="space-y-5">
          <div
              v-for="file in store.commitDetails.files"
              :key="file.filename"
              class="p-4 bg-gray-50 border rounded-xl"
          >
            <h4 class="font-semibold text-gray-900 mb-2">
              📄 {{ file.filename }}
            </h4>

            <p class="text-green-700">+{{ file.additions }} additions</p>
            <p class="text-red-700">-{{ file.deletions }} deletions</p>

            <!-- Code Patch -->
            <pre class="mt-3 p-3 bg-black text-green-300 rounded-lg overflow-auto text-sm leading-relaxed">
{{ file.patch }}
            </pre>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
