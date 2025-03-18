<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getPosts } from "@/services/posts";
import { useRouter } from "vue-router";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import Swal from 'sweetalert2';
import { updateUser, deleteUser } from "@/services/users";

const posts = ref([]);
const user = ref<{ id: number; firstname: string; lastname: string; avatar?: string; email?: string } | null>(null);
const router = useRouter();
const isLoading = ref(true);
const isDeleting = ref(false);
const showEditModal = ref(false);

const editForm = ref({ 
  firstname: '',
  lastname: '',
  email: '',
  password: ''
});

const fetchUserPosts = async () => {
  try {
    const res = await getPosts();
    if (res?.status === 200 && res.data?.result?.data) {
      posts.value = res.data.result.data
          .map(post => ({
            ...post,
            image: post.content?.data?.image,
            created_at: post.created_at || new Date().toISOString(),
          }))
          .filter(post => {
            const postUserId = post.user?.id;
            const postImage = post.content?.data?.image;
            return Number(postUserId) === Number(user.value?.id) && postImage;
          });
    }
  } catch (error) {
    
  }
};

const deletePost = async (postId: number) => {
  if (isDeleting.value) return;

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  isDeleting.value = true;
  try {
    const token = localStorage.getItem("token") || '';
    if (!token) {
      await Swal.fire('Error', 'Please log in to delete posts.', 'error');
      router.push("/login");
      return;
    }

    const response = await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (response.status === 200 || response.status === 204) {
      posts.value = posts.value.filter(post => post.id !== postId);
      await Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error: any) {
    let errorMessage = "Failed to delete post. Please try again.";
    if (error.response) {
      errorMessage = `Error ${error.response.status}: ${error.response.data.message || "Could not delete post"}`;
    } else if (error.request) {
      errorMessage = "Network error: Could not reach the server.";
    } else {
      errorMessage = `Request error: ${error.message}`;
    }
    await Swal.fire('Error', errorMessage, 'error');
  } finally {
    isDeleting.value = false;
  }
};

const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token") || '';
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (response.headers['content-type'].includes('text/html')) {
      throw new Error("Invalid response from /api/user");
    }

    user.value = response.data.result;
    localStorage.setItem("user", JSON.stringify(user.value));
  } catch (error) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    } else {
      router.push("/login");
    }
  } finally {
    isLoading.value = false;
  }
};

const getTimeAgo = (timestamp: string): string => {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  return !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : "Just now";
};

const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  user.value = null;
  router.push("/login");
};

const goBack = () => {
  router.push("/");
};

const applyDarkMode = () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.documentElement.classList.toggle("dark", isDark);
};

const openEditModal = () => {
  if (user.value) {
    editForm.value = {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email || '',
      password: ''
    };
    showEditModal.value = true;
  }
};

const saveChanges = async () => {
  if (!user.value?.id) return;

  try {
    const response = await updateUser(editForm.value, user.value.id);
    if (response) {
      user.value = { ...user.value, ...editForm.value, password: undefined };
      localStorage.setItem("user", JSON.stringify(user.value));
      showEditModal.value = false;
      await Swal.fire('Success', 'Profile updated successfully', 'success');
    }
  } catch (error) {
    await Swal.fire('Error', 'Failed to update profile', 'error');
  }
};

const deleteAccount = async () => {
  if (!user.value?.id) return;

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This will permanently delete your account!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await deleteUser(user.value.id);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      await Swal.fire('Deleted', 'Your account has been deleted', 'success');
      router.push("/login");
    } catch (error) {
      await Swal.fire('Error', 'Failed to delete account', 'error');
    }
  }
};

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser || (typeof storedUser === 'string' && storedUser.includes('<!DOCTYPE html>'))) {
    localStorage.removeItem("user");
    router.push("/login");
    return;
  }
  user.value = JSON.parse(storedUser);
  applyDarkMode();
  await fetchUser();
  if (!user.value?.id) {
    router.push("/login");
    return;
  }
  await fetchUserPosts();
});
</script>

