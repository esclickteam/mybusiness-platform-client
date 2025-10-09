import React from "react";
import "./AppointmentCRMGuidePage.css";

export default function AppointmentCRMGuidePage() {
  return (
    <div className="appointment-crm-container" dir="rtl" lang="he">
      {/* Title sentence and the opening paragraph were removed */}
      <h1>🧷 Managing Appointment/Scheduling Calendar and CRM in BizUply</h1>

      <h2>Why do you need two separate tools – an Appointment/Meeting Calendar and a CRM?</h2>
      <p>
        In many businesses, services are not provided only in a single location like a clinic or an office, but also at the client’s home or any other location. Therefore, it’s important that the system supports scheduling both fixed-location appointments and mobile meetings.
      </p>
      <p>
        The appointment/meeting calendar is a client-facing tool that lets customers see your availability in real time and book an appointment or meeting by themselves—wherever the service is provided—at your business location or at the client’s home. This simplifies the booking process for the client, prevents complaints and delays, and saves you from repeated phone coordination.
      </p>
      <p>
        In contrast, the CRM is a deeper, internal tool that allows you to track each client individually, know their history, store contact details, log inquiries and conversations, and follow their activity over time. It’s essential for delivering personalized service, building effective retention plans, and running targeted marketing.
      </p>

      <h2>Why shouldn’t you manage the calendar outside of BizUply?</h2>
      <p>
        Some businesses prefer using an external calendar (such as Google Calendar, paper planners, or other systems) or managing appointment scheduling separately from the CRM. While this may seem simple, it has significant drawbacks:
      </p>
      <ul>
        <li>Lack of synchronization between systems can cause double bookings, coordination errors, and lost customers.</li>
        <li>Duplicate, time-consuming management—needing to update details in two systems increases the risk of mistakes and omissions.</li>
        <li>Loss of important client information—without a direct link to the CRM, you can’t manage history of services, reviews, and inquiries.</li>
        <li>Lack of marketing and retention capabilities—data analysis and client segmentation for promotions and retention becomes difficult or even impossible without an integrated system.</li>
      </ul>

      <h2>How do the appointments/meetings calendar and CRM work together in BizUply?</h2>
      <p>
        BizUply is fully integrated: when a client books an appointment or a meeting—whether at the clinic or at their home—the booking is automatically recorded in your business calendar and synchronized in real time. At the same time, the client’s details and the meeting are logged in the CRM, including history, previous inquiries, and other relevant data.
      </p>
      <p>
        As a result, all critical information is available at a click—no need to hunt across different systems—enabling accurate management, smart planning, and quality service.
      </p>

      <h2>What are the advantages and added value for your business?</h2>
      <ul>
        <li>Efficient management and significant time savings—focus on delivering service instead of unnecessary admin.</li>
        <li>Improved customer experience—clients enjoy a convenient, transparent, and always-available booking process.</li>
        <li>Smart, targeted marketing based on client and inquiry data, with personalized retention capabilities.</li>
        <li>Flexible management of multiple service locations (at the clinic or the client’s home), expanding the services you can offer.</li>
      </ul>

      <h2>Managing service durations – how to avoid delays and overload?</h2>
      <p>
        Properly setting the duration of each service is one of the most impactful factors on operational quality and customer satisfaction.
      </p>
      <ul>
        <li>
          <strong>Accurately estimate service duration:</strong> spend time watching and measuring the full duration of each service—prep, treatment time, and cleanup afterward. Add a 5–10 minute buffer between appointments to allow setup and prevent cumulative delays.
        </li>
        <li>
          <strong>Set appointment durations in the calendar:</strong> define the exact duration so clients can choose a time slot that fits and plan accordingly.
        </li>
        <li>
          <strong>Load management:</strong> on busy days, increase the buffer between appointments or limit the daily number of bookings to maintain service quality.
        </li>
        <li>
          <strong>Transparency with clients:</strong> inform clients in advance of the service duration, and clarify if shorter or longer options are available.
        </li>
        <li>
          <strong>Real-time communication:</strong> if delays occur, notify the next client to set expectations, prevent frustration, and maintain trust.
        </li>
        <li>
          <strong>Use historical data:</strong> analyze dashboard data on actual duration and timing gaps, and adjust appointment lengths accordingly for optimal scheduling.
        </li>
      </ul>

      <h2>Tips for smart and efficient Calendar + CRM management</h2>
      <ul>
        <li>Update working hours and locations in the calendar frequently, including mobile services at the client’s home.</li>
        <li>Review the calendar each morning, focusing on mobile meetings, to ensure proper time management.</li>
        <li>Tag clients in the CRM by status to run focused, efficient communication and marketing.</li>
        <li>Track each client’s service history to tailor personalized offerings.</li>
        <li>Use reports and dashboards to analyze trends and align business activities.</li>
      </ul>

      <h2>Summary</h2>
      <p>
        An integrated approach to the appointment/meeting calendar and CRM in your BizUply business is the foundation for modern, efficient, and customer-centric management. It lets you easily run services across locations, track every client, and improve service and marketing—all from a single, smart, integrated platform.
      </p>
      <p>
        Properly setting service durations prevents delays and overload, improves the client experience, and gives you full control and a sense of order in your day-to-day operations.
      </p>
    </div>
  );
}
