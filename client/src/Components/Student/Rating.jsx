import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets/assets';

const Rating = ({ initialRating, onRate, onClose }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [thought, setThought] = useState('');

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the rating and thought to your backend
    if (onRate) onRate(rating, thought);
    if (onClose) onClose();
  }

  useEffect(() => {
    if (initialRating !== undefined) {
      setRating(initialRating);
    }
  }, [initialRating])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-stone-950 font-semibold">Rate this course</h2>
          <button className="text-gray-500 cursor-pointer" onClick={onClose}>
            <img src={assets.cross_icon} alt="close_icon"/></button>
        </div>
        <p className="text-gray-800 mt-2">Design of everyday things • Erling Haaland</p>
        
        <div className="flex items-center mt-4">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
              <span 
                key={index} 
                className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-500'}`}
                onClick={() => handleRating(starValue)}
              >
                &#9733;
              </span>
            );
          })}
        </div>
        
        <form onSubmit={handleSubmit} className='mt-4'>
          <p className='text-gray-800 font-xs'>Please Share Your Thoughts</p>
          <textarea 
            className='w-full p-2 border rounded text-gray-700' 
            placeholder='Share your thoughts'
            rows="3"
            value={thought} 
            onChange={e => setThought(e.target.value)}
            maxLength={200}
          ></textarea>
          
          <button 
            type='submit' 
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2 w-full'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Rating