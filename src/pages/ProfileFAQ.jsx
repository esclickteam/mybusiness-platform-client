import React, { useState } from "react";

const faqData = [
  {
    question: "❓ How do I use the different tabs on the business page?",
    answer: `
The business page is divided into functional tabs that allow comprehensive, organized management and presentation of business information to both customers and the business owner. Each tab focuses on a specific content area and enables quick, convenient access to information:

Main: Shows an overview of the business, including name, description, contact details, and other important information. This tab serves as the business’s homepage for customers.

Gallery: Centralizes all media content—photos and videos—used to showcase the business, products, and services. Enables rich, high-quality visual content to enhance the customer experience.

Reviews: Collects customer reviews and ratings, with the option for the business owner to receive notifications for every review and track the overall rating.

Q&A: Displays a collection of frequently asked questions from customers, along with responses from the business owner or support team, to provide immediate and thorough answers.

Calendar: Allows managing appointments, meetings, or service bookings if the business operates a scheduling system. This tool helps organize operating hours with customers efficiently.

Chat with the business: An interface for direct, real-time communication between customers and the business, enabling quick responses to questions, inquiries, and personal assistance.

Each tab is designed to provide focused information and promote a smooth user experience tailored to the needs of the business and its customers.
    `,
  },
  {
    question: "❓ What should I do if the changes I made don’t appear on the business page?",
    answer: `
If, after saving changes in the editor, they don’t appear on the public business page, follow these self-help steps:

1. Fully refresh the browser:
   Use Ctrl + F5 (or Cmd + Shift + R on Mac) to refresh the page and clear the cache.

2. Clear browser cache and cookies:
   Delete your browser’s cache and cookies to ensure the updated version of the site loads.

3. Check for a stable internet connection:
   Make sure your connection is stable and working.

4. Try a different browser or device:
   Access the business page from another device or browser to see if the issue occurs everywhere.

5. Wait a few minutes:
   Sometimes there’s a temporary delay in data sync. Wait about 5–10 minutes and check again.

6. Log out and back in:
   Log out of your account, close the browser, reopen it, and log in again.

If, after completing all these steps, changes still don’t appear, contact technical support with a detailed description of the issue, including screenshots, the time of the update, and your browser details.
    `,
  },
  {
    question: "❓ How do I add or edit my business details?",
    answer: `
To update business details, go to the admin panel and select the business page. There you can edit the following fields: business name, detailed description, phone number, email, city, category, and upload a logo and main images in the gallery.

After making changes, click "Save changes" to store the updates in the system.

On this page you can edit all sub-pages in the business profile, add a gallery, FAQs and answers, and more.
    `,
  },
  {
    question: "❓ How do I manage the business image gallery?",
    answer: `
Your business has two main galleries for managing images and videos:

- Main gallery (Main tab):
  Up to 5 primary images displayed on the business profile.

- Extended gallery (Gallery tab):
  Allows adding additional images and videos.

Tips for managing galleries:
Choose high-quality images, add short videos, and keep content up to date.
    `,
  },
  {
    question: "❓ Why is it important to set the business category and location correctly?",
    answer: `
Accurate category and location settings are essential for system performance and business promotion.

Benefits include:
- Improved exposure on the platform
- More inquiries and conversions
- Precise collaborations between businesses

Incorrect settings can harm exposure and attract irrelevant customers.

We recommend updating these details regularly.
    `,
  },
  {
    question: "❓ What should I do if I have trouble accessing the business page or using the system?",
    answer: `
When you encounter access issues for the business page or the admin panel:

1. Check for a stable internet connection.
2. Try another browser.
3. Clear cache and cookies.
4. Perform a hard refresh (Ctrl+F5 or Cmd+Shift+R).
5. Try from another device or network.

If the issue persists, contact support with a detailed description and screenshots.
    `,
  },
  {
    question: "❓ How do I add videos to the business page and what are the benefits?",
    answer: `
You can add videos in the extended gallery under the "Gallery" tab.

Benefits:
- Visual demonstration of services and work environment
- Increased trust and customer engagement

Ensure supported format (MP4) and valid file sizes.
    `,
  },
  {
    question: "❓ How do I add services or new service categories to the business page?",
    answer: `
Services and service categories can be added under the "Calendar" tab and in the CRM system.

Importance:
- Efficient management of bookings and appointments
- Improved visibility and organization
- Focused marketing and increased conversions
    `,
  },
  {
    question: "❓ How can I manage and customize the contact details on the business page?",
    answer: `
Manage contact details in the admin panel under the editing tab.

Options:
- Update phone, email, address, and social links
- Set contact details for branches or departments
- Choose which details are publicly visible
    `,
  },
  {
    question: "❓ How do I handle issues with uploading images or saving changes?",
    answer: `
If you run into problems uploading images or saving changes, go through the following steps before contacting support:

Check file format:
Make sure the image or video you’re uploading is in a supported format, such as JPG or PNG for images and MP4 for videos.

Check file size:
Ensure the file does not exceed the allowed size (e.g., up to 5MB). If needed, reduce the file size using an editor or format conversion.

Browser refresh:
Perform a hard refresh of the page (Ctrl + F5 or Cmd + Shift + R) to ensure the browser loads the updated system.

Clear cache and cookies:
If the issue persists, clear your browser’s cache and cookies to prevent loading old data.

Check internet connection:
Make sure your internet connection is stable and fast—an unstable connection can cause upload errors.

Try another browser or device:
Try uploading the file using a different browser or device to rule out local issues.

Verify saving changes:
Make sure you clicked "Save" after making changes. Sometimes changes aren’t saved without explicit confirmation.

If the issue still occurs after all these steps, contact technical support with a detailed description, screenshots, and the browser and system you used.
    `,
  },
];

export default function ProfileFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        textAlign: "right",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        FAQ – Business Profile
      </h1>
      {faqData.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: 15,
            borderBottom: "1px solid #ddd",
            paddingBottom: 10,
          }}
        >
          <button
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-header-${index}`}
            style={{
              width: "100%",
              textAlign: "right",
              background: "rgba(85, 107, 47, 0.5)",
              border: "none",
              padding: "12px 15px",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
            }}
          >
            <span>{item.question}</span>
            <span style={{ fontSize: 24, lineHeight: 1 }}>
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-header-${index}`}
              style={{
                padding: "12px 15px",
                background: "#fafafa",
                whiteSpace: "pre-wrap",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#444",
                textAlign: "right",
                direction: "rtl",
                borderRadius: 6,
                marginTop: 6,
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
