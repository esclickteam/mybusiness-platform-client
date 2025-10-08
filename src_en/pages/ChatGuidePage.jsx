```javascript
import React from "react";
import "./ChatGuidePage.css";

export default function ChatGuidePage() {
  return (
    <div className="chat-guide-container" dir="rtl" lang="he">
      {/* We removed the sentence in the main title */}
      <h1>🧷 Proper Use of Chat with Customers in Asclic</h1>

      <h2>📍 How does the chat actually work?</h2>
      <p>
        When a customer enters your business page in Asclic, they can click on the chat button and send you a direct message.
        The message arrives immediately to you in the personal area, in the "Business Messages" tab, where you can read and respond.
        Notifications for new messages come in – so you won't miss any inquiries.
      </p>
      <p>If you have an AI subscription in the system, you will also receive:</p>
      <ul>
        <li>Smart and tailored response suggestions for the conversation.</li>
        <li>Notifications about urgent messages or customers with high purchase potential.</li>
      </ul>

      <h2>🌐 Why is chat the most modern and efficient solution?</h2>
      <ul>
        <li>Customers expect immediate availability. In today's fast-paced world, real-time responses increase conversion chances.</li>
        <li>Pressure-free communication: Customers can write whenever it suits them, without the need to talk on the phone or wait.</li>
        <li>Access from any device: both from mobile and from computer – without switching between apps.</li>
        <li>Calm and written language: allows for pleasant and professional communication, without the pressure of a phone call.</li>
        <li>Full documentation: keeps all messages for future use, both for you and for the customer.</li>
      </ul>

      <h2>❓ Why not phone or WhatsApp?</h2>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Limitations</th>
            <th>Asclic Chat Advantage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phone</td>
            <td>No documentation, time-consuming, inconvenient</td>
            <td>Quiet, documented messages available at any time</td>
          </tr>
          <tr>
            <td>WhatsApp</td>
            <td>Mixes personal and business, unprofessional</td>
            <td>Separates business from personal life, more professional</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>Slow, not all customers use it</td>
            <td>Fast in real-time, immediate and accessible</td>
          </tr>
        </tbody>
      </table>

      <h2>🧠 Key Benefits of Chat in Business</h2>
      <table>
        <thead>
          <tr>
            <th>Benefit</th>
            <th>Direct Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Immediate communication</td>
            <td>Quickly closing inquiries and questions</td>
          </tr>
          <tr>
            <td>Accessibility</td>
            <td>Suitable for busy or quiet customers</td>
          </tr>
          <tr>
            <td>Full documentation</td>
            <td>Allows returning to the conversation at any time</td>
          </tr>
          <tr>
            <td>Professionalism</td>
            <td>Conveys a serious and available business</td>
          </tr>
          <tr>
            <td>Connection to actions</td>
            <td>Easy to send links, offers, and schedule appointments directly</td>
          </tr>
        </tbody>
      </table>

      <h2>✅ Guidelines for Proper Chat Management</h2>
      <ol>
        <li>
          <strong>Professional and pleasant writing</strong><br />
          Use clear, concise, and inviting language.<br />
          Address the customer by name – it creates a personal connection.<br />
          Be courteous and patient, even when dealing with problems or difficulties.
        </li>
        <li>
          <strong>Proper selling in chat</strong><br />
          Start with a focused question: <br />
          <em>"Hello [Name], how can I assist you today?"</em><br />
          Offer a clear and concise solution:<br />
          <em>"Our service includes a thorough facial cleansing, lasting about an hour and includes personalized consultation."</em><br />
          End with a call to action:<br />
          <em>"Would you like me to check availability for Tuesday at 4:00 PM?"</em>
        </li>
        <li>
          <strong>Quick response</strong><br />
          Reply as soon as possible, even if just to confirm that you received the message and will respond later.<br />
          A quick response increases customer satisfaction and boosts closing chances.
        </li>
      </ol>

      <h2>📝 Recommended Chat Conversation Examples</h2>
      <p><strong>Example 1: Opening and updating availability</strong></p>
      <p>
        Customer: "Hello, I wanted to inquire about facial treatments."<br />
        You: <br />
        "Hello [Name]! Thank you for reaching out to us 😊 We offer a variety of natural and personalized facial treatments. Would you like me to detail the treatments or check availability for the next appointment?"
      </p>

      <p><strong>Example 2: Service offer with details and price</strong></p>
      <p>
        Customer: "What do your facial treatments include?"<br />
        You: <br />
        "I'm glad you asked! Our standard treatment includes deep cleansing, gentle peeling, facial massage, and soothing with natural masks. The treatment lasts about an hour, and the price is 290 NIS. Would you like me to check an available date for you?"
      </p>

      <p><strong>Example 3: Handling objections or questions about price</strong></p>
      <p>
        Customer: "The price is too high for me, do you have something cheaper?"<br />
        You: <br />
        "I understand you [Name]. We also have a basic treatment at a lower price, which includes a short facial cleansing of 45 minutes for 180 NIS. I would be happy to detail it for you and check a suitable date."
      </p>

      <p><strong>Example 4: Closing a deal with a call to action</strong></p>
      <p>
        Customer: "Yes, I want to schedule an appointment."<br />
        You: <br />
        "Great! I have available appointments on Wednesday at 10:00 AM and Thursday at 4:00 PM. Which one works better for you?"
      </p>

      <p><strong>Example 5: Responding to a problem or complaint</strong></p>
      <p>
        Customer: "The last treatment was not to my satisfaction."<br />
        You: <br />
        "I'm sorry to hear that, [Name]. It's important to me that you are satisfied, and I would like to understand what happened and find a solution that works for you. Can we schedule a clarification call or a corrective treatment?"
      </p>

      <h2>🧩 Advanced Tips for Using Chat</h2>
      <table>
        <thead>
          <tr>
            <th>What to do</th>
            <th>Why it's important</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Check messages several times a day</td>
            <td>Don't miss hot inquiries and critical questions</td>
          </tr>
          <tr>
            <td>Update frequently asked questions in the FAQ tab</td>
            <td>Saves time and streamlines responses to recurring questions</td>
          </tr>
          <tr>
            <td>Utilize AI suggestions (if available)</td>
            <td>Fast, accurate, and personalized responses</td>
          </tr>
          <tr>
            <td>Maintain patience with challenging customers</td>
            <td>Conveys professionalism and increases the chance of future return</td>
          </tr>
        </tbody>
      </table>

      <h2>Summary – How to Turn Chat into a Winning Sales and Service Tool?</h2>
      <ul>
        <li>Be available and quick in response.</li>
        <li>Address the customer by name, giving a sense of personal attention.</li>
        <li>Offer focused solutions with clear explanations.</li>
        <li>Ask open-ended questions to gather complete information (e.g., "What area would you like to focus on?").</li>
        <li>End every conversation with a call to action (scheduling an appointment, sending a payment link, etc.).</li>
        <li>Maintain a polite and patient tone even in conflict situations.</li>
        <li>Use conversation documentation to improve processes and service.</li>
      </ul>
    </div>
  );
}
```