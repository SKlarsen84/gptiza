const LoginButton = () => {
  return (
    <div className="absolute top-4 right-4">
      <button
        className="inline-flex items-center rounded-md border border-transparent bg-[#2e026d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#15162c] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        onClick={() => {
          console.log("log in");
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LoginButton;
