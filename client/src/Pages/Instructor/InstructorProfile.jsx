import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets/assets';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/auth-context';
import { toast } from 'react-toastify';
import axios from 'axios';

const InstructorProfile = () => {

  const { token } = useContext(AuthContext);
  const { backend_url } = useContext(AppContext);

  // ✅ State for profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    designation: '',
    companyName: '',
    profileImage: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ✅ Function to fetch profile data from backend
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/auth/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (data.success) {
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          designation: data.user.designation || '',
          companyName: data.user.companyName || '',
          profileImage: data.user.profileImage || ''
        });

        setPreviewUrl(data.user.profileImage || assets.fallback_image);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error('Failed to load profile data');
    }
  };

  // ✅ Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);  // ✅ Store uploaded image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // ✅ Handle form submission with image upload
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('designation', profile.designation || '');
      formData.append('companyName', profile.companyName || '');

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const { data } = await axios.put(`${backend_url}/auth/profile`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (data.success) {
        toast.success(data.message);

        // ✅ Refetch updated profile data
        await fetchUserProfile();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error('Failed to update profile');
    }
  };

  // ✅ Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ✅ Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className='flex flex-col gap-4 card p-4'>
      <div className='flex items-center text-2xl font-semibold text-gray-800'>
        <p>My Profile 😎</p>
      </div>

      <form onSubmit={handleUpdateProfile} className='flex flex-col gap-4'>

        {/* ✅ Name Field */}
        <div className='flex flex-col gap-1'>
          <p>UserName</p>
          <input
            type='text'
            name="name"
            value={profile?.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder='Enter your name'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          />
        </div>

        {/* ✅ Email Field */}
        <div className='flex flex-col gap-1'>
          <p>Email</p>
          <input
            type='email'
            name="email"
            value={profile?.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          />
        </div>

        {/* ✅ Company Name Field */}
        <div className='flex flex-col gap-1'>
          <p>Company Name</p>
          <input
            type='text'
            name="companyName"
            value={profile?.companyName || ''}
            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            placeholder='Enter company name'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          />
        </div>

        {/* ✅ Designation Field */}
        <div className='flex flex-col gap-1'>
          <p>Designation</p>
          <input
            type='text'
            name="designation"
            value={profile?.designation || ''}
            onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
            placeholder='Enter designation'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          />
        </div>

        {/* ✅ Image Upload */}
        <div className='flex flex-col gap-1'>
          <p>Upload Profile Image</p>
          <label htmlFor='profileImage' className='flex items-center gap-3'>
            <img src={assets.file_upload_icon} alt="upload-icon" className='p-3 bg-blue-500 rounded' />

            <input
              type="file"
              id='profileImage'
              name="profileImage"
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />

            {/* ✅ Display preview or fallback image */}
            <img
              className='max-h-12'
              src={previewUrl}
              alt="Profile preview"
            />
          </label>
        </div>

        <button
          type="submit"
          className='bg-blue-600 text-white w-max py-2.5 px-8 rounded my-4'>
          Update profile
        </button>
      </form>
    </div>
  );
};

export default InstructorProfile;
