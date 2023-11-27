import { NuxtAxiosInstance } from '@nuxtjs/axios'

export const ReplyService = {
  async createReply(
    token: string,
    reply: {
      text: string
      commentId: string
    }
  ): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.post('/replies', reply, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async deleteReply(token: string, replyId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.delete(`/replies/${replyId}`, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async likeReply(token: string, replyId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.get(`/replies/${replyId}/like`, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
}
