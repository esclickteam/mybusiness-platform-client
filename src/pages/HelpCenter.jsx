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
      description:
        "Step-by-step guide to creating an attractive business page that brings in new clients.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/build-business-page`
        : "/",
    },
    {
      id: 2,
      title: "Using the Client Chat Effectively",
      description:
        "Tips for managing smart chat conversations to strengthen relationships with your clients.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/chat-guide`
        : "/",
    },
    {
      id: 3,
      title: "Business Dashboard",
      description:
        "Discover how the dashboard gives you full control and visibility over your business.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/dashboard-guide`
        : "/",
    },
    {
      id: 4,
      title: "Appointment Scheduling / CRM",
      description:
        "Manage your appointments and clients in one place — simple and efficient as it should be.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/appointment-crm-guide`
        : "/",
    },
    {
      id: 5,
      title: "Bizuply AI Advisor",
      description:
        "Meet your digital assistant that enhances your business with artificial intelligence.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/ai-companion`
        : "/",
    },
    {
      id: 6,
      title: "Business Collaborations",
      description:
        "Learn how to expand your business through powerful collaborations with other companies.",
      url: businessId
        ? `/business/${businessId}/dashboard/articles/business-collaboration`
        : "/",
    },
  ];

  const faqCategories = [
    {
      id: 1,
      title: "Business Profile",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/profile`
        : "/",
    },
    {
      id: 2,
      title: "Dashboard",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/dashboard`
        : "/",
    },
    {
      id: 3,
      title: "Client Messages",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/customer-messages`
        : "/",
    },
    {
      id: 4,
      title: "Collaborations",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/collaborations`
        : "/",
    },
    {
      id: 5,
      title: "CRM",
      path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/",
    },
    {
      id: 6,
      title: "Bizuply Advisor",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/BizUply-advisor`
        : "/",
    },
    {
      id: 7,
      title: "Affiliate Program",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/affiliate-program`
        : "/",
    },
    {
      id: 8,
      title: "Troubleshooting & Errors",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/troubleshooting`
        : "/",
    },
    {
      id: 9,
      title: "Technical Support",
      path: businessId
        ? `/business/${businessId}/dashboard/faq/technical-support`
        : "/",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const filteredCategories = faqCategories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = popularArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="help-center-container">
      {/* 🏁 HEADER */}
      <h1>🚀 Bizuply Knowledge Hub</h1>
      <p>
        Explore detailed guides, smart tools, and answers that help you grow your business with confidence.
      </p>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search for topics like "Dashboard", "CRM", or "AI Advisor"...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="ltr"
          aria-label="Search categories and articles"
          autoComplete="off"
        />
        <span className="search-icon" role="img" aria-label="Search">
          🔍
        </span>
      </div>

      {searchTerm.trim() === "" ? (
        <>
          {/* 📰 FEATURED ARTICLES */}
          <section className="popular-articles">
            <h2>🌟 Featured Guides & Articles</h2>
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
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* 📚 FAQ CATEGORIES */}
          <section className="faq-categories">
            <h2>🧭 Explore by Category</h2>
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
                  aria-label={`Open FAQs in category ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="search-results">
          <h2>🔎 Search Results for "{searchTerm}"</h2>

          {filteredArticles.length > 0 ? (
            <div className="articles-grid">
              {filteredArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <p className="article-title">{article.title}</p>
                  <p className="article-description">{article.description}</p>
                  <Link
                    to={article.url}
                    className="more-info-button"
                    aria-label={`More info about ${article.title}`}
                  >
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No articles found matching your search.</p>
          )}

          {filteredCategories.length > 0 ? (
            <div className="categories-grid" style={{ marginTop: 20 }}>
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.path)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCategoryClick(category.path);
                  }}
                  aria-label={`Open FAQs in category ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          ) : (
            <p>No categories found matching your search.</p>
          )}
        </section>
      )}

      {/* 💬 CONTACT SUPPORT */}
      <section className="contact-us">
        <h2>💡 Need Extra Help?</h2>
        <p>Our support team is always here to assist you with anything you need.</p>
        <div>
          <button
            type="button"
            onClick={() => navigate("/business-support")}
            className="support-button"
            aria-label="Go to Business Support page"
          >
            Contact Support
          </button>
        </div>
      </section>

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
