import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bloodBankService } from '../../services/adminService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BloodBankDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bloodBank, setBloodBank] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchBloodBankDetails();
  }, [id]);

  const fetchBloodBankDetails = async () => {
    try {
      setLoading(true);
      const response = await bloodBankService.getBloodBankById(id);
      const bankData = response.data.data;
      setBloodBank({
        ...bankData,
        isActive: bankData.status === 'APPROVED'
      });
      
      // Fetch hospital requests for this blood bank
      if (bankData._id) {
        fetchBloodBankRequests(bankData._id);
      }
    } catch (error) {
      toast.error('Failed to fetch blood bank details');
      console.error(error);
      navigate('/superadmin/blood-banks');
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodBankRequests = async (bankId) => {
    try {
      // Fetch hospital blood requests for this blood bank
      const response = await bloodBankService.getBloodBankRequests(bankId);
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-red-200 text-red-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin">
          <div className="h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!bloodBank) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Blood Bank not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/superadmin/blood-banks')}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{bloodBank.name}</h1>
          <p className="text-gray-600 mt-1">{bloodBank.organizationCode}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'info'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blood Bank Info
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'requests'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hospital Requests
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'stock'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blood Stock
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Blood Bank Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
                Status Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Approval Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(bloodBank.status)}`}>
                    {bloodBank.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Activity Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    bloodBank.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bloodBank.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</p>
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {bloodBank.emergency24x7 ? '24x7 Emergency' : 'Regular'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization Code</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.organizationCode}</p>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
                Location Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.location?.address || bloodBank.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">City</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.location?.city || bloodBank.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">State</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.location?.state || bloodBank.state || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Blood Bank Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">License Number</p>
                  <p className="text-sm font-medium text-gray-900">{bloodBank.licenseNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Registration Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {bloodBank.registeredDate ? new Date(bloodBank.registeredDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hospital requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Hospital Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Blood Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Request Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {request.hospitalName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.bloodType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.quantity || 0} units
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Blood Stock Tab */}
        {activeTab === 'stock' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Blood Stock Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bloodType) => (
                <div key={bloodType} className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Blood Type</p>
                  <p className="text-3xl font-bold text-red-600 mb-2">{bloodType}</p>
                  <p className="text-sm text-gray-600">
                    {bloodBank.bloodStock?.[bloodType] || 0} units available
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/superadmin/blood-banks')}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
