import { NuxtAxiosInstance } from '@nuxtjs/axios'

export const AuthService = {
  async login(email: string, password: string) {
    try {
      // Access $axios from the context object
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios

      const response = await axios.post('/user/auth/login', {
        email,
        password,
      })
      return response.data.data
    } catch (error) {
      console.error('Login failed', error)
      throw new Error('Login failed')
    }
  },
  async register(name: string, email: string, phone: string, password: string) {
    try {
      // Access $axios from the context object
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios

      const response = await axios.post('/user/auth/register', {
        name,
        email,
        phone,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Register failed', error)
      // @ts-ignore
      return error.response.data
    }
  },
}
