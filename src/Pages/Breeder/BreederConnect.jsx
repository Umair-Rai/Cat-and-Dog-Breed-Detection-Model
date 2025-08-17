import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Select from '../../components/Select';

const BreederConnect = () => {
  // State management
  const [sellers, setSellers] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  
  // Filter states
  const [filters, setFilters] = useState({
    breed: '',
    gender: '',
    ageRange: '',
    petType: '',
    location: '',
    healthStatus: 'all'
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState('newest');
  
  // Available filter options
  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];
  
  const ageRangeOptions = [
    { value: '', label: 'All Ages' },
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5+', label: '5+ years' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'age-asc', label: 'Age: Young to Old' },
    { value: 'age-desc', label: 'Age: Old to Young' },
    { value: 'breed', label: 'Breed A-Z' }
  ];

  // Fetch sellers and their pets
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/sellers');
        setSellers(response.data);
        
        // Extract all approved pets from all sellers
        const allPets = [];
        response.data.forEach(seller => {
          if (seller.isVerified && seller.register_pet) {
            seller.register_pet.forEach((pet, index) => {
              if (pet.status === 'approved') {
                allPets.push({
                  ...pet,
                  sellerId: seller._id,
                  sellerName: seller.name,
                  sellerEmail: seller.email,
                  sellerPhone: seller.phone,
                  sellerAddress: seller.address,
                  sellerProfileImage: seller.profile_image,
                  petIndex: index,
                  uniqueId: `${seller._id}-${index}`
                });
              }
            });
          }
        });
        
        setFilteredPets(allPets);
      } catch (error) {
        console.error('Error fetching sellers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellers();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('petFavorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = sellers.flatMap(seller => {
      if (!seller.isVerified || !seller.register_pet) return [];
      
      return seller.register_pet
        .map((pet, index) => ({
          ...pet,
          sellerId: seller._id,
          sellerName: seller.name,
          sellerEmail: seller.email,
          sellerPhone: seller.phone,
          sellerAddress: seller.address,
          sellerProfileImage: seller.profile_image,
          petIndex: index,
          uniqueId: `${seller._id}-${index}`
        }))
        .filter(pet => pet.status === 'approved');
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pet => 
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.pet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.descriptions.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.breed) {
      filtered = filtered.filter(pet => 
        pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }
    
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }
    
    if (filters.petType) {
      filtered = filtered.filter(pet => 
        pet.pet_type.toLowerCase().includes(filters.petType.toLowerCase())
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(pet => 
        pet.sellerAddress.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split('-').map(Number);
      if (filters.ageRange === '5+') {
        filtered = filtered.filter(pet => pet.age >= 5);
      } else {
        filtered = filtered.filter(pet => pet.age >= min && pet.age <= max);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'age-asc':
        filtered.sort((a, b) => a.age - b.age);
        break;
      case 'age-desc':
        filtered.sort((a, b) => b.age - a.age);
        break;
      case 'breed':
        filtered.sort((a, b) => a.breed.localeCompare(b.breed));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredPets(filtered);
  }, [sellers, searchTerm, filters, sortBy]);

  // Toggle favorite
  const toggleFavorite = (petId) => {
    const newFavorites = favorites.includes(petId)
      ? favorites.filter(id => id !== petId)
      : [...favorites, petId];
    
    setFavorites(newFavorites);
    localStorage.setItem('petFavorites', JSON.stringify(newFavorites));
  };

  // Handle contact form
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the contact form to your backend
    alert(`Contact request sent to ${selectedPet?.sellerName}!`);
    setShowContactModal(false);
    setContactForm({ name: '', email: '', message: '' });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      breed: '',
      gender: '',
      ageRange: '',
      petType: '',
      location: '',
      healthStatus: 'all'
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading breeding partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Breeder Connect</h1>
              <p className="mt-2 text-gray-600">Find the perfect breeding partner for your pets</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {filteredPets.length} pets available
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by breed, pet type, or seller name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Sort */}
            <div className="w-full lg:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                showFilters 
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <Input
                    type="text"
                    placeholder="Enter breed"
                    value={filters.breed}
                    onChange={(e) => setFilters({...filters, breed: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <Select
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    options={genderOptions}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <Select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
                    options={ageRangeOptions}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                  <Input
                    type="text"
                    placeholder="e.g., Dog, Cat"
                    value={filters.petType}
                    onChange={(e) => setFilters({...filters, petType: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    type="text"
                    placeholder="Enter city/area"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pet Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.uniqueId} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Pet Image */}
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden">
                    {pet.images && pet.images.length > 0 ? (
                      <img
                        src={pet.images[0]}
                        alt={`${pet.breed} ${pet.pet_type}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">🐾</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(pet.uniqueId)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    {favorites.includes(pet.uniqueId) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge text="Available" status="delivered" />
                  </div>
                </div>

                {/* Pet Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pet.breed}</h3>
                      <p className="text-sm text-gray-600">{pet.pet_type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        {pet.age} {pet.age === 1 ? 'year' : 'years'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">{pet.gender}</span>
                  </div>
                  
                  {pet.sellerAddress && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{pet.sellerAddress}</span>
                    </div>
                  )}
                  
                  {pet.descriptions && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pet.descriptions}</p>
                  )}
                  
                  {/* Seller Info */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pet.sellerName}</p>
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">Verified Breeder</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedPet(pet)}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowContactModal(true);
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pet Detail Modal */}
      {selectedPet && !showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPet.breed} - {selectedPet.pet_type}
                </h2>
                <button
                  onClick={() => setSelectedPet(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  {selectedPet.images && selectedPet.images.length > 0 ? (
                    <div className="space-y-4">
                      <img
                        src={selectedPet.images[0]}
                        alt={`${selectedPet.breed}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {selectedPet.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedPet.images.slice(1, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${selectedPet.breed} ${idx + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-6xl">🐾</span>
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Breed:</span>
                        <span className="font-medium">{selectedPet.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedPet.pet_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">{selectedPet.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedPet.age} {selectedPet.age === 1 ? 'year' : 'years'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Health Status:</span>
                        <Badge text={selectedPet.medical_report ? 'Certified' : 'Pending'} status={selectedPet.medical_report ? 'delivered' : 'pending'} />
                      </div>
                    </div>
                  </div>
                  
                  {selectedPet.descriptions && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedPet.descriptions}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Breeder Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedPet.sellerName}</p>
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">Verified Breeder</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedPet.sellerAddress && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedPet.sellerAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowContactModal(true);
                      }}
                      className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Contact Breeder
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedPet.uniqueId)}
                      className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                        favorites.includes(selectedPet.uniqueId)
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {favorites.includes(selectedPet.uniqueId) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Contact Breeder</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedPet.sellerName}</p>
                    <p className="text-sm text-gray-600">{selectedPet.breed} - {selectedPet.pet_type}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    placeholder="I'm interested in your pet for breeding purposes..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreederConnect;