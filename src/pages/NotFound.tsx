import Placeholder from '../assets/no-results.jpg';

export const NotFound = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1>Not found</h1>
      <img src={Placeholder} alt="" />
    </div>
  )
}