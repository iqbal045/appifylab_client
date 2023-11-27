<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-1.52 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="Your Company"
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      />
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Register your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="register">
        <div>
          <label
            class="block text-sm font-medium leading-6 text-gray-900"
            for="email"
            >Full Name</label
          >
          <div class="mt-2">
            <input
              v-model="name"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
              type="text"
            />
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium leading-6 text-gray-900"
            for="email"
            >Email address</label
          >
          <div class="mt-2">
            <input
              v-model="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
              type="email"
            />
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium leading-6 text-gray-900"
            for="email"
            >Phone Number</label
          >
          <div class="mt-2">
            <input
              v-model="phone"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
              type="text"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              class="block text-sm font-medium leading-6 text-gray-900"
              for="password"
              >Password</label
            >
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
              type="password"
            />
          </div>
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        <nuxt-link
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          to="/auth/login"
          >Login here</nuxt-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { AuthService } from '~/services/AuthService'
import { onMounted, ref } from 'vue'

const checkLoginAndRedirect = () => {
  const user = localStorage.getItem('user')

  // If user is not logged in, redirect to the login page
  if (user) {
    $nuxt.$router.push('/feed')
  }
}
onMounted(() => {
  checkLoginAndRedirect()
})

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

const register = async () => {
  try {
    const action = await AuthService.register(
      name.value,
      email.value,
      phone.value,
      password.value
    )

    // flash message
    action.success === true
      ? $nuxt.$toast.success(action.message)
      : $nuxt.$toast.error(action.message)

    // push to home page
    $nuxt.$router.push('/auth/login')
  } catch (error) {
    console.log(error)
  }
}
</script>
