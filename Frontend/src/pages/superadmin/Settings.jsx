import { useState, useEffect } from 'react';
import { User, Mail, Phone, LogOut, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState({ ...profileData });

  useEffect(() => {
    // Get admin data from localStorage
    const adminName = localStorage.getItem('adminName') || 'Admin User';
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@sebn.com';
    const adminPhone = localStorage.getItem('adminPhone') || '';

    const data = {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
    };
    setProfileData(data);
    setTempData(data);
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleSaveProfile = async () => {
    if (!tempData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage (simulating profile update)
      localStorage.setItem('adminName', tempData.name);
      localStorage.setItem('adminEmail', tempData.email);
      localStorage.setItem('adminPhone', tempData.phone);

      setProfileData({ ...tempData });
      setEditMode(false);
      toast.success('Profile updated successfully');

      // Dispatch custom event to update navbar
      window.dispatchEvent(new CustomEvent('adminProfileUpdated'));
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminPhone');
    window.location.href = '/superadmin-login';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User size={24} />
                Profile
              </h2>
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-6">
              {/* Display Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{profileData.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2 flex items-center gap-2">
                    <Mail size={18} className="text-red-600" />
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</p>
                <p className="text-lg font-semibold text-gray-900 mt-2 flex items-center gap-2">
                  <Phone size={18} className="text-red-600" />
                  {profileData.phone || 'Not provided'}
                </p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Edit Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={tempData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={tempData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={tempData.phone}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 disabled:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
            <AlertCircle size={24} />
            Danger Zone
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-red-700">
              Logging out will end your session across all devices.
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout from All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
