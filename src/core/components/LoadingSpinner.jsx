

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="text-gray-600 font-medium">Loading schedules...</p>
      </div>
    </div>
  )
}
