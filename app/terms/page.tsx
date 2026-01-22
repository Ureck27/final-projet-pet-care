import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/30 px-4 py-16">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">Last updated: January 15, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="prose prose-gray mx-auto max-w-3xl dark:prose-invert">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using PetCare's platform, you agree to be bound by these Terms of Service and all applicable
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using this
            platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            PetCare provides a platform connecting pet owners with certified trainers and pet care professionals. Our
            services include but are not limited to:
          </p>
          <ul>
            <li>Pet training session bookings</li>
            <li>Pet sitting and walking services</li>
            <li>Grooming service coordination</li>
            <li>Pet health tracking and management</li>
          </ul>

          <h2>3. User Accounts</h2>
          <h3>Account Creation</h3>
          <p>To use certain features of our platform, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3>Account Types</h3>
          <p>
            We offer two types of accounts: Pet Owner accounts and Trainer accounts. Each account type has specific
            features and responsibilities associated with it.
          </p>

          <h2>4. Trainer Requirements</h2>
          <p>Trainers on our platform must:</p>
          <ul>
            <li>Hold valid professional certifications</li>
            <li>Pass background verification checks</li>
            <li>Maintain appropriate insurance coverage</li>
            <li>Comply with all local regulations and licensing requirements</li>
            <li>Adhere to our community guidelines and professional standards</li>
          </ul>

          <h2>5. Booking and Payments</h2>
          <h3>Bookings</h3>
          <p>
            When you book a service through PetCare, you enter into a direct agreement with the trainer or service
            provider. PetCare facilitates this connection but is not a party to the service agreement.
          </p>

          <h3>Payments</h3>
          <p>
            All payments are processed securely through our platform. By making a payment, you agree to our payment
            terms and authorize us to charge your payment method.
          </p>

          <h3>Cancellation Policy</h3>
          <ul>
            <li>Cancellations made 24+ hours before: Full refund</li>
            <li>Cancellations made 12-24 hours before: 50% refund</li>
            <li>Cancellations made less than 12 hours before: No refund</li>
          </ul>

          <h2>6. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Submit false or misleading information</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the platform for any fraudulent purpose</li>
            <li>Circumvent our fee structure</li>
          </ul>

          <h2>7. Content and Intellectual Property</h2>
          <p>
            All content on the PetCare platform, including text, graphics, logos, and software, is the property of
            PetCare or its licensors and is protected by intellectual property laws.
          </p>
          <p>
            By posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use,
            modify, and display that content in connection with our services.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            PetCare is a platform that connects pet owners with trainers. We are not responsible for the actions,
            services, or conduct of any users, including trainers. To the maximum extent permitted by law:
          </p>
          <ul>
            <li>We provide the platform "as is" without warranties</li>
            <li>We are not liable for any indirect, incidental, or consequential damages</li>
            <li>Our total liability is limited to the fees you paid in the past 12 months</li>
          </ul>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless PetCare, its officers, directors, employees, and agents from any
            claims, damages, or expenses arising from your use of the platform or violation of these terms.
          </p>

          <h2>10. Dispute Resolution</h2>
          <p>
            Any disputes arising from these terms or your use of the platform shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of significant changes via
            email or platform notification. Continued use of the platform after changes constitutes acceptance of the
            new terms.
          </p>

          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violations of these terms or for any other reason
            at our sole discretion. Upon termination, your right to use the platform ceases immediately.
          </p>

          <h2>13. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at:</p>
          <ul>
            <li>Email: legal@petcare.com</li>
            <li>Address: 123 Pet Street, Suite 100, San Francisco, CA 94102</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
