import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Loader } from 'lucide-react'

const LoginForm = () => {

    const queryClient = useQueryClient()
    const {register, handleSubmit, formState: {errors}, reset} = useForm()

    const {mutate: loginMutation, isPending: isLogingIn} = useMutation({
        mutationFn: async(data) =>{
            const res = await axiosInstance.post('auth/login', data)
            return res.data
        },
        onSuccess: () =>{
            toast.success("Logged in successfully")
            queryClient.invalidateQueries({queryKey: ['authUser']})
            reset()
        },
        onError: (err) =>{
            toast.error(err?.response?.data?.message || 'Something went wrong')
        }
    })

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:4000/api/v1/auth/google";
    };

    const onSubmit = (data) =>{
        loginMutation(data)
    }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <input 
            type='text'
            placeholder='Email'
            {...register("email", {required: 'Email is required',
                pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address"
                }
            })}
            className='input input-border w-full'
            required
        />
        {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span> }

        <input
            type='text'
            placeholder='Password'
            {...register("password", {required: "Password is required",
                minLength: {value: 6, message: 'Password must be at least 6 characters'}
            })}
            className='input input-border w-full'
            required
        />
        {errors.password && <span className='text-red-500 text-sm'> {errors.password.message} </span>}

        <button type='submit' className='btn btn-primary text-white w-full'>
            {isLogingIn ? <Loader className='size-5 animate-spin'/> : "Login"}
        </button>
      </form>
      <div className="flex items-center gap-2 my-2">
        <hr className="flex-grow border-gray-300" />
        <span className="text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleSignIn}
        className="btn btn-outline w-full flex items-center justify-center gap-2"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  )
}

export default LoginForm
