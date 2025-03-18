
<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; 


defineProps<{ 
  goToProfile: () => void;
  toggleMessagesModal: () => void;
  toggleSettingsModal: () => void;
  logoutUser: () => Promise<void>;
}>();

const router = useRouter();


const goToHome = () => {
  router.push('/'); 
};
</script>

<template>
  <aside
    class="hidden md:flex flex-col w-1/5 bg-white dark:bg-black shadow-xl p-6 fixed top-0 left-0 h-full transition-all duration-300"
  >
    
    <div class="flex items-center mb-8 cursor-pointer" @click="goToHome">
      <img
        src="/logo.png"
        alt="Logo"
        class="w-12 h-12 mr-3 object-contain transition-transform duration-300 hover:scale-105"
      />
      <h1 class="text-3xl text-gray-900 dark:text-white font-fancy tracking-wider">LaVue</h1>
    </div>

    
    <nav class="mt-8 space-y-4 flex-1">
      <button
        @click="goToProfile"
        class="flex items-center w-full p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-white rounded-lg transition-all duration-200 group"
      >
        <svg
          class="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Profile
      </button>
      <button
        @click="toggleMessagesModal"
        class="flex items-center w-full p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-white rounded-lg transition-all duration-200 group"
      >
        <svg
          class="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        Messages
      </button>
      <button
        @click="toggleSettingsModal"
        class="flex items-center w-full p-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-white rounded-lg transition-all duration-200 group"
      >
        <svg
          class="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Settings
      </button>
    </nav>

    
    <button
      @click="logoutUser"
      class="flex items-center w-full p-3 mt-auto text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 group shadow-md hover:shadow-lg"
    >
      <svg
        class="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
      </svg>
      Log out
    </button>
  </aside>
</template>

<style scoped>
.font-fancy {
  font-family: 'Billabong', 'Dancing Script', cursive; 
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

.cursor-pointer {
  cursor: pointer;
}

aside {
  box-shadow: 0 4px 15px rgba(216, 212, 212, 0.2);
}

.bg-gradient-to-b {
  background: linear-gradient(to bottom, #f9fafb, #e5e7eb);
}

.text-gray-300 {
  color: #6b7280;
}

.hover\:bg-indigo-600:hover {
  background-color: #4f46e5;
}

.bg-red-900 {
  background-color: #991b1b;
}

.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}

.dark .bg-gradient-to-b {
  background: linear-gradient(to bottom, #bdc0c5, #959697);
}

.dark .text-gray-300 {
  color: #9ca3af;
}

.dark .hover\:bg-indigo-600:hover {
  background-color: #6366f1;
}

.dark .bg-red-900 {
  background-color: #7f1d1d;
}

.dark .hover\:bg-red-700:hover {
  background-color: #991b1b;
}

button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

.flex-1 {
  flex: 1 1 0%;
}

.mt-auto {
  margin-top: auto;
}
</style>