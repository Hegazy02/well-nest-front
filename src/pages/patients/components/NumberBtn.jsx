import React from 'react'

export const NumberBtn = () => {
  return (
    <div>
      <div className='flex justify-around'>
        <div className='bg-custom-blue1 circle text-white mask-radial-at-center shadow-md'>
          <p className='p-4 text-lg font-semibold'>1</p>
        </div>
         <div className='bg-stone-300 circle text-white mask-radial-at-center shadow-md'>
          <p className='p-4 text-lg font-semibold'>2</p>
        </div>
         <div className='bg-stone-300 circle text-white mask-radial-at-center shadow-md'>
          <p className='p-4 text-lg font-semibold'>3</p>
        </div>
      </div>
    </div>
  )
}
