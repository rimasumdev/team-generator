const EmptyState = ({
  icon: Icon,
  title = "কোন খেলোয়াড় যোগ করা হয়নি",
  message = "খেলোয়াড়দের তালিকায় গিয়ে নতুন খেলোয়াড় যোগ করুন",
  action = null,
  className = "text-center",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      {Icon && <Icon className="text-gray-400 text-5xl mb-4" />}
      <h2 className="text-xl text-gray-600">{title}</h2>
      <p className="text-gray-500 mt-2">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
