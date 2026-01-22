import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/30 px-4 py-16">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: January 15, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="prose prose-gray mx-auto max-w-3xl dark:prose-invert">
          <h2>1. Introduction</h2>
          <p>
            Welcome to PetCare ("we," "our," or "us"). We are committed to protecting your personal information and your
            right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Book services through our platform</li>
            <li>Contact us for support</li>
            <li>Subscribe to our newsletter</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Billing and payment information</li>
            <li>Pet information (name, breed, medical history)</li>
            <li>Profile photos and content you upload</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you access our platform, we automatically collect certain information, including:</p>
          <ul>
            <li>Device information (browser type, operating system)</li>
            <li>IP address and location data</li>
            <li>Usage data and browsing history on our platform</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process bookings and payments</li>
            <li>Communicate with you about your account and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our platform and develop new features</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Trainers and service providers to fulfill bookings</li>
            <li>Payment processors for transaction handling</li>
            <li>Analytics providers to improve our services</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>We do not sell your personal information to third parties for marketing purposes.</p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information,
            including encryption, secure servers, and regular security audits. However, no method of transmission over
            the internet is 100% secure.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience. You can manage your cookie
            preferences through your browser settings.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our platform is not intended for users under 18 years of age. We do not knowingly collect information from
            children under 18.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            policy on this page and updating the "Last updated" date.
          </p>

          <h2>10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
          <ul>
            <li>Email: privacy@petcare.com</li>
            <li>Address: 123 Pet Street, Suite 100, San Francisco, CA 94102</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
