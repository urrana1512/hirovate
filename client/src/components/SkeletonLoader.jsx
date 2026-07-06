import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', width = '100%', height = '20px', className = '' }) => {
  const baseStyle = { width, height };
  
  if (type === 'avatar') {
    return <div className={`skeleton skeleton-avatar ${className}`} style={{ width, height: width }}></div>;
  }
  
  if (type === 'card') {
    return (
      <div className={`skeleton-card premium-card p-4 ${className}`}>
        <div className="skeleton skeleton-title w-50 mb-3"></div>
        <div className="skeleton skeleton-text w-100 mb-2"></div>
        <div className="skeleton skeleton-text w-75 mb-2"></div>
        <div className="skeleton skeleton-text w-100 mb-4"></div>
        <div className="skeleton skeleton-button w-25 mt-auto"></div>
      </div>
    );
  }

  return <div className={`skeleton skeleton-text ${className}`} style={baseStyle}></div>;
};

export default SkeletonLoader;
