import React from "react";
import "./ChatGuidePage.css";

export default function ChatGuidePage() {
  return (
    <div className="chat-guide-container" dir="ltr" lang="en">
      {/* Removed the extra sentence from the main title */}
      <h1>🧷 Using Bizuply Chat With Customers the Right Way</h1>

      <h2>📍 How does the chat actually work?</h2>
      <p>
        When a customer visits your business page on Bizuply, they can click the
        chat button and send you a direct message. The message immediately
        reaches you in your personal area, under the “Business Messages” tab,
        where you can read and reply. You’ll receive notifications about new
        messages—so you won’t miss any inquiry.
      </p>
      <p>If you have an AI subscription in the system, you’ll also get:</p>
      <ul>
        <li>Smart, context-aware reply suggestions.</li>
        <li>Alerts about urgent messages or high-intent customers.</li>
      </ul>

      <h2>🌐 Why is chat the modern and most efficient solution?</h2>
      <ul>
        <li>
          Customers expect instant availability. In today’s fast world, real-time
          responses increase conversion rates.
        </li>
        <li>
          Pressure-free communication: customers can write whenever it’s
          convenient, without calling or waiting.
        </li>
        <li>Accessible from any device: mobile or desktop—no app switching.</li>
        <li>
          Calm, written tone: enables pleasant, professional communication
          without the pressure of a phone call.
        </li>
        <li>
          Full record: all messages are saved for future reference—for both you
          and the customer.
        </li>
      </ul>

      <h2>❓ Why not phone or WhatsApp?</h2>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Limitations</th>
            <th>Bizuply Chat Advantage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phone</td>
            <td>No record, time-consuming, inconvenient</td>
            <td>Quiet, documented messages available anytime</td>
          </tr>
          <tr>
            <td>WhatsApp</td>
            <td>Mixes personal and business, less professional</td>
            <td>
              Separates business from private life—more professional setup
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>Slow; not all customers use it</td>
            <td>Real-time, instant, and accessible</td>
          </tr>
        </tbody>
      </table>

      <h2>🧠 Key advantages of using chat</h2>
      <table>
        <thead>
          <tr>
            <th>Advantage</th>
            <th>Direct Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Instant communication</td>
            <td>Resolve inquiries and questions quickly</td>
          </tr>
          <tr>
            <td>Accessibility</td>
            <td>Great for busy or quiet customers</td>
          </tr>
          <tr>
            <td>Full history</td>
            <td>Allows returning to the conversation anytime</td>
          </tr>
          <tr>
            <td>Professionalism</td>
            <td>Signals a serious and responsive business</td>
          </tr>
          <tr>
            <td>Action-ready</td>
            <td>Easily send links, quotes, and book appointments</td>
          </tr>
        </tbody>
      </table>

      <h2>✅ Guidelines for running a good chat conversation</h2>
      <ol>
        <li>
          <strong>Professional, friendly writing</strong>
          <br />
          Use clear, concise, and welcoming language.
          <br />
          Address the customer by name—it creates a personal connection.
          <br />
          Be polite and patient, even when handling issues or complaints.
        </li>
        <li>
          <strong>Selling the right way in chat</strong>
          <br />
          Start with a focused question:
          <br />
          <em>“Hi [Name], how can I help you today?”</em>
          <br />
          Offer a clear, succinct solution:
          <br />
          <em>
            “Our service includes a thorough facial cleansing, takes about an
            hour, and includes personalized guidance.”
          </em>
          <br />
          End with a call to action:
          <br />
          <em>“Want me to check availability for Tuesday at 4:00 PM?”</em>
        </li>
        <li>
          <strong>Respond quickly</strong>
          <br />
          Reply as soon as you can—even just to confirm you received the message
          and will follow up.
          <br />
          Fast responses increase customer satisfaction and deal-closing rates.
        </li>
      </ol>

      <h2>📝 Example chat conversations</h2>
      <p>
        <strong>Example 1: Opening and availability update</strong>
      </p>
      <p>
        Customer: “Hi, I wanted to ask about facial treatments.”<br />
        You: <br />
        “Hi [Name]! Thanks for reaching out 😊 We offer a variety of natural and
        personalized facial treatments. Would you like me to explain the
        options, or check the next available appointment?”
      </p>

      <p>
        <strong>Example 2: Offering a service with details and price</strong>
      </p>
      <p>
        Customer: “What do your facials include?”<br />
        You: <br />
        “Great question! Our standard facial includes deep cleansing, gentle
        exfoliation, facial massage, and calming natural masks. The session lasts
        about an hour and costs 290 NIS. Want me to check a time for you?”
      </p>

      <p>
        <strong>Example 3: Handling a price objection</strong>
      </p>
      <p>
        Customer: “That’s a bit expensive—do you have something cheaper?”<br />
        You: <br />
        “I understand, [Name]. We also have a basic treatment at a lower price:
        a shorter 45-minute facial for 180 NIS. I’d be happy to explain and find
        a time that suits you.”
      </p>

      <p>
        <strong>Example 4: Closing the deal with a call to action</strong>
      </p>
      <p>
        Customer: “Yes, I want to book.”<br />
        You: <br />
        “Awesome! I have Wednesday at 10:00 and Thursday at 16:00 available.
        Which works better for you?”
      </p>

      <p>
        <strong>Example 5: Responding to a complaint</strong>
      </p>
      <p>
        Customer: “I wasn’t satisfied with the last treatment.”<br />
        You: <br />
        “I’m sorry to hear that, [Name]. It’s important to me that you’re happy.
        I’d love to understand what happened and find a solution that works for
        you. Would you like to schedule a clarification call or a follow-up
        session?”
      </p>

      <h2>🧩 Advanced tips for chat usage</h2>
      <table>
        <thead>
          <tr>
            <th>Do</th>
            <th>Why it matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Check messages several times a day</td>
            <td>Don’t miss hot leads and critical questions</td>
          </tr>
          <tr>
            <td>Keep your FAQ tab updated</td>
            <td>Saves time and speeds up answers to repeat questions</td>
          </tr>
          <tr>
            <td>Leverage AI suggestions (if available)</td>
            <td>Faster, more accurate, and more personal replies</td>
          </tr>
          <tr>
            <td>Stay patient with challenging customers</td>
            <td>Shows professionalism and boosts return likelihood</td>
          </tr>
        </tbody>
      </table>

      <h2>Summary – How to turn chat into a winning sales & service tool</h2>
      <ul>
        <li>Be available and respond quickly.</li>
        <li>Use the customer’s name to create a personal touch.</li>
        <li>Offer focused solutions with clear explanations.</li>
        <li>
          Ask open questions to get full context (e.g., “What would you like to
          focus on?”).
        </li>
        <li>End each conversation with a call to action (booking, payment link, etc.).</li>
        <li>Keep a polite, patient tone—even in conflict.</li>
        <li>Use conversation history to improve processes and service.</li>
      </ul>
    </div>
  );
}
