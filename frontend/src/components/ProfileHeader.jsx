import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Camera, Clock, UserCheck, UserPlus, X } from 'lucide-react'

const ProfileHeader = ({userData, onSave, isOwnProfile}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({})
    const queryClient = useQueryClient()
    
    const {data: authUser} = useQuery({queryKey: ["authUser"]})

    const {data: connectionStatus, refetch: refetchConnectionStatus} = useQuery({
        queryKey: ["connectionStatus", userData._id],
        queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
        enabled: !isOwnProfile
    })

    const {mutate: sendConnectionRequest} = useMutation({
        mutationFn: async(userId) =>{
            const res = axiosInstance.post(`/connections/request/${userId}`)
            return res.data
        },
        onSuccess: () =>{
            toast.success("Connection request sent successfully")
            refetchConnectionStatus()
            queryClient.invalidateQueries({queryKey: ["connectionRequests"]})
        },
        onError: (error) =>{
            toast.error(error.response?.data?.message || "An error occurred")
        }
    })

    const {mutate: acceptRequest} = useMutation({
        mutationFn: async(requestId) =>{
            const res = await axiosInstance.post(`/connections/accept/${requestId}`)
            return res.data
        },
        onSuccess: () =>{
            toast.success("Connection request accepted successfully")
            refetchConnectionStatus()
            queryClient.invalidateQueries({queryKey: ["connectionRequests"]})
        },
        onError: (error) =>{
            toast.error(error.response?.data?.message || "An error occurred")
        }
  })

    const {mutate: rejectRequest} = useMutation({
        mutationFn: async(requestId) =>{
            const res = await axiosInstance.post(`/connections/reject/${requestId}`)
            return res.data
        },
        onSuccess: () =>{
            toast.success("Connection request rejected")
            refetchConnectionStatus()
            queryClient.invalidateQueries({queryKey: ["connectionRequests"]})
        },
        onError: (error) =>{
            toast.error(error.response?.data?.message || "An error occurred")
        }
    })

    const {mutate: removeConnection} = useMutation({
        mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
        onSuccess: () =>{
            toast.success("Connection removed")
            refetchConnectionStatus()
            queryClient.invalidateQueries(['connectionRequests'])
        },
        onError: (error) =>{
            toast.error(error.response?.data?.message || "An error occurred")
        }
    })

    const getConnectionState = () =>{
        if(isConnected){
            return "Connected"
        } 
        if(!isConnected){
            return "not_connected"
        }
        return connectionStatus?.data?.status
    }
    const isConnected = userData.connections.some((connection) => connection._id === authUser._id)
    
    const renderConnectionButton = () =>{
        const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
        switch(getConnectionState()){
            case "connected":
                return (
                    <div className='flex gap-2 justify-center'>
                        <div className={`${baseClass} bg-green-500 hover:bg-green-700`}>
                            <UserCheck size={20} className='mr-2'/>
                            Connected
                        </div>
                        <button
                            className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`
                            }
                            onclick = {() => removeConnection(userData._)}
                        >
                            <X size={20} className='mr-2'/>
                            Remove Connection
                        </button>
                    </div>
                )
            case "pending":
                return(
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-700`}>
                        <Clock size={20} className='mr-2'/>
                        Pending
                    </button>
                )
            case "received":
                return(
                <div className='flex gap-2 justify-center'>
                    <button
                        onClick={() => acceptRequest(connectionStatus.data.requestId)}
                        className={`${baseClass} bg-red-500 hover:bg-red-700`}
                    >
                        Reject
                    </button>
                </div>)   
            default:
                return (
                    <button
                        onClick={() => sendConnectionRequest(userData._id)}
                        className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
                    >
                        <UserPlus size={20} className='mr-2'/>
                            Connect
                    </button>
                )
        }
    } 

    const handleImageChange = () =>{
        return 
    }

    return (
    <div className='bg-white shadow rounded-lg mb-6'>
        <div 
            className='relative h-48 rounded-t-lg bg-cover bg-center'
            style={{backgroundImage: `url(${editedData.bannerImg || userData.bannerImg || '/banner.png'})`}}
        >
            {isEditing && (
                <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
                    <Camera size={20}/>
                    <input
                        type='file'
                        className='hidden'
                        name='bannerImg'
                        onChange={handleImageChange}
                        accept='image/*'
                    />
                </label>
            )}
        </div>
            <div className='p-4'>
                <div className='relative -mt-20 mb-4'>
                    <img
                        className='w-32 h-32 rounded-full mx-auto object-cover'
                        src={editedData.profilePicture || userData.profilePicture || '/avatar.png'}
                        alt={userData.name}
                    />
                </div>
            </div>
    </div>
  )
}

export default ProfileHeader
