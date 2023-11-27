import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = ({ redirect }) => {
  try {
    // Check if the code is running on the client side
    if (process.client) {
      // Check if the user token is present in local storage
      const user = localStorage.getItem('user')
      const userToken = user ? JSON.parse(user).token : null

      if (userToken === null) {
        // If the user token is not present, redirect to the login page
        return redirect('/auth/login')
      }
    }
  } catch (error) {
    return redirect('/auth/login')
  }
}

export default authMiddleware
