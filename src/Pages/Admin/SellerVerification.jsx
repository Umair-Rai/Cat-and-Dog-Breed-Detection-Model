import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  PhotoIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SellerVerification = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [petStatusFilter, setPetStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' or 'pets'
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  // Fetch sellers from API
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/sellers');
      setSellers(response.data);
      setFilteredSellers(response.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter sellers and pets
  useEffect(() => {
    let filtered = sellers.filter(seller => {
      const matchesSearch = seller.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seller.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'sellers') {
        const matchesVerification = verificationFilter === 'all' || 
                                   (verificationFilter === "verified" && seller.isVerified === "approved") ||
                                   (verificationFilter === "pending" && seller.isVerified === "pending") ||
                                   (verificationFilter === "rejected" && seller.isVerified === "rejected");
        return matchesSearch && matchesVerification;
      }
      
      return matchesSearch;
    });

    setFilteredSellers(filtered);
  }, [sellers, searchQuery, verificationFilter, petStatusFilter, activeTab]);

  // Get all pets from all sellers for pet verification tab
  const getAllPets = () => {
    const allPets = [];
    sellers.forEach(seller => {
      seller.register_pet?.forEach(pet => {
        allPets.push({
          ...pet,
          sellerId: seller._id,
          sellerName: seller.name,
          sellerEmail: seller.email,
          sellerPhone: seller.phone
        });
      });
    });
    
    return allPets.filter(pet => {
      const matchesSearch = pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pet.pet_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pet.sellerName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = petStatusFilter === 'all' || pet.status === petStatusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const handleVerifySeller = async (sellerId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/sellers/${sellerId}/verify`, {
        status, // "approved" or "rejected"
       adminComment
     });
      fetchSellers();
      setShowSellerModal(false);
      setAdminComment('');
   } catch (error) {
      console.error('Error verifying seller:', error);
    }
  };


  const handleVerifyPet = async (sellerId, petIndex, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/sellers/${sellerId}/pets/${petIndex}`, {
        status,
        admin_comment: adminComment
      });
      fetchSellers();
      setShowPetModal(false);
      setAdminComment('');
    } catch (error) {
      console.error('Error verifying pet:', error);
    }
  };

const getVerificationBadge = (status) => {
  if (status === "approved") return <Badge text="Verified" status="delivered" />;
  if (status === "rejected") return <Badge text="Rejected" status="cancelled" />;
  return <Badge text="Pending" status="pending" />;
};


  const getPetStatusBadge = (status) => {
    const statusMap = {
      pending: 'pending',
      approved: 'delivered',
      rejected: 'cancelled'
    };
    return <Badge text={status} status={statusMap[status] || 'pending'} />;
  };

  // Calculate stats
  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter(s => s.isVerified === "approved").length;
  const pendingSellers = sellers.filter(s => s.isVerified === "pending").length;
  const rejectedSellers = sellers.filter(s => s.isVerified === "rejected").length;
  const allPets = getAllPets();
  const pendingPets = allPets.filter(pet => pet.status === 'pending').length;
  const approvedPets = allPets.filter(pet => pet.status === 'approved').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading sellers...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Seller & Pet Verification</h1>
        </div>
        <p className="text-gray-600">Two-stage verification process for sellers and their pet breeding services.</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sellers</p>
                <p className="text-2xl font-bold text-gray-800">{totalSellers}</p>
              </div>
              <UserIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Sellers</p>
                <p className="text-2xl font-bold text-green-600">{verifiedSellers}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Sellers</p>
                <p className="text-2xl font-bold text-orange-600">{pendingSellers}</p>
              </div>
              <ClipboardDocumentListIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Pets</p>
                <p className="text-2xl font-bold text-red-600">{pendingPets}</p>
              </div>
              <HeartIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Pets</p>
                <p className="text-2xl font-bold text-purple-600">{approvedPets}</p>
              </div>
              <HeartIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-1 rounded-xl shadow-sm border mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'sellers'
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            Seller Verification
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pets'
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <HeartIcon className="h-5 w-5" />
            Pet Breeding Registration
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={activeTab === 'sellers' ? 'Search by seller name or email...' : 'Search by pet breed, type, or seller...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeTab === 'sellers' ? (
              <Select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Sellers" },
                  { value: "verified", label: "Verified" },
                  { value: "pending", label: "Pending" },
                  { value: "rejected", label: "Rejected" }
                ]}
                className="min-w-[160px]"
              />
            ) : (
              <Select
                value={petStatusFilter}
                onChange={(e) => setPetStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Pets' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
                className="min-w-[140px]"
              />
            )}
            <Button
              onClick={fetchSellers}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'sellers' ? (
        /* Seller Verification Section */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <div key={seller._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Seller Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {seller.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                      <p className="text-sm text-gray-500">ID: #{seller._id.slice(-6)}</p>
                    </div>
                  </div>
                  {getVerificationBadge(seller.isVerified)}
                </div>

                {/* Seller Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="truncate">{seller.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{seller.phone}</span>
                  </div>
                  {seller.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="truncate">{seller.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>CNIC: {seller.cnic || 'Not provided'}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{seller.register_pet?.length || 0}</p>
                    <p className="text-xs text-gray-500">Registered Pets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {seller.register_pet?.filter(pet => pet.status === 'approved').length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Approved Pets</p>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mb-4">
                  Joined: {new Date(seller.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSeller(seller);
                      setShowSellerModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Review Details
                  </button>
                  {seller.isVerified === "pending" && (
                  <>
                    <button
                      onClick={() => handleVerifySeller(seller._id, "approved")}
                      className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                    <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                       onClick={() => handleVerifySeller(seller._id, "rejected")}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                    <XMarkIcon className="h-4 w-4" />
                    </button>
                    </>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Pet Breeding Registration Section */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {getAllPets().map((pet, index) => (
            <div key={`${pet.sellerId}-${index}`} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Pet Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {pet.images && pet.images.length > 0 ? (
                      <img 
                        src={pet.images[0]} 
                        alt={pet.breed}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                        <HeartIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{pet.breed}</h3>
                      <p className="text-sm text-gray-500">{pet.pet_type} • {pet.gender}</p>
                    </div>
                  </div>
                  {getPetStatusBadge(pet.status)}
                </div>

                {/* Pet Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{pet.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{pet.gender}</span>
                  </div>
                  {pet.descriptions && (
                    <div className="text-sm">
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-800 mt-1 text-xs">{pet.descriptions.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-900">{pet.sellerName}</p>
                  <p className="text-xs text-gray-500">{pet.sellerEmail}</p>
                  <p className="text-xs text-gray-500">{pet.sellerPhone}</p>
                </div>

                {/* Admin Comment */}
                {pet.admin_comment && (
                  <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                    <p className="text-xs text-yellow-800">
                      <strong>Admin Comment:</strong> {pet.admin_comment}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPet({ ...pet, petIndex: index });
                      setShowPetModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Review
                  </button>
                  {pet.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerifyPet(pet.sellerId, index, 'approved')}
                        className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleVerifyPet(pet.sellerId, index, 'rejected')}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'sellers' && filteredSellers.length === 0) || 
        (activeTab === 'pets' && getAllPets().length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'sellers' ? (
            <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          ) : (
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'sellers' ? 'sellers' : 'pets'} found
          </h3>
          <p className="text-gray-500">
            No {activeTab === 'sellers' ? 'sellers' : 'pets'} match your current filters.
          </p>
        </div>
      )}

      {/* Seller Detail Modal */}
      {showSellerModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Seller Verification Details</h2>
                <button
                  onClick={() => setShowSellerModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Seller Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {selectedSeller.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{selectedSeller.name}</p>
                        <p className="text-gray-500">Seller ID: #{selectedSeller._id}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedSeller.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedSeller.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNIC:</span>
                        <span className="font-medium">{selectedSeller.cnic || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getVerificationBadge(selectedSeller.isVerified)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Business Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium mt-1">{selectedSeller.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Services Offered:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSeller.services_offered?.map((service, index) => (
                          <Badge key={index} text={service} status="delivered" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">
                        {new Date(selectedSeller.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registered Pets */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Registered Pets ({selectedSeller.register_pet?.length || 0})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSeller.register_pet?.map((pet, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pet.breed}</h4>
                        {getPetStatusBadge(pet.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Type: {pet.pet_type}</p>
                        <p>Gender: {pet.gender}</p>
                        <p>Age: {pet.age} years</p>
                        {pet.admin_comment && (
                          <p className="text-yellow-600">Comment: {pet.admin_comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              {selectedSeller.isVerified === "pending" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Verification Decision</h3>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Add a comment about the verification decision..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVerifySeller(selectedSeller._id, "approved")}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Approve Seller
                    </Button>
                    <Button
                      onClick={() => handleVerifySeller(selectedSeller._id, "rejected")}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Reject Seller
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pet Detail Modal */}
      {showPetModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pet Breeding Registration Details</h2>
                <button
                  onClick={() => setShowPetModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Pet Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Pet Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      {selectedPet.images && selectedPet.images.length > 0 ? (
                        <img 
                          src={selectedPet.images[0]} 
                          alt={selectedPet.breed}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                          <HeartIcon className="h-8 w-8" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-lg">{selectedPet.breed}</p>
                        <p className="text-gray-500">{selectedPet.pet_type}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">{selectedPet.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedPet.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getPetStatusBadge(selectedPet.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Seller Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedPet.sellerName?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className="font-medium">{selectedPet.sellerName}</p>
                        <p className="text-sm text-gray-500">{selectedPet.sellerEmail}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedPet.sellerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pet Description */}
              {selectedPet.descriptions && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedPet.descriptions}</p>
                </div>
              )}

              {/* Pet Images */}
              {selectedPet.images && selectedPet.images.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedPet.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${selectedPet.breed} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Report */}
              {selectedPet.medical_report && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">Medical Report</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <a 
                      href={selectedPet.medical_report} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      View Medical Report
                    </a>
                  </div>
                </div>
              )}

              {/* Previous Admin Comment */}
              {selectedPet.admin_comment && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">Previous Admin Comment</h3>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">{selectedPet.admin_comment}</p>
                </div>
              )}

              {/* Admin Actions */}
              {selectedPet.status === 'pending' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Verification Decision</h3>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Add a comment about the verification decision..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVerifyPet(selectedPet.sellerId, selectedPet.petIndex, 'approved')}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Approve Pet
                    </Button>
                    <Button
                      onClick={() => handleVerifyPet(selectedPet.sellerId, selectedPet.petIndex, 'rejected')}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Reject Pet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerVerification;
