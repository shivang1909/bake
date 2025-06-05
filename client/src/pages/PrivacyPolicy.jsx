import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="lg:mt-20 max-w-4xl mx-auto px-6 py-14 text-base text-gray-800 leading-loose font-sans">
      <h1 className="text-5xl font-bold mb-5">Privacy Policy</h1>

      <p className="mb-8 font-medium">Effective Date: June 5, 2025</p>

      <p className="mb-6">
        At Bake Flavours, we are committed to safeguarding the privacy and security of our customers. This Privacy Policy describes how your personal information is collected, used, and protected when you visit or make a purchase from our platform. By accessing our website or services, you consent to the practices outlined in this policy. Please read it thoroughly to understand your rights and our responsibilities regarding your data.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">1. Who We Are</h2>
      <p className="mb-6">
        Bake Flavours is a local Ahmedabad-based brand that specializes in a wide range of bakery delights, including traditional sweets, cookies, namkeen, farsan, and hot snacks. With a mission to deliver freshness and taste right to your doorstep, we currently operate within Ahmedabad and focus on providing high-quality food products using time-honored recipes and hygienic practices.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">2. Information We Collect</h2>
      <p className="mb-2">
        We collect the following types of information to fulfill orders, improve our services, and enhance your experience:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>Personal details like your full name, phone number, and email address</li>
        <li>Delivery and billing addresses for accurate service</li>
        <li>Purchase and order history to personalize future interactions</li>
        <li>Device information such as IP address, browser type, and operating system</li>
        <li>Any messages or feedback you send us, including queries and complaints</li>
      </ul>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">3. How We Use Your Information</h2>
      <p className="mb-6">
        The information you share enables us to:
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Process and deliver your orders efficiently</li>
          <li>Send transactional messages and updates on order status</li>
          <li>Respond to customer support inquiries and requests</li>
          <li>Provide promotional offers or updates (if opted in)</li>
          <li>Analyze data to improve our products, delivery timelines, and overall platform performance</li>
        </ul>
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">4. Consent & Communication</h2>
      <p className="mb-6">
        By submitting your personal data through our website or any related service, you provide explicit consent for us to use your data as described. We may send you emails, SMS, or calls related to your orders. Marketing communications will only be sent if you’ve opted in. You may opt out at any time through provided channels or by contacting us.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">5. Data Sharing</h2>
      <p className="mb-2">
        We value your trust and do not sell your information. However, to ensure seamless service, we may share your data with:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-1">
        <li>Logistics providers and delivery partners for order fulfillment</li>
        <li>Payment gateways and banking institutions for secure transaction processing</li>
        <li>Technical and customer service teams to help you with any concerns</li>
      </ul>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">6. Delivery Coverage</h2>
      <p className="mb-6">
        At this time, our delivery services are available exclusively within Ahmedabad city limits. Orders placed from outside this region will be canceled and not processed. We continue to work on expanding our reach and hope to serve more locations in the near future.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">7. Refund Policy</h2>
      <p className="mb-6">
        All purchases made through Bake Flavours are considered final. We do not offer refunds, returns, or exchanges unless an item is found to be defective or incorrect. In such cases, customers are encouraged to report the issue within 24 hours of delivery. While we strive for perfection, we handle such requests on a case-by-case basis without any refund guarantees.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">8. Data Retention</h2>
      <p className="mb-6">
        We retain your personal data for as long as necessary to complete your transactions, provide customer support, and comply with legal and accounting requirements. Once your data is no longer needed, it is securely removed from our systems.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">9. Security Measures</h2>
      <p className="mb-6">
        Your data security is a top priority. We implement robust measures like encrypted communication, secure servers, and access restrictions. Despite our best efforts, we acknowledge that no system can be entirely foolproof. We advise users to practice caution while sharing sensitive data online.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">10. Cookies & Tracking</h2>
      <p className="mb-6">
        Our site uses cookies to improve your browsing experience. Cookies allow us to understand user preferences, monitor session activities, and offer personalized suggestions. You can manage cookie settings in your browser. However, disabling cookies may impact site functionality.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">11. Your Rights</h2>
      <p className="mb-6">
        You have full rights to access, update, or delete your personal information from our database. To make such requests, kindly write to us at <strong>privacy@bakeflavours.in</strong>. We’ll respond to all queries in a timely manner and in accordance with applicable laws.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">12. Policy Updates</h2>
      <p className="mb-6">
        We may update our Privacy Policy periodically. All changes will be reflected on this page with the latest effective date. Users are encouraged to review this policy from time to time. Continued use of our website after updates constitutes acceptance of the revised terms.
      </p>

      <h2 className="text-base font-semibold mt-10 mb-2 text-left">13. Contact Us</h2>
      <p className="mb-4">
        Have questions or concerns about your privacy?
      </p>
      <div className="mb-12">
        <p><strong>Bake Flavours</strong></p>
        <p>Ahmedabad, Gujarat, India</p>
        <p>Email: privacy@bakeflavours.in</p>
        <p>Phone: +91-98765-43210</p>
      </div>

      <p className="text-xs text-gray-500">© {new Date().getFullYear()} Bake Flavours. All rights reserved.</p>
    </section>
  );
};

export default PrivacyPolicy;
