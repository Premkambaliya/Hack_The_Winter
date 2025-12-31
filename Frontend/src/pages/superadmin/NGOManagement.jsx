import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ngoService } from '../../services/adminService';

export default function NGOManagement() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);
  const [filters, setFilters] = useState({
    status: '',
    city: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchNGOs();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Reset to page 1 on new search
      if (searchTerm.trim()) {
        setFilters(prev => ({ ...prev, page: 1, limit: 100 })); // Get more results for search
      } else {
        setFilters(prev => ({ ...prev, page: 1, limit: 10 })); // Reset to normal pagination
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm]);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const response = await ngoService.getAllNGOs(filters);
      let fetchedNgos = response.data.data.ngos || [];
      
      // Add isActive property based on status for consistency
      fetchedNgos = fetchedNgos.map((ngo) => ({
        ...ngo,
        isActive: ngo.status === 'APPROVED'
      }));
      
      // Client-side filtering for search term
      if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        fetchedNgos = fetchedNgos.filter((ngo) =>
          ngo.name?.toLowerCase().includes(lowerSearch) ||
          ngo.email?.toLowerCase().includes(lowerSearch) ||
          ngo.organizationCode?.toLowerCase().includes(lowerSearch) ||
          ngo.city?.toLowerCase().includes(lowerSearch) ||
          ngo.phone?.includes(lowerSearch)
        );
      }
      
      setNgos(fetchedNgos);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      toast.error('Failed to fetch NGOs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (ngoId) => {
    navigate(`/superadmin/ngo/${ngoId}`);
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

  const getActiveBadge = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all registered NGOs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <input
            type="text"
            placeholder="Search by NGO name, email or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ status: '', city: '', page: 1, limit: 10 });
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No NGOs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    NGO Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Donors
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ngos.map((ngo) => (
                  <tr key={ngo._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {ngo.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ngo.city}, {ngo.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ngo.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          ngo.status
                        )}`}
                      >
                        {ngo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActiveBadge(
                          ngo.isActive
                        )}`}
                      >
                        {ngo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {ngo.donorCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewDetails(ngo._id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages && pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalDocuments}{' '}
              total NGOs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.max(1, filters.page - 1),
                  })
                }
                disabled={filters.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.min(pagination.totalPages, filters.page + 1),
                  })
                }
                disabled={filters.page === pagination.totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
