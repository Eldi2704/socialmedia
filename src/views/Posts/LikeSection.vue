<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  initialLikeStatus: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["likeToggled"]);
const isLiked = ref(false);
const isLoading = ref(false);

onMounted(() => {
  isLiked.value = props.initialLikeStatus;
});

const handleLike = async () => {
  if (isLoading.value) return;

  const newLikeStatus = !isLiked.value;
  isLoading.value = true;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    let response;
    if (isLiked.value) {
      response = await axios.delete(`/api/posts/${props.postId}/likes`, config);
    } else {
      response = await axios.post(
        `/api/posts/${props.postId}/likes`,
        {},
        config
      );
    }

    if ([200, 201, 204].includes(response.status)) {
      isLiked.value = newLikeStatus;
      emit("likeToggled", props.postId, newLikeStatus);
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <button
    @click="handleLike"
    :class="{
      'text-blue-500': isLiked,
      'text-gray-600': !isLiked,
      'opacity-50 cursor-not-allowed': isLoading,
    }"
    class="hover:text-blue-500 transition-colors"
    :disabled="isLoading"
  >
    {{ isLiked ? "Liked" : "Like" }}
    <span v-if="isLoading" class="ml-2">...</span>
  </button>
</template>

