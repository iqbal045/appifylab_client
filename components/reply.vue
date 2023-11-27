<template>
  <div class="mt-2 ml-4 border-l-2 pl-4 border-gray-300">
    <div class="bg-gray-100 p-2.5 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img
            alt="Profile"
            class="w-6 h-6 rounded-full mr-2"
            src="https://via.placeholder.com/32"
          />
          <div>
            <div class="font-semibold">{{ reply.user.name }}</div>
            <div class="text-gray-500 text-xs">
              Replied on {{ reply.created_at }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-show="authUserId === reply.user.id"
            class="flex items-center focus:outline-none"
            @click="deleteReply"
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
            {{ reply.likes.length }}
          </span>
        </div>
      </div>
      <p class="text-gray-700">{{ reply.text }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { ReplyService } from '~/services/ReplyService'

const emit = defineEmits()
const props = defineProps(['reply'])
const likes = ref(props.reply.likes || [])
const replyId = `${props.reply.id}`

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
  await ReplyService.likeReply(token, replyId)
}

const deleteReply = async () => {
  const token = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).token
    : null

  const deletedReplyAction = await ReplyService.deleteReply(token, replyId)
  if (deletedReplyAction.success === true) {
    // delete reply from replies
    emit('removeDeletedReply', replyId)
  } else {
    alert('Something went wrong')
  }
}
</script>
