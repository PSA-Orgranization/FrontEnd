const Callback = () => {
      return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-12 pt-10">
        {/* PSA Logo can go here */}
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-600">Processing login...</p>
      </div>
    </div>
  );
}


export default  Callback ;