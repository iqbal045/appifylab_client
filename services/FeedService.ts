import { NuxtAxiosInstance } from '@nuxtjs/axios'

export const FeedService = {
  async getAllFeed(token: string | null): Promise<any> {
    try {
      // Access $axios from the context object
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.get('/feeds', { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async createFeed(token: string, feed: any): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.post('/feeds', feed, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async deleteFeed(token: string, feedId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.delete(`/feeds/${feedId}`, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async likeFeed(token: string, feedId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await axios.get(`/feeds/${feedId}/like`, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
}
