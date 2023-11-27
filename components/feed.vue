<template>
  <div class="bg-white p-4 rounded-md shadow-md mb-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <img
          alt="Profile"
          class="w-8 h-8 rounded-full mr-2"
          src="https://via.placeholder.com/40"
        />
        <div>
          <div class="font-semibold">{{ feedItem.user.name }}</div>
          <div class="text-gray-500 text-xs">
            Posted on {{ feedItem.created_at }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <button
          v-show="authUserId === feedItem.user.id"
          class="flex items-center focus:outline-none mr-1"
          @click="deleteFeed"
        >
          <i class="fas fa-trash mr-1 text-red-500"></i>
        </button>
        <button
          :class="isLiked ? 'text-blue-500' : 'text-gray-500'"
          class="flex items-center hover:text-blue-500 focus:outline-none"
          @click="isLiked ? unlikeFeed() : likeFeed()"
        >
          <i
            :class="isLiked ? 'fa-solid' : 'far'"
            class="fa-thumbs-up mr-1"
          ></i>
          {{ isLiked ? 'Liked' : 'Like' }}
        </button>
      </div>
    </div>
    <p class="text-gray-800">{{ feedItem.text }}</p>
    <!--    <img-->
    <!--      v-show="feedItem.gallery.length > 0"-->
    <!--      alt="Image Post"-->
    <!--      class="mt-4 rounded-md"-->
    <!--      src="https://via.placeholder.com/600x400"-->
    <!--      style="min-width: 100%"-->
    <!--    />-->
    <div class="image-gallery">
      <div v-for="(image, index) in feedItem.gallery" :key="index" class="mb-4">
        <img
          :alt="'Image ' + (index + 1)"
          :src="image"
          class="rounded-md object-cover w-full h-48 cursor-pointer"
          @click="openLightbox(index)"
        />
      </div>

      <!-- Lightbox -->
      <div
        v-if="lightboxIndex !== null"
        class="fixed inset-0 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black opacity-75"
          @click="closeLightbox"
        ></div>
        <img
          :alt="'Image ' + (lightboxIndex + 1)"
          :src="feedItem.gallery[lightboxIndex]"
          class="max-w-full max-h-full"
        />
      </div>
    </div>

    <div class="flex items-center space-x-2 text-gray-500 mt-4">
      <div class="flex items-center">
        <i class="far fa-thumbs-up"></i>
        <span class="ml-1">{{ feedItem.likes.length }}</span>
      </div>
    </div>

    <!-- Comment -->
    <comment
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      @removeDeletedComment="removeDeletedComment"
    />

    <!-- Comment Form -->
    <div class="flex items-center mt-2">
      <form style="width: 100%" @submit.prevent="createComment">
        <textarea
          v-model="text"
          class="w-full p-2 border border-gray-300 rounded-md resize-none"
          placeholder="Add a comment"
          required
        ></textarea>
        <button
          class="ml-2 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          <i class="far fa-comment-alt mr-2"></i>Comment
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'

import { FeedService } from '~/services/FeedService'
import { CommentService } from '~/services/CommentService'

const props = defineProps(['feedItem'])
const emit = defineEmits()

const text = ref('')
const feedId = `${props.feedItem.id}`

const comments = ref(props.feedItem.comments || [])
const likes = ref(props.feedItem.likes || [])

// authUser
const authUserId = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')).user.id
  : null

// check auth user liked this feed
const isLiked = computed(() => likes.value.includes(authUserId))

const likeFeed = async () => {
  console.log(isLiked)
  await likeFeedAction()
  likes.value.unshift(authUserId)
}

const unlikeFeed = async () => {
  await likeFeedAction()
  const authUserIndex = likes.value.findIndex((id) => id === authUserId)
  if (authUserIndex !== -1) {
    likes.value.splice(authUserIndex, 1)
  }
}

const likeFeedAction = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null
  await FeedService.likeFeed(token, feedId)
}

const deleteFeed = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null

  const deleteFeedAction = await FeedService.deleteFeed(token, feedId)

  if (deleteFeedAction.success === true) {
    emit('removeDeletedFeed', feedId)
  } else {
    alert('Something went wrong')
  }
}

const createComment = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null

  const createCommentAction = await CommentService.createComment(token, {
    text: text.value,
    feedId: feedId.toString(),
  })

  if (createCommentAction.success === true) {
    comments.value.unshift(createCommentAction.data)
    // reset text
    text.value = ''
  } else {
    alert('Something went wrong')
  }
}

const removeDeletedComment = (deletedReplyId) => {
  const deletedCommentIndex = comments.value.findIndex(
    (comment) => comment.id === deletedReplyId
  )

  if (deletedCommentIndex !== -1) {
    comments.value.splice(deletedCommentIndex, 1)
  }
}

const lightboxIndex = ref(null)

const openLightbox = (index) => {
  lightboxIndex.value = index
}

const closeLightbox = () => {
  lightboxIndex.value = null
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
  gap: 1rem;
}

/* Adjust the width of the images based on the desired number of items per row */
@media (min-width: 640px) {
  .image-gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
