import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";
import "../styles/HelpCenter.css";

export default function HelpCenter() {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const navigate = useNavigate();

  const popularArticles = [
    {
      id: 1,
      title: "Building a Business Page",
      description: "Step by step guide to creating an attractive business page that will attract new customers.",
      url: businessId ? `/business/${businessId}/dashboard/articles/build-business-page` : "/",
    },
    {
      id: 2,
      title: "Proper Use of Chat with Customers",
      description: "Tips for managing smart chat conversations that will strengthen your relationship with your customers.",
      url: businessId ? `/business/${businessId}/dashboard/articles/chat-guide` : "/",
    },
    {
      id: 3,
      title: "Business Dashboard",
      description: "Discover how the dashboard gives you full control and complete visibility over your business.",
      url: businessId ? `/business/${businessId}/dashboard/articles/dashboard-guide` : "/",
    },
    {
      id: 4,
      title: "Appointment Scheduling / CRM",
      description: "Manage appointments and customers in one place – simple and efficient as it should be.",
      url: businessId ? `/business/${businessId}/dashboard/articles/appointment-crm-guide` : "/",
    },
    {
      id: 5,
      title: "BizUply Advisor and AI Partner",
      description: "Meet the digital advisor that will upgrade your business with artificial intelligence.",
      url: businessId ? `/business/${businessId}/dashboard/articles/ai-companion` : "/",
    },
    {
      id: 6,
      title: "Business Collaborations",
      description: "How to expand your business through winning collaborations with other businesses.",
      url: businessId ? `/business/${businessId}/dashboard/articles/business-collaboration` : "/",
    },
  ];

  const faqCategories = [
    { id: 1, title: "Business Profile", path: businessId ? `/business/${businessId}/dashboard/faq/profile` : "/" },
    { id: 2, title: "Dashboard", path: businessId ? `/business/${businessId}/dashboard/faq/dashboard` : "/" },
    { id: 3, title: "Messages from Customers", path: businessId ? `/business/${businessId}/dashboard/faq/customer-messages` : "/" },
    { id: 4, title: "Collaborations", path: businessId ? `/business/${businessId}/dashboard/faq/collaborations` : "/" },
    { id: 5, title: "CRM", path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/" },
    { id: 6, title: "BizUply Advisor", path: businessId ? `/business/${businessId}/dashboard/faq/BizUply-advisor` : "/" },
    { id: 7, title: "Affiliate Program", path: businessId ? `/business/${businessId}/dashboard/faq/affiliate-program` : "/" },
    { id: 8, title: "Troubleshooting and Errors", path: businessId ? `/business/${businessId}/dashboard/faq/troubleshooting` : "/" },
    { id: 9, title: "Technical Support", path: businessId ? `/business/${businessId}/dashboard/faq/technical-support` : "/" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const filteredCategories = faqCategories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="help-center-container">
      <h1>👋 Welcome to the BizUply Help Center</h1>
      <p>Here you can find answers, guides, and tools to manage your digital business.</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder='Search for a category like "Dashboard", "CRM", "Business Profile"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
          aria-label="Search categories and articles"
          autoComplete="off"
        />
        <span className="search-icon" role="img" aria-label="Search">🔍</span>
      </div>

      {searchTerm.trim() === "" ? (
        <>
          <section className="popular-articles">
            <h2>Popular Articles</h2>
            <div className="articles-grid">
              {popularArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <p className="article-title">{article.title}</p>
                  <p className="article-description">{article.description}</p>
                  <Link
                    to={article.url}
                    className="more-info-button"
                    aria-label={`More information about ${article.title}`}
                  >
                    More Information
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="faq-categories">
            <h2>Select a Category for Frequently Asked Questions</h2>
            <div className="categories-grid">
              {faqCategories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.path)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCategoryClick(category.path);
                  }}
                  aria-label={`Open frequently asked questions in the category ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="search-results">
          <h2>Search Results for "{searchTerm}"</h2>

          {filteredArticles.length > 0 ? (
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <p className="article-title">{article.title}</p>
                  <p className="article-description">{article.description}</p>
                  <Link to={article.url} className="more-info-button" aria-label={`More information about ${article.title}`}>
                    More Information
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No articles found matching the search.</p>
          )}

          {filteredCategories.length > 0 ? (
            <div className="categories-grid" style={{ marginTop: 20 }}>
              {filteredCategories.map(category => (
                <div
                  key={category.id}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.path)}
                  onKeyPress={e => {
                    if (e.key === "Enter") handleCategoryClick(category.path);
                  }}
                  aria-label={`Open frequently asked questions in the category ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          ) : (
            <p>No categories found matching the search.</p>
          )}
        </section>
      )}

      <section className="contact-us">
        <h2>Need Further Assistance?</h2>
        <div>
          <button
            type="button"
            onClick={() => navigate("/business-support")}
            className="support-button"
            aria-label="Go to the business support page"
          >
            Go to the Business Support Page
          </button>
        </div>
      </section>

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
