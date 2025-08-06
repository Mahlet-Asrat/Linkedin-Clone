import { Link, Navigate, redirect, Route,Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/HomePage'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import NotificationPage from './pages/NotificationPage'
import NetworkPage from './pages/NetworkPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'

function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await axiosInstance.get('/auth/my-profile')
        return res.data
      } catch (error) {
        if(error.response && error.response.status === 401){
          return null
        }
        toast.error(error.response.data.message || "Something went wrong")
      }
    }
  });

  if(isLoading){
    return null
  }

  return (
    <Layout>
      <Routes>
        <Route path='/' element={!authUser ? <Navigate to="/login" replace/> : <HomePage/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to="/"/>}/> 
        <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to={"/login"}/>}/>
        <Route path='/network' element={authUser ? <NetworkPage/> : <Navigate to={"/login"}/>}/>
        <Route path='/post/:postId' element={authUser ? <PostPage/> : <Navigate to={"/login"}/>}/>
        <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to={"/login"}/>}/>
      </Routes>
      <Toaster/>
    </Layout>
  )
}

export default App
