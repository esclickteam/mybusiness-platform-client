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
<<<<<<< HEAD
      description: "Step-by-step guide to creating an attractive business page that draws new clients.",
=======
      description: "Step-by-step guide to creating an attractive business page that brings in new clients.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/build-business-page` : "/",
    },
    {
      id: 2,
      title: "Using the Client Chat Effectively",
<<<<<<< HEAD
      description: "Tips for managing smart chat conversations that strengthen your client relationships.",
=======
      description: "Tips for managing smart chat conversations to strengthen relationships with your clients.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/chat-guide` : "/",
    },
    {
      id: 3,
      title: "Business Dashboard",
<<<<<<< HEAD
      description: "Discover how the dashboard gives you full control and complete visibility over your business.",
=======
      description: "Discover how the dashboard gives you full control and visibility over your business.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/dashboard-guide` : "/",
    },
    {
      id: 4,
<<<<<<< HEAD
      title: "Appointments / CRM",
      description: "Manage appointments and clients in one place – simple and efficient, just as it should be.",
=======
      title: "Appointment Scheduling / CRM",
      description: "Manage your appointments and clients in one place — simple and efficient as it should be.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/appointment-crm-guide` : "/",
    },
    {
      id: 5,
<<<<<<< HEAD
      title: "Bizuply AI Advisor",
      description: "Meet your digital assistant that enhances your business with artificial intelligence.",
=======
      title: "AsClick Advisor & AI Partner",
      description: "Meet the digital advisor that upgrades your business using artificial intelligence.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/ai-companion` : "/",
    },
    {
      id: 6,
      title: "Business Collaborations",
<<<<<<< HEAD
      description: "Learn how to expand your business through powerful collaborations with other companies.",
=======
      description: "How to grow your business through winning collaborations with other businesses.",
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      url: businessId ? `/business/${businessId}/dashboard/articles/business-collaboration` : "/",
    },
  ];

  const faqCategories = [
    { id: 1, title: "Business Profile", path: businessId ? `/business/${businessId}/dashboard/faq/profile` : "/" },
    { id: 2, title: "Dashboard", path: businessId ? `/business/${businessId}/dashboard/faq/dashboard` : "/" },
<<<<<<< HEAD
    { id: 3, title: "Client Messages", path: businessId ? `/business/${businessId}/dashboard/faq/customer-messages` : "/" },
    { id: 4, title: "Collaborations", path: businessId ? `/business/${businessId}/dashboard/faq/collaborations` : "/" },
    { id: 5, title: "CRM", path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/" },
    { id: 6, title: "Bizuply Advisor", path: businessId ? `/business/${businessId}/dashboard/faq/eskelik-advisor` : "/" },
    { id: 7, title: "Affiliate Program", path: businessId ? `/business/${businessId}/dashboard/faq/affiliate-program` : "/" },
    { id: 8, title: "Troubleshooting", path: businessId ? `/business/${businessId}/dashboard/faq/troubleshooting` : "/" },
=======
    { id: 3, title: "Messages from Clients", path: businessId ? `/business/${businessId}/dashboard/faq/customer-messages` : "/" },
    { id: 4, title: "Collaborations", path: businessId ? `/business/${businessId}/dashboard/faq/collaborations` : "/" },
    { id: 5, title: "CRM", path: businessId ? `/business/${businessId}/dashboard/faq/crm` : "/" },
    { id: 6, title: "AsClick Advisor", path: businessId ? `/business/${businessId}/dashboard/faq/eskelik-advisor` : "/" },
    { id: 7, title: "Affiliate Program", path: businessId ? `/business/${businessId}/dashboard/faq/affiliate-program` : "/" },
    { id: 8, title: "Troubleshooting & Errors", path: businessId ? `/business/${businessId}/dashboard/faq/troubleshooting` : "/" },
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
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
<<<<<<< HEAD
      <h1>👋 Welcome to the Bizuply Help Center</h1>
=======
      <h1>👋 Welcome to the AsClick Help Center</h1>
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
      <p>Here you can find answers, guides, and tools to manage your digital business.</p>

      <div className="search-bar">
        <input
          type="text"
<<<<<<< HEAD
          placeholder='Search for a category like "Dashboard", "CRM", or "Business Profile"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="ltr"
          aria-label="Search categories and articles"
          autoComplete="off"
        />
        <span className="search-icon" role="img" aria-label="Search">🔍</span>
=======
          placeholder='Search for a topic like "Dashboard", "CRM", "Business Profile"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search categories and articles"
          autoComplete="off"
        />
        <span className="search-icon" role="img" aria-label="search">🔍</span>
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
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
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="faq-categories">
            <h2>Select a FAQ Category</h2>
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
          <h2>Search Results for "{searchTerm}"</h2>

          {filteredArticles.length > 0 ? (
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <p className="article-title">{article.title}</p>
                  <p className="article-description">{article.description}</p>
                  <Link to={article.url} className="more-info-button" aria-label={`More info about ${article.title}`}>
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          ) : (
<<<<<<< HEAD
            <p>No articles matched your search.</p>
=======
            <p>No articles found matching your search.</p>
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
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
                  aria-label={`Open FAQs in category ${category.title}`}
                >
                  {category.title}
                </div>
              ))}
            </div>
          ) : (
<<<<<<< HEAD
            <p>No categories matched your search.</p>
=======
            <p>No categories found matching your search.</p>
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
          )}
        </section>
      )}

      <section className="contact-us">
<<<<<<< HEAD
        <h2>Need More Help?</h2>
=======
        <h2>Need more help?</h2>
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
        <div>
          <button
            type="button"
            onClick={() => navigate("/business-support")}
            className="support-button"
            aria-label="Go to Business Support page"
          >
<<<<<<< HEAD
            Go to Business Support Page
=======
             Go to Business Support
>>>>>>> 21b0c3e8e1e1d002c9b6668b35300bd6adebe27d
          </button>
        </div>
       </section>

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
