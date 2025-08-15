import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../lib/axios';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SignUpForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onReset = () => {
    if (window.confirm("Are you sure you want to reset form?")) {
      reset({
        name: '',
        username: '',
        email: '',
        password: ''
      });
    }
  };

  const { mutate: signUpMutation, isPending: isRegistering } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      reset();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    signUpMutation(data);
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Full name'
          {...register("name", { required: "Full name is required" })}
          className='input input-bordered w-full'
          required
        />
        {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}

        <input
          type='text'
          placeholder='Username'
          {...register("username", { required: "Username is required" })}
          className='input input-bordered w-full'
          required
        />
        {errors.username && <span className='text-red-500 text-sm'>{errors.username.message}</span>}

        <input
          type='email'
          placeholder='Email'
          {...register("email", {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email address',
            }
          })}
          className='input input-bordered w-full'
          required
        />
        {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}

        <input
          type='password'
          placeholder='Password (6+ characters)'
          {...register('password', {
            required: "Password is required",
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
          className='input input-bordered w-full'
        />
        {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}

        <div className="flex justify-between gap-4">
          <button type="button" className="btn btn-accent w-1/2" onClick={onReset}>
            Reset Form
          </button>
          <button type="submit" disabled={isRegistering} className="btn btn-primary w-1/2 text-white">
            {isRegistering ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
          </button>
        </div>
      </form>

      {/* Divider */}
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
  );
};

export default SignUpForm;
