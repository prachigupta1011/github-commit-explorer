import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RepoView from "@/views/RepoView.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: HomeView },
        { path: "/repos/:username", name: "repos", component: RepoView, props: true }
    ]
});
