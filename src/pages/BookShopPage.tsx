import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusCircle,
  BookOpen,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  Tag,
  X,
  AlertCircle,
  Trash2,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  BookListing,
  SRI_LANKAN_DISTRICTS,
  PRESET_COVER_IMAGES
} from '@/data/bookShopData';

const LOCAL_STORAGE_KEY = 'siparana_bookshop_listings';
const WISHLIST_STORAGE_KEY = 'siparana_bookshop_wishlist';

export default function BookShopPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // State: user listings & wishlist
  const [listings, setListings] = useState<BookListing[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [showOnlyMyListings, setShowOnlyMyListings] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Modals state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [activeBookDetails, setActiveBookDetails] = useState<BookListing | null>(null);

  // New Listing Form State
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState<BookListing['category']>('School Books');
  const [formGrade, setFormGrade] = useState<BookListing['gradeLevel']>('Grade 10-11 (O/L)');
  const [formSubject, setFormSubject] = useState('');
  const [formMedium, setFormMedium] = useState<BookListing['medium']>('Sinhala');
  const [formCondition, setFormCondition] = useState<BookListing['condition']>('Like New');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCoverImage, setFormCoverImage] = useState(PRESET_COVER_IMAGES[0]?.url || '');
  const [formCustomImageUrl, setFormCustomImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSellerName, setFormSellerName] = useState(profile?.name || '');
  const [formSellerRole, setFormSellerRole] = useState<BookListing['sellerRole']>(
    profile?.role === 'teacher' ? 'Teacher' : profile?.role === 'parent' ? 'Parent' : 'Student'
  );
  const [formSellerPhone, setFormSellerPhone] = useState(profile?.phone || '+94 77 ');
  const [formSellerDistrict, setFormSellerDistrict] = useState(profile?.district || 'Colombo');
  const [formDeliveryAvailable, setFormDeliveryAvailable] = useState(true);
  const [formFreeDelivery, setFormFreeDelivery] = useState(false);
  const [formPickupLocation, setFormPickupLocation] = useState('');
  const [formHighlightInput, setFormHighlightInput] = useState('');
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listings));
    } catch {
      // ignore
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Wishlist toggle
  const toggleWishlist = (bookId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // Add highlight helper
  const addHighlight = () => {
    if (formHighlightInput.trim()) {
      setFormHighlights(prev => [...prev, formHighlightInput.trim()]);
      setFormHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormHighlights(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Form Submit
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim() || !formAuthor.trim() || !formPrice.trim()) {
      setFormError('Please fill in the required fields (Title, Author, and Price).');
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price in LKR.');
      return;
    }

    const finalImage = formCustomImageUrl.trim() || formCoverImage;

    const categorySiMap: Record<BookListing['category'], string> = {
      'School Books': 'පාසල් පෙළපොත්',
      'Teacher Notes': 'ගුරු සටහන් & නිබන්ධන',
      'Creative Work': 'නිර්මාණශීලී කෘති',
      'Past Paper Collections': 'පසුගිය ප්‍රශ්න පත්‍ර'
    };

    const categoryTaMap: Record<BookListing['category'], string> = {
      'School Books': 'பாடசாலை பாடப்புத்தகங்கள்',
      'Teacher Notes': 'ஆசிரியர் குறிப்புகள்',
      'Creative Work': 'படைப்பிலக்கியம் & புதினங்கள்',
      'Past Paper Collections': 'கடந்த கால வினாத்தாள் தொகுப்புகள்'
    };

    const newBook: BookListing = {
      id: 'user-book-' + Date.now(),
      title: formTitle.trim(),
      author: formAuthor.trim(),
      description: formDescription.trim() || 'Well-maintained educational book available for study & revision.',
      price: priceNum,
      originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
      category: formCategory,
      categorySi: categorySiMap[formCategory],
      categoryTa: categoryTaMap[formCategory],
      coverImage: finalImage,
      gradeLevel: formGrade,
      subject: formSubject.trim() || undefined,
      medium: formMedium,
      condition: formCondition,
      sellerName: formSellerName.trim() || 'Verified SipArana Member',
      sellerRole: formSellerRole,
      sellerPhone: formSellerPhone.trim(),
      sellerDistrict: formSellerDistrict,
      isVerifiedSeller: true,
      rating: 5.0,
      reviewsCount: 1,
      deliveryAvailable: formDeliveryAvailable,
      freeDelivery: formFreeDelivery,
      pickupLocation: formPickupLocation.trim() || undefined,
      sampleHighlights: formHighlights.length > 0 ? formHighlights : ['Includes detailed syllabus topics', 'Clean pages, ready for study'],
      createdAt: new Date().toISOString().split('T')[0],
      isUserListing: true
    };

    setListings(prev => [newBook, ...prev]);
    setIsListingModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormAuthor('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormDescription('');
    setFormHighlights([]);
    setFormCustomImageUrl('');
    setFormPickupLocation('');

    // Open newly created item details
    setActiveBookDetails(newBook);
  };

  // Delete own listing
  const handleDeleteListing = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this book listing from SipArana Book Shop?')) {
      setListings(prev => prev.filter(b => b.id !== bookId));
      if (activeBookDetails?.id === bookId) {
        setActiveBookDetails(null);
      }
    }
  };

  const userListings = listings.filter(b => b.isUserListing);
  const wishlistedListings = listings.filter(b => wishlist.includes(b.id));
  const activeCustomListings = showOnlyMyListings
    ? userListings
    : showWishlistOnly
    ? wishlistedListings
    : [];

  return (
    <div className="space-y-6 pb-20 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* 1. HERO BANNER - BLUE & GOLD SIGNATURE THEME (RETAINED AS REQUESTED) */}
      <section
        id="bookshop-hero-header"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 md:p-10 border border-amber-500/20 shadow-xl"
      >
        {/* Glow & Pattern Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SipArana Educational Marketplace • ශ්‍රී ලාංකීය අධ්‍යාපනික පොත් වෙළඳපොළ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-serif">
              SipArana <span className="text-amber-400">Book Shop</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {language === 'si'
                ? 'සිසුන්, ගුරුවරුන් සහ දෙමාපියන් සඳහා වූ නිල පොත් වෙළඳපොළ. විෂය නිර්දේශිත පෙළපොත්, සම්මන්ත්‍රණ නිබන්ධන, සාහිත්‍ය නිර්මාණ සහ පසුගිය ප්‍රශ්න පත්‍ර සාධාරණ මිලට මිලදී ගන්න හෝ ඔබේ පොත් විකුණන්න.'
                : language === 'ta'
                ? 'மாணவர்கள், ஆசிரியர்கள் மற்றும் பெற்றோர்களுக்கான நம்பகமான கல்விப் புத்தகச் சந்தை. பாடநூல்கள், வழிகாட்டிகள், மாதிரி வினாத்தாள்கள் மற்றும் படைப்பிலக்கியங்களை நியாயமான விலையில் வாங்க அல்லது விற்கவும்.'
                : 'The trusted Sri Lankan marketplace for students, teachers, and parents to buy, sell, and share curriculum textbooks, master teacher notes, creative works, and past paper compilations with 0% platform commission.'}
            </p>

            {/* Quick Trust Highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Community</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Islandwide Courier & Local Pickup</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <Tag className="w-4 h-4 text-blue-400" />
                <span>Zero Commission Direct Seller Connection</span>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
            <button
              id="list-book-btn"
              onClick={() => setIsListingModalOpen(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>
                {language === 'si'
                  ? 'ඔබේ පොත විකිණීමට එක්කරන්න'
                  : language === 'ta'
                  ? 'புத்தகத்தை விற்க பதிவேற்றுக'
                  : 'List a Book for Sale'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                id="my-listings-btn"
                onClick={() => {
                  setShowOnlyMyListings(prev => !prev);
                  setShowWishlistOnly(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  showOnlyMyListings
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/10 text-white hover:bg-white/15 border-white/15'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {language === 'si' ? 'මගේ පොත්' : 'My Listings'} ({userListings.length})
                </span>
              </button>

              <button
                id="wishlist-btn"
                onClick={() => {
                  setShowWishlistOnly(prev => !prev);
                  setShowOnlyMyListings(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  showWishlistOnly
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/10 text-white hover:bg-white/15 border-white/15'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-current' : ''}`} />
                <span>
                  {language === 'si' ? 'සුරැකි පොත්' : 'Wishlist'} ({wishlist.length})
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* User's own active listings or wishlist if toggled by buttons */}
      {(showOnlyMyListings || showWishlistOnly) && (
        <section className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {showOnlyMyListings ? (
                <>
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>{language === 'si' ? 'මගේ පොත් ලැයිස්තුව' : 'My Uploaded Book Listings'}</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>{language === 'si' ? 'සුරැකි පොත් එකතුව' : 'My Wishlist'}</span>
                </>
              )}
            </h2>
            <button
              onClick={() => {
                setShowOnlyMyListings(false);
                setShowWishlistOnly(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{language === 'si' ? 'වසන්න' : 'Close'}</span>
            </button>
          </div>

          {activeCustomListings.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500">
                {showOnlyMyListings
                  ? language === 'si'
                    ? 'ඔබ තවමත් කිසිදු පොතක් විකිණීමට එක්කර නොමැත.'
                    : 'You have not listed any books yet. Click "List a Book for Sale" above.'
                  : language === 'si'
                  ? 'සුරැකි පොත් කිසිවක් නොමැත.'
                  : 'Your wishlist is currently empty.'}
              </p>
              {showOnlyMyListings && (
                <button
                  onClick={() => setIsListingModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  {language === 'si' ? 'පොතක් එක්කරන්න' : 'List a Book Now'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCustomListings.map(book => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">by {book.author}</p>
                      <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                        Rs. {book.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">{book.gradeLevel}</span>
                    {book.isUserListing && (
                      <button
                        onClick={e => handleDeleteListing(book.id, e)}
                        className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIST A BOOK FOR SALE (SELLER INTERFACE) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isListingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between border-b border-amber-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <PlusCircle className="w-4 h-4" />
                    <span>SELLER UPLOAD PORTAL • පොත් විකිණීමේ පෝරමය</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-serif">
                    List Your Educational Material for Sale
                  </h3>
                  <p className="text-xs text-slate-300">
                    Directly reach thousands of active students and teachers across Sri Lanka.
                  </p>
                </div>

                <button
                  onClick={() => setIsListingModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateListing} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* 1. Basic Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    1. Book & Curriculum Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Book Title * (පොතේ නම)
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="e.g. A/L Combined Maths Revision Guide"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Author / Publisher * (කර්තෘ / ප්‍රකාශක)
                      </label>
                      <input
                        type="text"
                        required
                        value={formAuthor}
                        onChange={e => setFormAuthor(e.target.value)}
                        placeholder="e.g. Master Teacher / EPD Ministry"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category * (වර්ගීකරණය)
                      </label>
                      <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="School Books">School Books (පාසල් පෙළපොත්)</option>
                        <option value="Teacher Notes">Teacher Notes (ගුරු සටහන් & නිබන්ධන)</option>
                        <option value="Creative Work">Creative Work (නිර්මාණශීලී කෘති)</option>
                        <option value="Past Paper Collections">Past Paper Collections (පසුගිය ප්‍රශ්න පත්‍ර)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Grade Level (ශ්‍රේණිය)
                      </label>
                      <select
                        value={formGrade}
                        onChange={e => setFormGrade(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Grade 6-9">Grade 6-9 (කණිෂ්ඨ)</option>
                        <option value="Grade 10-11 (O/L)">Grade 10-11 (O/L)</option>
                        <option value="Grade 12-13 (A/L)">Grade 12-13 (A/L)</option>
                        <option value="University">University Level</option>
                        <option value="General">General / All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Medium (මාධ්‍යය)
                      </label>
                      <select
                        value={formMedium}
                        onChange={e => setFormMedium(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Sinhala">Sinhala (සිංහල)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="English">English</option>
                        <option value="Bilingual">Bilingual</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Condition & Pricing */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    2. Condition & Price in LKR (මිල හා තත්ත්වය)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Condition (තත්ත්වය)
                      </label>
                      <select
                        value={formCondition}
                        onChange={e => setFormCondition(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Brand New">Brand New (අලුත්ම)</option>
                        <option value="Like New">Like New (ඉතා හොඳ)</option>
                        <option value="Good">Good (හොඳ)</option>
                        <option value="Fair">Fair (සාමාන්‍ය)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Selling Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formPrice}
                        onChange={e => setFormPrice(e.target.value)}
                        placeholder="e.g. 850"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Original MRP (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formOriginalPrice}
                        onChange={e => setFormOriginalPrice(e.target.value)}
                        placeholder="e.g. 1400"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Cover Image Selection */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    3. Cover Illustration / Photo
                  </h4>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_COVER_IMAGES.map((img, idx) => (
                      <button
                        key={img.url || idx}
                        type="button"
                        onClick={() => {
                          setFormCoverImage(img.url);
                          setFormCustomImageUrl('');
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-3/4 border-2 transition ${
                          formCoverImage === img.url && !formCustomImageUrl
                            ? 'border-amber-500 ring-2 ring-amber-500/30'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-white text-[9px] py-0.5 text-center truncate px-1">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Or Custom Image URL (විකල්ප පින්තූර සබැඳිය)
                    </label>
                    <input
                      type="url"
                      value={formCustomImageUrl}
                      onChange={e => setFormCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* 4. Description & Highlights */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    4. Description & Key Highlights
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Detailed Book Description (විස්තරය)
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="Mention condition details, past student notes inside, edition year, etc."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Key Highlights / Bullets (විශේෂ කරුණු)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formHighlightInput}
                        onChange={e => setFormHighlightInput(e.target.value)}
                        placeholder="e.g. Includes 2018-2024 model papers"
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        Add
                      </button>
                    </div>

                    {formHighlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formHighlights.map((hl, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-semibold"
                          >
                            <span>{hl}</span>
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeHighlight(i)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Seller Contact Details */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    5. Seller & Location Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Seller Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSellerName}
                        onChange={e => setFormSellerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formSellerPhone}
                        onChange={e => setFormSellerPhone(e.target.value)}
                        placeholder="+94 77 ..."
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        District (දිස්ත්‍රික්කය)
                      </label>
                      <select
                        value={formSellerDistrict}
                        onChange={e => setFormSellerDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      >
                        {SRI_LANKAN_DISTRICTS.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="deliveryCheck"
                        checked={formDeliveryAvailable}
                        onChange={e => setFormDeliveryAvailable(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor="deliveryCheck" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        Islandwide Courier Delivery Available
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={formPickupLocation}
                        onChange={e => setFormPickupLocation(e.target.value)}
                        placeholder="In-person pickup town (e.g. Nugegoda)"
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95 transition"
                  >
                    Publish Listing Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: ACTIVE BOOK DETAILS */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeBookDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  {activeBookDetails.title}
                </h3>
                <button
                  onClick={() => setActiveBookDetails(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeBookDetails.description}
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300 font-bold">
                  Price: Rs. {activeBookDetails.price.toLocaleString()} • Seller: {activeBookDetails.sellerName} ({activeBookDetails.sellerDistrict})
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
