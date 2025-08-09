import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    watch: watchProfile
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '',
      pan_number: user?.pan_number || '',
      address: user?.address || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword
  } = useForm();

  const newPassword = watchPassword('new_password');

  useEffect(() => {
    if (user) {
      resetProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        pan_number: user.pan_number || '',
        address: user.address || ''
      });
    }
  }, [user, resetProfile]);

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setIsLoading(true);
    try {
      await changePassword(data.current_password, data.new_password);
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(URL.createObjectURL(file));
      toast.success('Profile image updated!');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile();
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profileImage || user.profile_picture ? (
                      <img
                        src={profileImage || user.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <FaCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Basic Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                {/* Verification Status */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                  <FaCheckCircle className="w-4 h-4 mr-2" />
                  {user.is_verified ? 'Verified Account' : 'Unverified Account'}
                </div>

                {/* Member Since */}
                <div className="text-sm text-gray-500">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <FaLock className="w-4 h-4 mr-2" />
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            {/* Profile Information */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary px-3 py-2 text-sm flex items-center"
                    >
                      <FaTimes className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="profile-form"
                      disabled={isLoading}
                      className="btn-primary px-3 py-2 text-sm flex items-center"
                    >
                      <FaSave className="w-4 h-4 mr-1" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <form id="profile-form" onSubmit={handleProfileSubmit(handleProfileUpdate)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.first_name ? 'border-red-500' : ''}`}
                        {...registerProfile('first_name', {
                          required: 'First name is required',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          }
                        })}
                      />
                    </div>
                    {profileErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.first_name.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.last_name ? 'border-red-500' : ''}`}
                        {...registerProfile('last_name', {
                          required: 'Last name is required',
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                          }
                        })}
                      />
                    </div>
                    {profileErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.last_name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.email ? 'border-red-500' : ''}`}
                        {...registerProfile('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.phone_number ? 'border-red-500' : ''}`}
                        {...registerProfile('phone_number', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Please enter a valid 10-digit phone number'
                          }
                        })}
                      />
                    </div>
                    {profileErrors.phone_number && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.phone_number.message}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.date_of_birth ? 'border-red-500' : ''}`}
                        {...registerProfile('date_of_birth', {
                          required: 'Date of birth is required'
                        })}
                      />
                    </div>
                    {profileErrors.date_of_birth && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.date_of_birth.message}</p>
                    )}
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.pan_number ? 'border-red-500' : ''}`}
                        {...registerProfile('pan_number', {
                          required: 'PAN number is required',
                          pattern: {
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message: 'Please enter a valid PAN number (e.g., ABCDE1234F)'
                          }
                        })}
                      />
                    </div>
                    {profileErrors.pan_number && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.pan_number.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      rows="3"
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''} ${profileErrors.address ? 'border-red-500' : ''}`}
                      {...registerProfile('address', {
                        required: 'Address is required',
                        minLength: {
                          value: 10,
                          message: 'Address must be at least 10 characters'
                        }
                      })}
                    />
                  </div>
                  {profileErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.address.message}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Change Password */}
            {isChangingPassword && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <button
                    onClick={handleCancelPasswordChange}
                    className="btn-secondary px-3 py-2 text-sm flex items-center"
                  >
                    <FaTimes className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit(handlePasswordChange)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className={`input-field pl-10 pr-10 ${passwordErrors.current_password ? 'border-red-500' : ''}`}
                          {...registerPassword('current_password', {
                            required: 'Current password is required'
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.current_password && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className={`input-field pl-10 pr-10 ${passwordErrors.new_password ? 'border-red-500' : ''}`}
                          {...registerPassword('new_password', {
                            required: 'New password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                              message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                            }
                          })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.new_password && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`input-field pl-10 pr-10 ${passwordErrors.confirm_password ? 'border-red-500' : ''}`}
                        {...registerPassword('confirm_password', {
                          required: 'Please confirm your password',
                          validate: value => value === newPassword || 'Passwords do not match'
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary px-6 py-2 flex items-center"
                    >
                      <FaShieldAlt className="w-4 h-4 mr-2" />
                      {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Security */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FaShieldAlt className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="btn-secondary px-4 py-2 text-sm">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FaEnvelope className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about important account activities</p>
                    </div>
                  </div>
                  <button className="btn-secondary px-4 py-2 text-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
