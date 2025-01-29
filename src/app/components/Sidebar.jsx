const Sidebar = () => {
    return (
      <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">My App</h2>
        <nav className="flex-1">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Profile</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Settings</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Logout</li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default Sidebar;