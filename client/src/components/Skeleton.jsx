const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    default: '',
    text: 'h-4',
    heading: 'h-6',
    title: 'h-8',
    avatar: 'h-12 w-12 rounded-full',
    image: 'aspect-square',
    card: 'h-64',
    button: 'h-10 w-24',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;



