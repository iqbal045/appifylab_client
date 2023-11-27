import { NuxtAxiosInstance } from '@nuxtjs/axios'

export const CommentService = {
  async createComment(
    token: string,
    comment: {
      text: string
      feedId: string
    }
  ): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.post('/comments', comment, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async deleteComment(token: string, commentId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.delete(`/comments/${commentId}`, { headers })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
  async likeComment(token: string, commentId: string): Promise<any> {
    try {
      const axios: NuxtAxiosInstance = (window as any).$nuxt.$axios
      const headers = { Authorization: `Bearer ${token}` }
      const response = await axios.get(`/comments/${commentId}/like`, {
        headers,
      })

      return response.data
    } catch (error) {
      console.error('Error response:', error)
      throw new Error('Get feed failed')
    }
  },
}
