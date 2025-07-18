const ErrorComponent = ({ className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 p-8 rounded-xl text-red-700 ${className}`}
      role="alert"
    >
      <img
        src="https://i.pinimg.com/1200x/a6/27/df/a627df548daa9fa419132af1e6bfd9ab.jpg"
        alt="Error Illustration"
        className="w-[450px] max-w-full h-auto rounded-xl shadow-lg"
      />
    </div>
  )
}

export default ErrorComponent
