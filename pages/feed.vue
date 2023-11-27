<template>
  <div class="max-w-2xl mx-auto mt-8">
    <!-- Post Form -->
    <div class="bg-white p-4 rounded-md shadow-md mb-4">
      <form @submit.prevent="createFeed">
          <textarea
            v-model="newFeed.text"
            class="w-full p-2 border border-gray-300 rounded-md resize-none"
            placeholder="What's on your mind?"
            required
          ></textarea>
        <div class="flex items-center justify-between mt-4">
          <button
            class="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            <i class="fas fa-feather-alt mr-2"></i>Post
          </button>
          <label class="cursor-pointer">
            <span class="text-gray-500 hover:text-blue-500">Add Photo</span>
            <input
              ref="fileInput"
              class="hidden"
              multiple
              type="file"
              @change="handleFileChange"
            />
          </label>
        </div>
      </form>
    </div>

    <!-- Feed -->
    <div v-if="feedItems && isFeedLoaded">
      <feed
        v-for="feedItem in feedItems"
        :key="feedItem.id"
        :feedItem="feedItem"
        @removeDeletedFeed="removeDeletedFeed"
      />
    </div>
    <h2 v-else>Make your first post</h2>
  </div>
</template>

<script>
import { FeedService } from '~/services/FeedService';

export default {
  data() {
    return {
      feedItems: [],
      newFeed: { text: '', gallery: [] },
      isFeedLoaded: false,
    };
  },
  methods: {
    handleFileChange(event) {
      const files = event.target.files;
      this.newFeed.gallery = Array.from(files);
    },
    async getAllFeed() {
      if (!this.isFeedLoaded) {
        const token = localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user')).token
          : null;

        if (token) {
          const feedsAction = await FeedService.getAllFeed(token);
          if (feedsAction.success === true) {
            this.feedItems = feedsAction.data;
            this.isFeedLoaded = true;
          } else {
            this.$nuxt.$toast.error(feedsAction.message);
          }
        }
      }
    },
    async createFeed() {
      const token = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).token
        : null;

      // form init
      const formData = new FormData();
      formData.append('text', this.newFeed.text);
      this.newFeed.gallery.forEach((file) => {
        formData.append('gallery', file);
      });

      const createFeedAction = await FeedService.createFeed(token, formData);
      if (createFeedAction.success === true) {
        this.$nuxt.$toast.success(createFeedAction.message);
        // add new feed to feedItems
        this.feedItems.unshift(createFeedAction.data);
        // Reset form
        this.newFeed = { text: '', gallery: [] };
      } else {
        this.$nuxt.$toast.error(createFeedAction.message);
      }
    },
    removeDeletedFeed(deletedFeedId) {
      const deletedFeedIndex = this.feedItems.findIndex(
        (feed) => feed.id === deletedFeedId
      );
      if (deletedFeedIndex !== -1) {
        this.feedItems.splice(deletedFeedIndex, 1);
      }
    },
  },
  async mounted() {
    await this.getAllFeed();
  },
};
// import { onMounted, ref } from 'vue';
// import { FeedService } from '~/services/FeedService';
//
// const feedItems = ref([]);
// const newFeed = ref({ text: '', gallery: [] });
// const isFeedLoaded = ref(false);
//
// const handleFileChange = (event) => {
//   const files = event.target.files;
//   newFeed.value.gallery = Array.from(files);
// };
//
// const getAllFeed = async () => {
//   if (!isFeedLoaded.value) {
//     const token = localStorage.getItem('user')
//       ? JSON.parse(localStorage.getItem('user')).token
//       : null;
//
//     if (token) {
//       const feedsAction = await FeedService.getAllFeed(token);
//       if (feedsAction.success === true) {
//         feedItems.value = feedsAction.data;
//         isFeedLoaded.value = true;
//       } else {
//         $nuxt.$toast.error(feedsAction.message);
//       }
//     }
//   }
// };
//
// onMounted(async () => {
//   getAllFeed();
// });
//
// // Create Feed
// const createFeed = async () => {
//   const token = localStorage.getItem('user')
//     ? JSON.parse(localStorage.getItem('user')).token
//     : null
//
//   // form init
//   const formData = new FormData()
//   formData.append('text', newFeed.value.text)
//   newFeed.value.gallery.forEach((file) => {
//     formData.append('gallery', file)
//   })
//
//   const createFeedAction = await FeedService.createFeed(token, formData)
//   createFeedAction.success === true
//     ? $nuxt.$toast.success(createFeedAction.message)
//     : $nuxt.$toast.error(createFeedAction.message)
//
//   // add new feed to feedItems
//   feedItems.value.unshift(createFeedAction.data)
//
//   // Reset form
//   newFeed.value = {
//     text: '',
//     gallery: [],
//   }
// }
//
// const removeDeletedFeed = (deletedFeedId) => {
//   const deletedFeedIndex = feedItems.value.findIndex(
//     (feed) => feed.id === deletedFeedId
//   )
//   if (deletedFeedIndex !== -1) {
//     feedItems.value.splice(deletedFeedIndex, 1)
//   }
// }
</script>


<style scoped></style>
