// src/pages/SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@api';
import BusinessCard from '../components/BusinessCard';
import './BusinessList.css';

const categories = [
  "כל הקטגוריות",
  "אולם אירועים", "אינסטלטור", "איפור קבוע", "בית קפה", "בניית אתרים", "ברברשופ",
  "גינון / הדברה", "גלריה / חנות אומנות", "חנויות טבע / בריאות", "חנות בגדים", "חשמלאי",
  "טכנאי מזגנים", "טכנאי מחשבים", "טכנאי סלולר", "יוגה / פילאטיס", "יועץ מס / רואה חשבון",
  "כתיבת תוכן / קופירייטינג", "מאמן אישי / עסקי", "מאמן כושר", "מדיה / פרסום", "מדריך טיולים",
  "מומחה שיווק דיגיטלי", "מורה למוזיקה / אומנות", "מורה פרטי", "מזון / אוכל ביתי", "מטפל/ת הוליסטי",
  "מטפלת רגשית / NLP", "מכון יופי", "מניקור-פדיקור", "מסגר", "מסעדה", "מספרה",
  "מעצב גרפי", "מעצב פנים", "מציל / מדריך שחייה", "מרצה / מנטור", "משפחתון / צהרון / גן",
  "מתווך נדל״ן", "נגר", "נהג / שליחויות", "עורך דין", "עיצוב גבות", "פסיכולוג / יועץ",
  "צלם / סטודיו צילום", "קוסמטיקאית", "קייטרינג", "רפואה משלימה", "שיפוצניק",
  "שירותים לקהילה / עמותות", "תזונאית / דיאטנית"
];

const sortOptions = [
  { value: "newest", label: "הכי חדש" },
  { value: "alphabetical", label: "לפי שם (א-ת)" },
];

const ITEMS_PER_PAGE = 9;

const SearchBusinesses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedCategory = searchParams.get('category') || "כל הקטגוריות";
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get('/business');
        const list = response.data.businesses || [];
        setBusinesses(list);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    let filtered = businesses.filter(business => {
      const matchesSearch = (
        business.name?.toLowerCase().includes(lowerSearch) ||
        business.category?.toLowerCase().includes(lowerSearch) ||
        business.description?.toLowerCase().includes(lowerSearch)
      );
      const matchesCategory = (
        selectedCategory === "כל הקטגוריות" ||
        business.category === selectedCategory
      );
      return matchesSearch && matchesCategory;
    });
    if (sortOption === "alphabetical") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredBusinesses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption, businesses]);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBusinesses = filteredBusinesses.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "כל הקטגוריות") {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const scrollCategories = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="list-page">
      <div className="business-list-container">
        <h1>רשימת עסקים</h1>

        <input
          type="text"
          placeholder="חפש לפי שם, קטגוריה או תיאור..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        <div className="categories-scroll-wrapper">
          <button className="scroll-arrow left" onClick={() => scrollCategories("left")}>&#8678;</button>
          <div className="categories-scroll" ref={scrollRef}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="scroll-arrow right" onClick={() => scrollCategories("right")}>&#8680;</button>
        </div>

        <div className="sort-options">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="business-list">
          {currentBusinesses.length > 0 ? (
            currentBusinesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))
          ) : (
            <p>לא נמצאו עסקים מתאימים.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              הקודם
            </button>
            <span>{currentPage} מתוך {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBusinesses;
