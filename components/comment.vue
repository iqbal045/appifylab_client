<template>
  <div class="mt-4 ml-4 border-l-2 pl-4 border-gray-300">
    <div class="bg-gray-100 p-2.5 rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <img
            alt="Profile"
            class="w-6 h-6 rounded-full mr-2"
            src="https://via.placeholder.com/32"
          />
          <div>
            <div class="font-semibold">{{ comment.user.name }}</div>
            <div class="text-gray-500 text-xs">
              Commented on {{ comment.created_at }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-show="authUserId === comment.user.id"
            class="flex items-center focus:outline-none"
            @click="deleteComment"
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
          <span class="items-center text-gray-500">
            {{ comment.likes.length }}
          </span>
        </div>
      </div>
      <p class="text-gray-700">{{ comment.text }}</p>
    </div>

    <!-- Reply Content -->
    <reply
      v-for="reply in replies"
      :key="reply.id"
      :reply="reply"
      @removeDeletedReply="removeDeletedReply"
    />

    <!-- Reply Form -->
    <form @submit.prevent="createReply">
      <div class="flex items-center mt-2 ml-4 border-gray-300">
        <textarea
          v-model="text"
          class="w-full p-2 border border-gray-300 rounded-md resize-none"
          placeholder="Add a reply"
          required
        ></textarea>
        <button
          class="ml-2 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          <i class="fas fa-reply mr-2"></i>Reply
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { CommentService } from '~/services/CommentService'
import { ReplyService } from '~/services/ReplyService'

const props = defineProps(['comment'])
const emit = defineEmits()

const text = ref('')
const commentId = `${props.comment.id}`

const replies = ref(props.comment.replies || [])
const likes = ref(props.comment.likes || [])

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
  await CommentService.likeComment(token, commentId)
}

const deleteComment = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null

  const deletedCommentAction = await CommentService.deleteComment(
    token,
    commentId
  )
  if (deletedCommentAction.success === true) {
    // delete comment from comments
    emit('removeDeletedComment', commentId)
  } else {
    alert('Something went wrong')
  }
}

const createReply = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null

  const createdReply = await ReplyService.createReply(token, {
    commentId,
    text: text.value,
  })

  if (createdReply.success === true) {
    replies.value.unshift(createdReply.data)
    // reset text
    text.value = ''
  } else {
    alert('Something went wrong')
  }
}

const removeDeletedReply = (deletedReplyId) => {
  // Find the index of the deleted reply in the array
  const deletedReplyIndex = replies.value.findIndex(
    (reply) => reply.id === deletedReplyId
  )

  // If the deleted reply is found, remove it from the array
  if (deletedReplyIndex !== -1) {
    // Using Vue.set to ensure reactivity
    replies.value.splice(deletedReplyIndex, 1)
  }
}
</script>