<template>
  <div class="profile-container min-h-screen bg-gray-100 dark:bg-black">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-black shadow-sm">
      <button @click="goBack" class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-medium text-gray-900 dark:text-white">Profile</h1>
      <button @click="logoutUser" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
        Log Out
      </button>
    </header>

    <!-- Profile Section -->
    <section class="px-6 py-8 mx-auto max-w-4xl">
      <div class="flex flex-col items-center bg-white dark:bg-black rounded-xl shadow-md p-6">
        <img
            :src="user?.avatar || 'http://lilithaengineering.co.za/wp-content/uploads/2017/08/person-placeholder.jpg'"
            alt="User Avatar"
            class="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover shadow-sm"
        />
        <div v-if="isLoading" class="mt-4">
          <p class="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
        </div>
        <div v-else class="flex items-center gap-4 mt-4">
          <h2 v-if="user?.firstname && user?.lastname" class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ user.firstname }} {{ user.lastname }}
          </h2>
          <h2 v-else class="text-2xl font-semibold text-gray-500 dark:text-gray-400">
            Name unavailable
          </h2>
          <button
              @click="openEditModal"
              class="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Edit Modal with Dynamic Background -->
    <transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-white dark:bg-black p-8 rounded-3xl shadow-2xl w-full max-w-md border border-opacity-30 border-purple-500 dark:border-indigo-500 transform transition-all duration-500 scale-100 hover:scale-105">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Edit Your Profile</h3>
          <div class="space-y-6">
            <div class="relative">
              <input
                  v-model="editForm.firstname"
                  type="text"
                  placeholder="First Name"
                  class="w-full p-4 pl-12 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="relative">
              <input
                  v-model="editForm.lastname"
                  type="text"
                  placeholder="Last Name"
                  class="w-full p-4 pl-12 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="relative">
              <input
                  v-model="editForm.email"
                  type="email"
                  placeholder="Email"
                  class="w-full p-4 pl-12 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <div class="relative">
              <input
                  v-model="editForm.password"
                  type="password"
                  placeholder="New Password (optional)"
                  class="w-full p-4 pl-12 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.657 0-3 1.343-3 3v1h6v-1c0-1.657-1.343-3-3-3zm7-5h-1V6c0-2.761-2.239-5-5-5H7C4.239 1 2 3.239 2 6v2H1v4h1v2c0 2.761 2.239 5 5 5h6c2.761 0 5-2.239 5-5v-2h1V8z" />
              </svg>
            </div>
          </div>
          <div class="flex justify-between mt-8 gap-2">
            <button
                @click="saveChanges"
                class="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save
            </button>
            <button
                @click="deleteAccount"
                class="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Delete
            </button>
            <button
                @click="showEditModal = false"
                class="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Posts Grid -->
    <section class="px-6 pb-12 mx-auto max-w-4xl">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Image Posts</h3>
      <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading posts...</div>
      <div v-else-if="posts.length > 0" class="grid grid-cols-3 gap-2">
        <div v-for="post in posts" :key="post.id" class="post-card group relative overflow-hidden rounded-lg aspect-square">
          <img
              :src="'http://127.0.0.1:8000/storage/' + post.image"
              alt="Post image"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span class="text-white text-sm">{{ getTimeAgo(post.created_at) }}</span>
          </div>
          <button
              @click="deletePost(post.id)"
              :disabled="isDeleting"
              class="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-500 dark:text-gray-400">No posts with images yet.</p>
    </section>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
  margin: 0 auto;
}

.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.rounded-full { border-radius: 9999px; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-3xl { border-radius: 1.5rem; }
.rounded-lg { border-radius: 0.5rem; }

.post-card {
  position: relative;
}

.post-card img {
  transition: transform 0.3s ease;
}

.post-card:hover img {
  transform: scale(1.05);
}

button {
  transition: all 0.3s ease;
}

/* Light Mode Styles */
.bg-gray-100 { background-color: #f9fafb; }
.bg-white { background-color: #ffffff; }
.bg-gray-800 { background-color: #1f2937; }
.bg-gray-700 { background-color: #374151; }
.text-gray-900 { color: #1f2937; }
.text-gray-500 { color: #6b7280; }
.text-gray-400 { color: #9ca3af; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-300 { border-color: #d1d5db; }
.border-gray-700 { border-color: #374151; }

/* Dark Mode Styles */
.dark .bg-gray-100 { background-color: #000000; }
.dark .bg-white { background-color: #000000; }
.dark .bg-gray-800 { background-color: #1f2937; }
.dark .bg-gray-700 { background-color: #374151; }
.dark .text-gray-900 { color: #ffffff; }
.dark .text-gray-500 { color: #6b7280; }
.dark .text-gray-400 { color: #9ca3af; }
.dark .border-gray-200 { border-color: #374151; }
.dark .border-gray-300 { border-color: #4b5563; }
.dark .border-gray-700 { border-color: #4b5563; }

/* Modal Animation */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-to, .modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); gap: 1px; }
  .px-6 { padding-left: 1rem; padding-right: 1rem; }
}

@media (max-width: 640px) {
  .text-2xl { font-size: 1.5rem; }
  .w-32 { width: 6rem; height: 6rem; }
}

.post-card .delete-button {
  transition: opacity 0.3s ease;
}

.post-card:hover .delete-button {
  opacity: 1;
}
</style>