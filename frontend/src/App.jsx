import { Link, Navigate, redirect, Route, Routes, useSearchParams } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/HomePage'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import NotificationPage from './pages/NotificationPage'
import NetworkPage from './pages/NetworkPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'
import { useEffect } from 'react'

function App() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Handle Google OAuth success
  useEffect(() => {
    const authStatus = searchParams.get('auth');
    if (authStatus === 'success') {
      toast.success('Successfully signed in with Google!');
      // Invalidate queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  }, [searchParams, queryClient]);

  const { data: authUser, isLoading, error, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/my-profile')
        return res.data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (isError && error && error.response && error.response.status !== 401) {
    toast.error(error.response?.data?.message || "Authentication failed. Please try logging in again.")
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Routes>
        <Route path='/' element={!authUser ? <Navigate to="/signup" replace /> : <HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to={"/login"} />} />
        <Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
        <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App
