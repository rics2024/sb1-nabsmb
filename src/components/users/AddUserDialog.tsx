import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUsersStore } from '@/store/users';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['teacher', 'admin', 'student']),
  studentId: z.string().optional(),
  class: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
}).refine((data) => {
  if (data.role === 'admin') {
    return !!data.password;
  }
  return true;
}, {
  message: "Password is required for admin accounts",
  path: ["password"],
});

type UserForm = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddUserDialog({ open, onClose }: AddUserDialogProps) {
  const addUser = useUsersStore((state) => state.addUser);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: UserForm) => {
    try {
      addUser(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                placeholder="Enter full name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                {...register('role')}
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <span className="text-sm text-red-500">{errors.role.message}</span>
              )}
            </div>

            {selectedRole === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <Input
                    placeholder="Enter student ID"
                    error={errors.studentId?.message}
                    {...register('studentId')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    {...register('class')}
                  >
                    <option value="">Select class</option>
                    <option value="1A">Class 1A</option>
                    <option value="1B">Class 1B</option>
                    <option value="2A">Class 2A</option>
                    <option value="2B">Class 2B</option>
                    <option value="3A">Class 3A</option>
                    <option value="3B">Class 3B</option>
                    <option value="4A">Class 4A</option>
                    <option value="4B">Class 4B</option>
                    <option value="5A">Class 5A</option>
                    <option value="5B">Class 5B</option>
                    <option value="6A">Class 6A</option>
                    <option value="6B">Class 6B</option>
                  </select>
                  {errors.class && (
                    <span className="text-sm text-red-500">{errors.class.message}</span>
                  )}
                </div>
              </>
            )}

            {selectedRole === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Add User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}