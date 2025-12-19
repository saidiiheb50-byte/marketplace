const ProductBadge = ({ type }) => {
  const badges = {
    new: {
      label: 'New',
      className: 'bg-green-500 text-white',
    },
    sale: {
      label: 'Sale',
      className: 'bg-red-500 text-white',
    },
    out_of_stock: {
      label: 'Out of Stock',
      className: 'bg-gray-500 text-white',
    },
    featured: {
      label: 'Featured',
      className: 'bg-primary-600 text-white',
    },
  };

  const badge = badges[type] || badges.new;

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${badge.className}`}>
      {badge.label}
    </span>
  );
};

export default ProductBadge;




