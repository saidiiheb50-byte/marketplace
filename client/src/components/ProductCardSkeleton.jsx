import Skeleton from './Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="card overflow-hidden">
      <Skeleton variant="image" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="heading" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;



