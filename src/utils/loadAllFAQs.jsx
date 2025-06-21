// src/utils/loadAllFAQs.jsx
export async function loadAllFAQs() {
  const files = [
    "/affiliateProgramFaq.json",
    "/collaborationsFaq.json",
    "/crmFaqData.json",
    "/customerMessagesFaqData.json",
    "/dashboardFaqData.json",
    "/eskelikAdvisorFaqData.json",
    "/faqData.json",
    "/TechnicalSupportFAQs.json",
    "/troubleshootingFAQs.json",
  ];

  try {
    const responses = await Promise.all(files.map((file) => fetch(file)));

    responses.forEach((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${res.url}: ${res.statusText}`);
      }
    });

    const dataArrays = await Promise.all(responses.map((res) => res.json()));

    const allFAQs = dataArrays.flat();

    return allFAQs;
  } catch (error) {
    console.error("Error loading FAQs:", error);
    return [];
  }
}
