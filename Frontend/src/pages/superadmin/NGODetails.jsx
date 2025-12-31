import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/adminService';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NGODetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchNGODetails();
  }, [id]);

  const fetchNGODetails = async () => {
    try {
      setLoading(true);
      const response = await ngoService.getNGOById(id);
      const ngoData = response.data.data;
      setNgo({
        ...ngoData,
        isActive: ngoData.status === 'APPROVED'
      });
    } catch (error) {
      toast.error('Failed to fetch NGO details');
      console.error(error);
      navigate('/superadmin/ngos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      await ngoService.approveNGO(id);
      toast.success('NGO approved successfully');
      setNgo(prev => ({ ...prev, status: 'APPROVED', isActive: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve NGO');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setApproving(true);
      await ngoService.rejectNGO(id);
      toast.success('NGO rejected successfully');
      setNgo(prev => ({ ...prev, status: 'REJECTED', isActive: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject NGO');
    } finally {
      setApproving(false);
    }
  };

  const handleActivate = async () => {
    try {
      setApproving(true);
      await ngoService.activateNGO(id, reasonText);
      toast.success('NGO activated successfully');
      setNgo(prev => ({ ...prev, isActive: true }));
      setReasonModal(false);
      setReasonText('');
      setActionType(null);
      fetchNGODetails();
    } catch (error) {
      toast.error('Failed to activate NGO');
    } finally {
      setApproving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setApproving(true);
      await ngoService.deactivateNGO(id, reasonText);
      toast.success('NGO deactivated successfully');
      setNgo(prev => ({ ...prev, isActive: false }));
      setReasonModal(false);
      setReasonText('');
      setActionType(null);
      fetchNGODetails();
    } catch (error) {
      toast.error('Failed to deactivate NGO');
    } finally {
      setApproving(false);
    }
  };

  const openReasonModal = (type) => {
    setActionType(type);
    setReasonText('');
    setReasonModal(true);
  };

  const handleReasonSubmit = () => {
    if (!reasonText.trim()) {
      toast.error('Please enter a reason');
      return;
    }
    if (actionType === 'activate') {
      handleActivate();
    } else if (actionType === 'deactivate') {
      handleDeactivate();
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

  if (!ngo) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">NGO not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/superadmin/ngos')}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ngo.name}</h1>
          <p className="text-gray-600 mt-1">{ngo.organizationCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{ngo.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">{ngo.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact Person</p>
                <p className="text-sm font-medium text-gray-900">{ngo.contactPerson || 'N/A'}</p>
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
                <p className="text-sm font-medium text-gray-900">{ngo.location?.address || ngo.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">City</p>
                <p className="text-sm font-medium text-gray-900">{ngo.location?.city || ngo.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">State</p>
                <p className="text-sm font-medium text-gray-900">{ngo.location?.state || ngo.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pincode</p>
                <p className="text-sm font-medium text-gray-900">{ngo.location?.pincode || ngo.pinCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* NGO Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
              NGO Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization Code</p>
                <p className="text-sm font-medium text-gray-900">{ngo.organizationCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Registration Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {ngo.registeredDate ? new Date(ngo.registeredDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Area of Focus</p>
                <p className="text-sm font-medium text-gray-900">{ngo.areaOfFocus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Volunteers Count</p>
                <p className="text-sm font-medium text-gray-900">{ngo.volunteersCount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Donors Count</p>
                <p className="text-sm font-medium text-gray-900">{ngo.donorCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Admin Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-red-100">
              Admin Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Admin Name</p>
                <p className="text-sm font-medium text-gray-900">{ngo.adminName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Admin Email</p>
                <p className="text-sm font-medium text-gray-900">{ngo.adminEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Admin Phone</p>
                <p className="text-sm font-medium text-gray-900">{ngo.adminPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Approval Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(ngo.status)}`}>
                  {ngo.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Activity Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  ngo.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ngo.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {ngo.status === 'PENDING' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve NGO
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={approving}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject NGO
                  </button>
                </>
              )}

              {ngo.status === 'APPROVED' && (
                <>
                  {ngo.isActive ? (
                    <button
                      onClick={() => openReasonModal('deactivate')}
                      disabled={approving}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => openReasonModal('activate')}
                      disabled={approving}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}
                </>
              )}

              {(ngo.status === 'SUSPENDED' || ngo.status === 'REJECTED') && (
                <button
                  onClick={() => openReasonModal('activate')}
                  disabled={approving}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                  Activate NGO
                </button>
              )}

              <button
                onClick={() => navigate('/superadmin/ngos')}
                className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reason Modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'activate' ? 'Activate NGO' : 'Deactivate NGO'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {actionType === 'activate' 
                  ? 'Why are you activating this NGO?' 
                  : 'Why are you deactivating this NGO?'}
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter reason..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReasonModal(false);
                  setReasonText('');
                  setActionType(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                disabled={approving || !reasonText.trim()}
                className={`flex-1 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50 ${
                  actionType === 'activate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {actionType === 'activate' ? 'Activate' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
