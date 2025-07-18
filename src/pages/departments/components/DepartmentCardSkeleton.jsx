import Skeleton from "react-loading-skeleton";

export const DepartmentCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4">
      <Skeleton height={240} borderRadius="0.5rem" />

      <div className="mt-4">
        <Skeleton height={20} width="60%" />
      </div>

      <div className="mt-2 space-y-2">
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="85%" />
      </div>

      <hr className="border-gray-300 my-4" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                circle
                height={40}
                width={40}
                containerClassName="border border-gray-200 rounded-full"
              />
            ))}
          </div>
          <Skeleton height={14} width={60} />
        </div>

        <Skeleton height={40} width={80} borderRadius="0.5rem" />
      </div>
    </div>
  );
};

export default DepartmentCardSkeleton;
