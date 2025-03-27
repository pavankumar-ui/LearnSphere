import React from 'react'

const InstructorProfile = () => {
  return (
    

    <div className='flex flex-col gap-4 card p-4'>
          <form className='flex flex-col gap-4'>
             
           
          <div className='flex flex-col gap-1'>
          <p>UserName</p>
          <input type='text'
            placeholder='enter userName'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>


        <div className='flex flex-col gap-1'>
          <p>Email</p>
          <input type='email'
            placeholder='enter course Title'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>


        <div className='flex flex-col gap-1'>
          <p>Company Name</p>
          <input type='text'
            placeholder='enter course Title'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>


        <div className='flex flex-col gap-1'>
          <p>Upload Profile Image</p>
        </div>


        <button type="submit" className='bg-blue-600 text-white w-max py-2.5 px-8 rounded my-4'>
      Update profile
    </button>

            </form>

            </div>







  )
}

export default InstructorProfile