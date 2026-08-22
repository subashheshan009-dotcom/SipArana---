import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  BookOpen,
  Sparkles,
  Heart,
  Eye,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  X,
  Send,
  AlertCircle,
  ArrowRight,
  Bookmark,
  Share2,
  Trash2,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  BookListing,
  INITIAL_BOOK_LISTINGS,
  SRI_LANKAN_DISTRICTS,
  PRESET_COVER_IMAGES
} from '@/data/bookShopData';

const LOCAL_STORAGE_KEY = 'siparana_bookshop_listings';
const WISHLIST_STORAGE_KEY = 'siparana_bookshop_wishlist';

type CategoryFilter = 'All' | 'School Books' | 'Teacher Notes' | 'Creative Work' | 'Past Paper Collections';

export default function BookShopPage() {
  const { profile } = useAuth();
  const { language } = useLanguage();

  // State: listings & wishlist
  const [listings, setListings] = useState<BookListing[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_BOOK_LISTINGS;
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

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');
  const [showOnlyMyListings, setShowOnlyMyListings] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modals state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [activeBookDetails, setActiveBookDetails] = useState<BookListing | null>(null);
  const [contactingBook, setContactingBook] = useState<BookListing | null>(null);
  const [orderingBook, setOrderingBook] = useState<BookListing | null>(null);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

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
  const [formCoverImage, setFormCoverImage] = useState(PRESET_COVER_IMAGES[0].url);
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

  // Order modal form state
  const [orderName, setOrderName] = useState(profile?.name || '');
  const [orderPhone, setOrderPhone] = useState(profile?.phone || '+94 77 ');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderDeliveryType, setOrderDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');

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

  // Submit new listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Please enter the book title.');
      return;
    }
    if (!formAuthor.trim()) {
      setFormError('Please enter the author or publisher name.');
      return;
    }
    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid selling price in LKR.');
      return;
    }
    if (!formSellerPhone.trim() || formSellerPhone.length < 9) {
      setFormError('Please provide a valid contact phone or WhatsApp number.');
      return;
    }

    const finalImage = formCustomImageUrl.trim() || formCoverImage;

    const categorySiMap: Record<BookListing['category'], string> = {
      'School Books': 'පාසල් පෙළපොත්',
      'Teacher Notes': 'ගුරු සටහන් & නිබන්ධන',
      'Creative Work': 'නිර්මාණශීලී කෘති',
      'Past Paper Collections': 'පසුගිය විභාග ප්‍රශ්න පත්‍ර'
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

  // Filtered & Sorted items
  const filteredListings = useMemo(() => {
    return listings.filter(book => {
      // Category filter
      if (selectedCategory !== 'All' && book.category !== selectedCategory) {
        return false;
      }
      // Grade filter
      if (selectedGrade !== 'All' && book.gradeLevel !== selectedGrade) {
        return false;
      }
      // Medium filter
      if (selectedMedium !== 'All' && book.medium !== selectedMedium) {
        return false;
      }
      // Condition filter
      if (selectedCondition !== 'All' && book.condition !== selectedCondition) {
        return false;
      }
      // District filter
      if (selectedDistrict !== 'All' && book.sellerDistrict !== selectedDistrict) {
        return false;
      }
      // My listings only
      if (showOnlyMyListings && !book.isUserListing) {
        return false;
      }
      // Wishlist only
      if (showWishlistOnly && !wishlist.includes(book.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchSi = book.titleSi?.toLowerCase().includes(q);
        const matchTa = book.titleTa?.toLowerCase().includes(q);
        const matchAuthor = book.author.toLowerCase().includes(q);
        const matchSubject = book.subject?.toLowerCase().includes(q);
        const matchDistrict = book.sellerDistrict.toLowerCase().includes(q);
        const matchDesc = book.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSi && !matchTa && !matchAuthor && !matchSubject && !matchDistrict && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price_low') {
        return a.price - b.price;
      }
      if (sortBy === 'price_high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [
    listings,
    selectedCategory,
    selectedGrade,
    selectedMedium,
    selectedCondition,
    selectedDistrict,
    showOnlyMyListings,
    showWishlistOnly,
    searchQuery,
    sortBy,
    wishlist
  ]);

  // WhatsApp link generator
  const getWhatsAppLink = (book: BookListing, inquiryType: 'order' | 'inquiry') => {
    const cleanPhone = book.sellerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('94') ? cleanPhone : cleanPhone.startsWith('0') ? '94' + cleanPhone.slice(1) : '94' + cleanPhone;
    
    let message = '';
    if (inquiryType === 'order') {
      message = `Hello ${book.sellerName}, I am placing an order for "${book.title}" (Rs. ${book.price}) via SipArana Book Shop.\nName: ${orderName}\nPhone: ${orderPhone}\nDelivery: ${orderDeliveryType === 'courier' ? 'Islandwide Courier to ' + orderAddress : 'In-person Pickup'}\nQty: ${orderQuantity}`;
    } else {
      message = `Hello ${book.sellerName}, I am interested in your book listing on SipArana Book Shop:\n"${book.title}" (Rs. ${book.price}). Is this still available?`;
    }

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingBook) return;

    if (!orderName.trim() || !orderPhone.trim()) {
      alert('Please provide your name and contact phone number.');
      return;
    }
    if (orderDeliveryType === 'courier' && !orderAddress.trim()) {
      alert('Please provide your delivery address for islandwide courier.');
      return;
    }

    // Open WhatsApp directly
    const link = getWhatsAppLink(orderingBook, 'order');
    window.open(link, '_blank');

    setOrderSuccessMessage(`Order inquiry successfully prepared for "${orderingBook.title}". WhatsApp window opened to connect directly with ${orderingBook.sellerName}!`);
    setTimeout(() => {
      setOrderingBook(null);
      setOrderSuccessMessage(null);
    }, 4000);
  };

  const categoriesConfig: { id: CategoryFilter; en: string; si: string; ta: string; count: number }[] = [
    {
      id: 'All',
      en: 'All Materials',
      si: 'සියලු පොත්පත්',
      ta: 'அனைத்து பொருட்கள்',
      count: listings.length
    },
    {
      id: 'School Books',
      en: 'School Textbooks',
      si: 'පාසල් පෙළපොත්',
      ta: 'பாடசாலை பாடப்புத்தகங்கள்',
      count: listings.filter(b => b.category === 'School Books').length
    },
    {
      id: 'Teacher Notes',
      en: 'Teacher Notes & Guides',
      si: 'ගුරු සටහන් & නිබන්ධන',
      ta: 'ஆசிரியர் குறிப்புகள்',
      count: listings.filter(b => b.category === 'Teacher Notes').length
    },
    {
      id: 'Creative Work',
      en: 'Creative Literature',
      si: 'නිර්මාණශීලී කෘති',
      ta: 'படைப்பிலக்கியம்',
      count: listings.filter(b => b.category === 'Creative Work').length
    },
    {
      id: 'Past Paper Collections',
      en: 'Past Paper Compilations',
      si: 'පසුගිය විභාග ප්‍රශ්න පත්‍ර',
      ta: 'கடந்த கால வினாத்தாள்கள்',
      count: listings.filter(b => b.category === 'Past Paper Collections').length
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* 1. HERO BANNER - BLUE & GOLD SIGNATURE THEME */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 md:p-10 border border-amber-500/20 shadow-xl">
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
              onClick={() => setIsListingModalOpen(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{language === 'si' ? 'ඔබේ පොත විකිණීමට එක්කරන්න' : language === 'ta' ? 'புத்தகத்தை விற்க பதிவேற்றுக' : 'List a Book for Sale'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowOnlyMyListings(prev => !prev);
                  setShowWishlistOnly(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  showOnlyMyListings
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-white/10 text-white hover:bg-white/15 border-white/15'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'si' ? 'මගේ පොත්' : 'My Listings'} ({listings.filter(b => b.isUserListing).length})</span>
              </button>

              <button
                onClick={() => {
                  setShowWishlistOnly(prev => !prev);
                  setShowOnlyMyListings(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  showWishlistOnly
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-white/10 text-white hover:bg-white/15 border-white/15'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-current' : ''}`} />
                <span>{language === 'si' ? 'සුරැකි පොත්' : 'Wishlist'} ({wishlist.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesConfig.map(cat => {
          const isActive = selectedCategory === cat.id && !showOnlyMyListings && !showWishlistOnly;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setShowOnlyMyListings(false);
                setShowWishlistOnly(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700'
              }`}
            >
              <span>{language === 'si' ? cat.si : language === 'ta' ? cat.ta : cat.en}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </section>

      {/* 3. SEARCH & ADVANCED FILTER CONTROLS */}
      <section className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                language === 'si'
                  ? 'පොතේ නම, කර්තෘ, විෂය හෝ නගරය සොයන්න...'
                  : language === 'ta'
                  ? 'புத்தகத்தின் பெயர், ஆசிரியர், பாடம் அல்லது மாவட்டம் தேடுங்கள்...'
                  : 'Search by book title, author, subject, or district...'
              }
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              aria-label="Filter by Grade"
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Grades (සියලු ශ්‍රේණි)</option>
              <option value="Grade 6-9">Grade 6-9 (කණිෂ්ඨ)</option>
              <option value="Grade 10-11 (O/L)">Grade 10-11 (O/L)</option>
              <option value="Grade 12-13 (A/L)">Grade 12-13 (A/L)</option>
              <option value="University">University (සරසවි)</option>
              <option value="General">General / General Read</option>
            </select>

            {/* Medium Filter */}
            <select
              value={selectedMedium}
              onChange={e => setSelectedMedium(e.target.value)}
              aria-label="Filter by Medium"
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Mediums</option>
              <option value="Sinhala">Sinhala Medium</option>
              <option value="Tamil">Tamil Medium</option>
              <option value="English">English Medium</option>
              <option value="Bilingual">Bilingual</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Sort books"
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Toggle Full Filter Drawer */}
            <button
              onClick={() => setShowMobileFilters(prev => !prev)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                showMobileFilters || selectedDistrict !== 'All' || selectedCondition !== 'All'
                  ? 'bg-amber-500/15 border-amber-400 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden text-xs"
            >
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Book Condition</label>
                <select
                  value={selectedCondition}
                  onChange={e => setSelectedCondition(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Conditions (ඕනෑම තත්ත්වය)</option>
                  <option value="Brand New">Brand New (අලුත්ම)</option>
                  <option value="Like New">Like New (ඉතා හොඳ තත්ත්වය)</option>
                  <option value="Good">Good (හොඳ තත්ත්වය)</option>
                  <option value="Fair">Fair (සාමාන්‍ය)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Seller District (දිස්ත්‍රික්කය)</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Districts (සියලු දිස්ත්‍රික්ක)</option>
                  {SRI_LANKAN_DISTRICTS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setSelectedGrade('All');
                    setSelectedMedium('All');
                    setSelectedCondition('All');
                    setSelectedDistrict('All');
                    setSearchQuery('');
                  }}
                  className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Active Filter Tags */}
      {(selectedCategory !== 'All' ||
        selectedGrade !== 'All' ||
        selectedMedium !== 'All' ||
        selectedCondition !== 'All' ||
        selectedDistrict !== 'All' ||
        searchQuery ||
        showOnlyMyListings ||
        showWishlistOnly) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>
          {showOnlyMyListings && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
              My Listings Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => setShowOnlyMyListings(false)} />
            </span>
          )}
          {showWishlistOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold">
              Wishlist Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => setShowWishlistOnly(false)} />
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
              {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedGrade !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
              {selectedGrade}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGrade('All')} />
            </span>
          )}
          {selectedDistrict !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
              District: {selectedDistrict}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict('All')} />
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
        </div>
      )}

      {/* 4. PRODUCT CARDS GRID */}
      <section>
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No matching books found in marketplace
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query, clearing filters, or be the first to list this book for other students to discover.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedGrade('All');
                  setSelectedMedium('All');
                  setSelectedCondition('All');
                  setSelectedDistrict('All');
                  setSearchQuery('');
                  setShowOnlyMyListings(false);
                  setShowWishlistOnly(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsListingModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                List Your Book
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(book => {
              const isWishlisted = wishlist.includes(book.id);
              const discountPercent =
                book.originalPrice && book.originalPrice > book.price
                  ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
                  : 0;

              return (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Top Cover Image Container */}
                  <div className="relative h-56 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Category & Condition Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide bg-blue-600 text-white shadow-md">
                        {book.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-sm text-amber-300 border border-amber-400/30">
                        {book.condition}
                      </span>
                    </div>

                    {/* Wishlist and Delete Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {book.isUserListing && (
                        <button
                          onClick={e => handleDeleteListing(book.id, e)}
                          title="Delete My Listing"
                          className="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-md transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={e => toggleWishlist(book.id, e)}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        className={`p-2 rounded-xl backdrop-blur-md shadow-md transition ${
                          isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/70 hover:bg-slate-900 text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Grade and Medium Tags at Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                      <span className="bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                        {book.gradeLevel}
                      </span>
                      <span className="bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                        {book.medium} Medium
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Title & Author */}
                      <div>
                        <h3
                          onClick={() => setActiveBookDetails(book)}
                          className="font-bold text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-amber-400 line-clamp-2 cursor-pointer transition"
                        >
                          {language === 'si' && book.titleSi ? book.titleSi : language === 'ta' && book.titleTa ? book.titleTa : book.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium">
                          by <span className="text-slate-700 dark:text-slate-300 font-semibold">{book.author}</span>
                        </p>
                      </div>

                      {/* Brief description snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>

                      {/* Seller Info Pill */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                            {book.sellerName[0]}
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                            {book.sellerName}
                          </span>
                          {book.isVerifiedSeller && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Verified Member" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{book.sellerDistrict}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Area */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      {/* Price Section */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Rs.</span>
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                              {book.price.toLocaleString()}
                            </span>
                          </div>
                          {book.originalPrice && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="line-through">Rs. {book.originalPrice.toLocaleString()}</span>
                              {discountPercent > 0 && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  {discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{book.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({book.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setOrderingBook(book);
                            setOrderQuantity(1);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'si' ? 'මිලදී ගන්න' : language === 'ta' ? 'வாங்க' : 'Buy Now'}</span>
                        </button>

                        <button
                          onClick={() => setContactingBook(book)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{language === 'si' ? 'අමතන්න' : language === 'ta' ? 'தொடர்பு' : 'Contact'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. MODAL: LIST A BOOK FOR SALE (SELLER INTERFACE) */}
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
                        Selling Price * (විකිණුම් මිල Rs.)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                        <input
                          type="number"
                          required
                          min="50"
                          step="10"
                          value={formPrice}
                          onChange={e => setFormPrice(e.target.value)}
                          placeholder="850"
                          className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Original / Printed Price (මුල් මිල Rs.)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
                        <input
                          type="number"
                          min="50"
                          step="10"
                          value={formOriginalPrice}
                          onChange={e => setFormOriginalPrice(e.target.value)}
                          placeholder="1200 (Optional)"
                          className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cover Image Selection */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    3. Book Cover Image (කවරයේ පින්තූරය)
                  </h4>

                  <div>
                    <label className="block text-xs text-slate-500 mb-2 font-medium">
                      Select a high-resolution educational preset or enter your custom image URL:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {PRESET_COVER_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormCoverImage(preset.url);
                            setFormCustomImageUrl('');
                          }}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 transition ${
                            formCoverImage === preset.url && !formCustomImageUrl
                              ? 'border-amber-500 ring-2 ring-amber-500/30'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-white p-0.5 text-center truncate">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={formCustomImageUrl}
                      onChange={e => setFormCustomImageUrl(e.target.value)}
                      placeholder="Or paste custom image URL (https://...)"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 4. Description & Key Highlights */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    4. Description & Key Features
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Description & Condition Notes (විස්තරය)
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="Describe the topics covered, included exercises, handwritten notes, binding quality, or special highlights..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Key Highlights / Feature Tags (විශේෂාංග)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formHighlightInput}
                        onChange={e => setFormHighlightInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHighlight();
                          }
                        }}
                        placeholder="e.g. Includes full answers, No highlighted text"
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    {formHighlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formHighlights.map((hl, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800"
                          >
                            <span>{hl}</span>
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeHighlight(i)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Seller Contact Information */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    5. Seller Contact & Location (සබඳතා තොරතුරු)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name * (නම)
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
                        Role (භූමිකාව)
                      </label>
                      <select
                        value={formSellerRole}
                        onChange={e => setFormSellerRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      >
                        <option value="Student">Student (ශිෂ්‍ය)</option>
                        <option value="Teacher">Teacher (ගුරුභවතුන්)</option>
                        <option value="Parent">Parent (දෙමාපියන්)</option>
                        <option value="Alumni">Alumni / Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formSellerPhone}
                        onChange={e => setFormSellerPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Pickup Location / Town (නගරය)
                      </label>
                      <input
                        type="text"
                        value={formPickupLocation}
                        onChange={e => setFormPickupLocation(e.target.value)}
                        placeholder="e.g. Nugegoda / Maharagama"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Delivery checkboxes */}
                  <div className="flex items-center gap-6 pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDeliveryAvailable}
                        onChange={e => setFormDeliveryAvailable(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Islandwide Courier Delivery Available
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFreeDelivery}
                        onChange={e => setFormFreeDelivery(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        Offer Free Delivery
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
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
      {/* 6. MODAL: BOOK FULL DETAILS & PREVIEW */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeBookDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
            >
              {/* Cover Banner */}
              <div className="relative h-64 sm:h-72 bg-slate-950 overflow-hidden">
                <img
                  src={activeBookDetails.coverImage}
                  alt={activeBookDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <button
                  onClick={() => setActiveBookDetails(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-sm transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg">
                    {activeBookDetails.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
                    {activeBookDetails.condition}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                    {activeBookDetails.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    By <span className="text-amber-400 font-semibold">{activeBookDetails.author}</span>
                  </p>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Price & Primary Action */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Rs.</span>
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {activeBookDetails.price.toLocaleString()}
                      </span>
                    </div>
                    {activeBookDetails.originalPrice && (
                      <p className="text-xs text-slate-400 line-through">
                        Original Book Price: Rs. {activeBookDetails.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const book = activeBookDetails;
                        setActiveBookDetails(null);
                        setOrderingBook(book);
                        setOrderQuantity(1);
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition"
                    >
                      Instant Buy / Order Inquiry
                    </button>
                    <button
                      onClick={() => {
                        const book = activeBookDetails;
                        setActiveBookDetails(null);
                        setContactingBook(book);
                      }}
                      className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Book Overview</h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeBookDetails.description}
                  </p>
                </div>

                {/* Sample Highlights */}
                {activeBookDetails.sampleHighlights && activeBookDetails.sampleHighlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Study Highlights & Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeBookDetails.sampleHighlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Grade Level</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeBookDetails.gradeLevel}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Medium</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeBookDetails.medium} Medium</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Condition</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeBookDetails.condition}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Listed Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeBookDetails.createdAt}</span>
                  </div>
                </div>

                {/* Seller Profile Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow">
                      {activeBookDetails.sellerName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {activeBookDetails.sellerName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {activeBookDetails.sellerRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {activeBookDetails.sellerDistrict}
                          {activeBookDetails.pickupLocation ? ` • ${activeBookDetails.pickupLocation}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{activeBookDetails.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{activeBookDetails.reviewsCount} reviews</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. MODAL: DIRECT BUY / ORDER INQUIRY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {orderingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between border-b border-amber-500/20">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <ShoppingBag className="w-4 h-4" />
                    <span>SECURE BOOK ORDER INQUIRY</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif mt-1">
                    Buy "{orderingBook.title}"
                  </h3>
                </div>

                <button
                  onClick={() => setOrderingBook(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderSuccessMessage ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Order Inquiry Dispatched!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {orderSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrderSubmit} className="p-6 space-y-4 text-xs">
                  {/* Item summary strip */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs truncate max-w-[220px]">
                        {orderingBook.title}
                      </span>
                      <span className="text-[11px] text-slate-500">Seller: {orderingBook.sellerName} ({orderingBook.sellerDistrict})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                        Rs. {(orderingBook.price * orderQuantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Quantity (පිටපත් ගණන)</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center hover:bg-slate-300"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm">{orderQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(q => q + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center hover:bg-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Buyer Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name * (නම)
                      </label>
                      <input
                        type="text"
                        required
                        value={orderName}
                        onChange={e => setOrderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Your Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={orderPhone}
                        onChange={e => setOrderPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  {/* Delivery Preference */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Delivery Method (භාරගැනීමේ ආකාරය)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderDeliveryType('courier')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                          orderDeliveryType === 'courier'
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Truck className="w-4 h-4 shrink-0" />
                        <div>
                          <div>Islandwide Courier</div>
                          <div className="text-[10px] font-normal text-slate-400">Delivered to your door</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderDeliveryType('pickup')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                          orderDeliveryType === 'pickup'
                            ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <MapPin className="w-4 h-4 shrink-0" />
                        <div>
                          <div>In-Person Pickup</div>
                          <div className="text-[10px] font-normal text-slate-400">{orderingBook.sellerDistrict} town</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {orderDeliveryType === 'courier' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Delivery Postal Address * (ලිපිනය)
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={orderAddress}
                        onChange={e => setOrderAddress(e.target.value)}
                        placeholder="House No, Street, Town, District..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderingBook(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send WhatsApp Order to Seller</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. MODAL: CONTACT SELLER POPUP */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {contactingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <Phone className="w-4 h-4" />
                  <span>DIRECT SELLER CONTACT</span>
                </div>
                <button
                  onClick={() => setContactingBook(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Seller details card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-extrabold text-base flex items-center justify-center">
                    {contactingBook.sellerName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {contactingBook.sellerName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {contactingBook.sellerRole} • {contactingBook.sellerDistrict}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span>Inquiring about: </span>
                  <span className="font-bold text-slate-900 dark:text-white">{contactingBook.title}</span>
                  <span className="text-amber-500 font-bold block mt-0.5">Rs. {contactingBook.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-2.5">
                <a
                  href={getWhatsAppLink(contactingBook, 'inquiry')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${contactingBook.sellerPhone}`}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {contactingBook.sellerPhone}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
