<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const props = defineProps<{
  showModal: boolean;
  receivedMessages: {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
  }[];
}>();

const emit = defineEmits(["close"]);

const messageContent = ref("");
const messages = ref<
  { id: number; sender: string; content: string; timestamp: string }[]
>([]);
const isLoading = ref(false);

const fakeMessages = [
  {
    id: 1,
    sender: "Alex Carter",
    content:
      "Hey, loved your recent project update! Can we discuss some collaboration ideas?",
    timestamp: "2025-02-24T09:15:00Z",
  },
  {
    id: 2,
    sender: "Sophie Nguyen",
    content:
      "Great work on the design prototype. Could you share the specs with me?",
    timestamp: "2025-02-23T14:30:00Z",
  },
  {
    id: 3,
    sender: "Liam Brooks",
    content: "Quick question: Are you attending the conference next month?",
    timestamp: "2025-02-22T17:45:00Z",
  },
  {
    id: 4,
    sender: "Emma Davis",
    content:
      "Your latest post was inspiring! Let’s connect for a potential feature.",
    timestamp: "2025-02-21T11:20:00Z",
  },
  {
    id: 5,
    sender: "Noah Patel",
    content:
      "Thanks for the feedback on my draft. Can we schedule a follow-up?",
    timestamp: "2025-02-20T13:10:00Z",
  },
  {
    id: 6,
    sender: "Olivia Kim",
    content:
      "Hi! Your portfolio is impressive—any tips for a newbie in the field?",
    timestamp: "2025-02-19T08:55:00Z",
  },
];

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

  if (isNaN(time.getTime())) return "Invalid date";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(time);
};

const closeModal = () => {
  emit("close");
};

watch(
  () => props.receivedMessages,
  (newMessages) => {
    if (newMessages && newMessages.length > 0) {
      messages.value = newMessages;
    }
  },
  { immediate: true }
);

onMounted(() => {
  messages.value = fakeMessages;
});
</script>

<template>
  <transition name="modal">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300"
      >
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <h2
            class="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center"
          >
            <svg
              class="w-6 h-6 mr-2 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Messages
          </h2>
          <button
            @click="closeModal"
            class="p-1 text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          class="flex-1 max-h-[60vh] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        >
          <div
            v-if="isLoading"
            class="text-center text-gray-500 dark:text-gray-400 animate-pulse"
          >
            Loading messages...
          </div>
          <div
            v-else-if="messages.length === 0"
            class="text-center text-gray-500 dark:text-gray-400"
          >
            No messages yet.
          </div>
          <div
            v-else
            v-for="message in messages"
            :key="message.id"
            class="group flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-200"
          >
            <img
              class="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 shadow-sm"
              src="http://lilithaengineering.co.za/wp-content/uploads/2017/08/person-placeholder.jpg"
              alt="Sender Avatar"
            />
            <div class="flex-1">
              <div class="flex justify-between items-baseline">
                <p
                  class="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                >
                  {{ message.sender }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTimeAgo(message.timestamp) }}
                </p>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {{ message.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.rounded-2xl {
  border-radius: 1.5rem;
}

.shadow-2xl {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.max-w-lg {
  max-width: 32rem;
}

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #f9fafb, #e5e7eb);
}

.dark .bg-gradient-to-br {
  background: linear-gradient(to bottom right, #1f2937, #111827);
}

.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.shadow-md {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button {
  transition: all 0.3s ease;
}

.flex-1 {
  flex: 1 1 0%;
}

.group:hover .group-hover\:text-indigo-600 {
  color: #4f46e5;
}

.dark .group:hover .group-hover\:text-indigo-400 {
  color: #818cf8;
}
</style>
