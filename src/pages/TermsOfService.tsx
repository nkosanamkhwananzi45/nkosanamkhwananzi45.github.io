import { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-8">
      <div className="max-w-4xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using Asante Andi Consulting's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Asante Andi Consulting's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p>
              The materials on Asante Andi Consulting's website are provided on an 'as is' basis. Asante Andi Consulting makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p>
              In no event shall Asante Andi Consulting or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Asante Andi Consulting's website, even if Asante Andi Consulting or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Asante Andi Consulting's website could include technical, typographical, or photographic errors. Asante Andi Consulting does not warrant that any of the materials on its website are accurate, complete, or current. Asante Andi Consulting may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Materials and Content</h2>
            <p>
              The materials on Asante Andi Consulting's website are protected by the copyright laws of South Africa and international copyright laws. You may not reproduce, republish, upload, post, transmit, or distribute any content without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Service Description</h2>
            <p>
              Asante Andi Consulting provides consulting services including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service booking and allocation</li>
              <li>Provider assignment and management</li>
              <li>Payment processing through PayFast</li>
              <li>Client and provider communication platforms</li>
              <li>Administrative and reporting services</li>
            </ul>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue any service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. User Accounts</h2>
            <p>
              When you create an account, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your login credentials</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. User Responsibilities</h2>
            <p>
              As a user, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harass, abuse, or intimidate other users</li>
              <li>Post inappropriate, offensive, or illegal content</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Interfere with the normal operation of the website</li>
              <li>Collect or track personal information about others</li>
              <li>Engage in fraudulent or deceptive practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Payment Terms</h2>
            <p>
              Payment for services is processed through PayFast, our authorized payment processor. By proceeding with payment, you authorize PayFast to charge your selected payment method. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate payment information</li>
              <li>Maintain sufficient funds for payment</li>
              <li>Accept responsibility for all charges</li>
              <li>Comply with payment processor terms</li>
            </ul>
            <p className="mt-4">
              Payment disputes must be addressed within 30 days of transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Refund Policy</h2>
            <p>
              Refunds are subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refund requests must be made within 14 days of payment</li>
              <li>Services partially rendered may result in partial refunds</li>
              <li>Cancellations 24 hours before scheduled service are eligible for full refund</li>
              <li>Cancellations within 24 hours may incur cancellation fees</li>
              <li>Refunds are processed within 7-10 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Limitation of Liability</h2>
            <p>
              In no case shall Asante Andi Consulting, its directors, officers, or agents be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages arising from your use of or inability to use the services, even if Asante Andi Consulting has been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Asante Andi Consulting from any claim, demand, loss, or liability arising from your breach of these Terms or your use of the services in violation of applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Intellectual Property Rights</h2>
            <p>
              All content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are the exclusive property of Asante Andi Consulting or its content suppliers and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of external sites. Your use of third-party websites is at your own risk and subject to their terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">16. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to services immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">17. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the Republic of South Africa, and you irrevocably submit to the exclusive jurisdiction of the courts located in South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">18. Amendments</h2>
            <p>
              Asante Andi Consulting may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">19. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">20. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
              <p><strong>Email:</strong> legal@asanteandiconsulting.com</p>
              <p><strong>Phone:</strong> +27 (0) 76 088 4005</p>
              <p><strong>Address:</strong> South Africa</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;