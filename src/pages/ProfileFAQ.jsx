```javascript
import React, { useState } from "react";

const faqData = [
  {
    question: "❓ How do you use the different tabs on the business page?",
    answer: `
The business page is divided into functional tabs that allow for comprehensive and organized management and presentation of business information for both customers and business owners. Each tab focuses on a unique content area, providing quick and convenient access to information:

Main: Provides an overview of the business, including name, description, contact details, and other important information. This tab serves as the business's homepage for customers.

Gallery: Centralizes all media content – images and videos – used to illustrate the business, products, and services. It allows for the display of rich and high-quality visual content to enhance the customer experience.

Reviews: Centralizes the feedback and ratings left by customers, along with the option for the business owner to receive notifications about each review and track their rating.

Questions and Answers: Displays a collection of frequently asked questions by customers, along with responses from the business owner or support team, to provide immediate and comprehensive answers.

Calendar: Allows for the management of appointments, meetings, or service bookings if the business operates a scheduling system. The tool helps in efficiently organizing operational times with customers.

Chat with the business: An interface for direct and immediate communication between customers and the business, allowing for quick responses to questions, inquiries, and individual assistance.

Each tab is designed to provide focused information and promote a smooth user experience, tailored to the needs of the business and its customers.
    `,
  },
  {
    question: "❓ What to do if the changes I made do not appear on the business page?",
    answer: `
If after saving changes on the editing page they do not appear on the business page for the customer, it is recommended to follow these steps for self-troubleshooting:

1. Fully refresh the browser:
   Use the shortcut Ctrl + F5 (or Cmd + Shift + R on Mac) to refresh the page and clear the cache.

2. Clear browser cache and cookies:
   Delete the cache and cookies in your browser to ensure that the updated version of the site is loaded.

3. Check for a stable internet connection:
   Ensure that you have a proper and stable internet connection.

4. Check in another browser or device:
   Try accessing the business page from another device or browser to see if the issue occurs across all platforms.

5. Wait a few minutes:
   Sometimes there is a temporary delay in data synchronization in the system. Wait about 5–10 minutes and try checking again.

6. Log out and log back in:
   Log out of your account in the system, close the browser, reopen it, and log back in.

If after performing all these steps the changes still do not appear, you should contact technical support with a detailed description of the problem, including screenshots, the time of the update, and browser details.
    `,
  },
  {
    question: "❓ How do I add or edit my business details?",
    answer: `
To update the business details, you need to enter the management panel and select the business page. There you can edit the following fields: business name, detailed description, phone number, email, city, category, and upload a logo and main images to the gallery.

After making the changes, you must click the "Save Changes" button to save the updates in the system.

On this page, you can edit all the subpages found in the business profile, add a gallery, frequently asked questions and answers, and more.
    `,
  },
  {
    question: "❓ How do you manage the business's image gallery?",
    answer: `
Your business has two main galleries for managing images and videos:

- Main gallery (Main tab):
  Up to 5 main images displayed in the business profile.

- Extended gallery (Gallery tab):
  Allows you to add additional images and videos.

Tips for managing galleries:
Choose high-quality images, add short videos, and keep the content up to date.
    `,
  },
  {
    question: "❓ Why is it important to correctly define the business category and location?",
    answer: `
Accurate definition of the business category and location is essential for the system's functionality and for promoting the business.

Benefits include:
- Improved visibility on the platform
- Increased inquiries and conversions
- Creation of precise collaborations between businesses

Incorrect definitions can harm visibility and attract irrelevant customers.

It is recommended to update the details regularly.
    `,
  },
  {
    question: "❓ What to do in case of an issue accessing the business page or using the system?",
    answer: `
In case of issues accessing the business page or management panel:

1. Check for a stable internet connection.
2. Try another browser.
3. Clear cache and cookies.
4. Perform a full refresh (Ctrl+F5 or Cmd+Shift+R).
5. Try from another device or network.

If the problem persists, contact support with a detailed description and screenshots.
    `,
  },
  {
    question: "❓ How to add videos to the business page and what are the benefits?",
    answer: `
You can add videos in the extended gallery in the "Gallery" tab.

Benefits:
- Visual illustration of services and work environment
- Increased trust and customer engagement

Make sure to use a supported format (MP4) and proper file sizes.
    `,
  },
  {
    question: "❓ How to add new services or service categories to the business page?",
    answer: `
Services and service categories can be added in the "Calendar" tab and in the CRM system.

Importance:
- Efficient management of orders and appointments
- Improved visibility and organization of the business
- Focused marketing and increased conversions
    `,
  },
  {
    question: "❓ How can I manage and adjust the contact details on the business page?",
    answer: `
Managing contact details is done in the management panel under the editing tab.

Options:
- Update phone, email, address, and links to social networks
- Set contact details for different branches or departments
- Choose which details to display to the public
    `,
  },
  {
    question: "❓ How to deal with issues uploading images or saving changes?",
    answer: `
In case of issues uploading images or saving changes, it is recommended to go through the following steps before contacting technical support:

Check the file format:
Ensure that the image or video you want to upload is in a supported format, such as JPG, PNG for images, and MP4 for videos.

Check the file size:
Make sure the file does not exceed the allowed size limit (e.g., up to 5MB). If necessary, reduce the file size using editing tools or format conversion.

Refresh the browser:
Perform a full refresh of the page (Ctrl + F5 or Cmd + Shift + R) to ensure the browser displays the updated version of the system.

Clear cache and cookies:
If the problem persists, delete the browser's cache and cookies to prevent loading old information.

Check internet connection:
Ensure that your internet connection is stable and fast – an unstable connection may cause upload errors.

Try another browser or device:
Try uploading the file in another browser or device to rule out local issues.

Check saving changes:
Make sure you clicked the "Save" button after making changes. Sometimes changes are not saved without explicit confirmation.

If after performing all these steps the problem still occurs, you should contact technical support with a detailed description of the issue, screenshots, browser details, and the system you used.
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
        Questions and Answers - Business Profile
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
```