import { useState, useEffect } from "react";
import { getHospitalById } from "../../services/hospitalApi";

export default function HospitalProfile() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get organizationId from localStorage
  const organizationId = localStorage.getItem('organizationId'); // Organization ID from login

  useEffect(() => {
    fetchHospitalProfile();
  }, []);

  const fetchHospitalProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getHospitalById(organizationId);
      setHospital(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching hospital profile:', err);
      setError(err.response?.data?.message || 'Failed to load hospital profile');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'VERIFIED': 'text-[#1f7a3a]',
      'PENDING': 'text-[#b05f09]',
      'REJECTED': 'text-[#9e121c]',
      'SUSPENDED': 'text-[#d1661c]'
    };
    return colors[status] || 'text-[#7a4c4c]';
  };

  if (loading) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_60px_rgba(77,10,15,0.12)]">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#8f0f1a] border-r-transparent"></div>
            <p className="mt-4 text-sm text-[#7a4c4c]">Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_60px_rgba(77,10,15,0.12)]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-red-800">Error Loading Profile</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchHospitalProfile}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!hospital) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_60px_rgba(77,10,15,0.12)]">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#8f0f1a]">
            Profile & Settings
          </p>
          <h3 className="text-2xl font-semibold text-[#2f1012]">
            Hospital Identity
          </h3>
          <p className="text-sm text-[#7a4c4c]">
            Maintain licensed information synced with SEBN compliance desk.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-[#f3c9c0] px-5 py-2 text-xs font-semibold text-[#8f0f1a] transition hover:border-[#8f0f1a]">
            Update Details
          </button>
          <button className="rounded-full bg-linear-to-r from-[#8f0f1a] to-[#c62832] px-5 py-2 text-xs font-semibold text-white shadow-[0_15px_35px_rgba(143,15,26,0.25)]">
            Download SOP Pack
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-[#f6ddd4] bg-[#fff9f6] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b05f09]">
            Registration Details
          </p>
          <dl className="mt-4 space-y-3 text-sm text-[#553334]">
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Hospital Name</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.name}
              </dd>
            </div>
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Hospital Code</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.hospitalCode || "N/A"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Registration Number</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.registrationNumber}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Verification Status</dt>
              <dd className={`font-semibold ${getStatusColor(hospital.verificationStatus)}`}>
                {hospital.verificationStatus}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-[#f6ddd4] bg-[#fff9f6] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b05f09]">
            Contact
          </p>
          <dl className="mt-4 space-y-3 text-sm text-[#553334]">
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Email</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.email}
              </dd>
            </div>
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Phone</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.phone}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>City</dt>
              <dd className="font-semibold text-[#2f1012]">
                {hospital.city}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="rounded-2xl border border-[#f6ddd4] bg-[#fff9f6] p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b05f09]">
          Facility Footprint
        </p>
        <p className="mt-3 text-sm text-[#6a3a3a]">{hospital.address}</p>
        
        {hospital.location && hospital.location.coordinates && (
          <div className="mt-3 text-xs text-[#8b6161]">
            <strong>Coordinates:</strong> {hospital.location.coordinates[1]}, {hospital.location.coordinates[0]}
          </div>
        )}

        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#8f0f1a]">
            {hospital.specialties.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#f3c9c0] bg-white px-4 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Additional Information */}
      <article className="rounded-2xl border border-[#f6ddd4] bg-[#fff9f6] p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b05f09]">
          System Information
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-[#553334] md:grid-cols-2">
          <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
            <dt>Account Status</dt>
            <dd className="font-semibold text-[#2f1012]">
              {hospital.isActive ? "Active" : "Inactive"}
            </dd>
          </div>
          <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
            <dt>Registered On</dt>
            <dd className="font-semibold text-[#2f1012]">
              {new Date(hospital.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </dd>
          </div>
          <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
            <dt>Last Updated</dt>
            <dd className="font-semibold text-[#2f1012]">
              {new Date(hospital.updatedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </dd>
          </div>
          {hospital.verifiedAt && (
            <div className="flex justify-between border-b border-[#f6ddd4] pb-2">
              <dt>Verified On</dt>
              <dd className="font-semibold text-[#1f7a3a]">
                {new Date(hospital.verifiedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
          )}
        </dl>
      </article>

      {/* Verification Status Alert */}
      {hospital.verificationStatus === 'PENDING' && (
        <div className="rounded-2xl border border-[#f0c18c] bg-[#fff3e4] p-4">
          <p className="text-sm font-semibold text-[#b05f09]">
            ⏳ Verification Pending
          </p>
          <p className="mt-1 text-xs text-[#8b6161]">
            Your hospital registration is under review by the SEBN admin team. 
            Some features may be limited until verification is complete.
          </p>
        </div>
      )}

      {hospital.verificationStatus === 'SUSPENDED' && (
        <div className="rounded-2xl border border-[#f5a5ad] bg-[#fde4e4] p-4">
          <p className="text-sm font-semibold text-[#9e121c]">
            🚫 Account Suspended
          </p>
          <p className="mt-1 text-xs text-[#8b6161]">
            Your hospital account has been suspended. Please contact the SEBN admin team for more information.
          </p>
        </div>
      )}

      {hospital.verificationStatus === 'VERIFIED' && (
        <div className="rounded-2xl border border-[#a2d8b3] bg-[#ecf8ef] p-4">
          <p className="text-sm font-semibold text-[#1f7a3a]">
            ✓ Verified Hospital
          </p>
          <p className="mt-1 text-xs text-[#6b3c3c]">
            Your hospital is verified and has full access to all SEBN features.
          </p>
        </div>
      )}
    </section>
  );
}
