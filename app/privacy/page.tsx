import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, CheckCircle2, Lock, Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-4 py-16">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">
            <Eye className="mr-2 h-4 w-4" />
            Legal & Privacy
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">Your trust and privacy are paramount to us</p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: January 15, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Section 1 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl">Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed text-foreground">
                Welcome to PetCare ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-2xl">Information We Collect</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-primary mb-3">Personal Information</h4>
                <p className="text-foreground mb-3">We may collect personal information that you voluntarily provide when you:</p>
                <ul className="space-y-2 ml-4 mb-4">
                  {["Register for an account", "Book services through our platform", "Contact us for support", "Subscribe to our newsletter"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground mb-3">This information may include:</p>
                <ul className="space-y-2 ml-4">
                  {["Name, email address, and phone number", "Billing and payment information", "Pet information (name, breed, medical history)", "Profile photos and content you upload"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-lg text-primary mb-3">Automatically Collected Information</h4>
                <p className="text-foreground mb-3">When you access our platform, we automatically collect certain information, including:</p>
                <ul className="space-y-2 ml-4">
                  {["Device information (browser type, operating system)", "IP address and location data", "Usage data and browsing history on our platform", "Cookies and similar tracking technologies"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground mb-3">We use the information we collect to:</p>
              <ul className="space-y-2 ml-4">
                {["Provide and maintain our services", "Process bookings and payments", "Communicate with you about your account and services", "Send marketing communications (with your consent)", "Improve our platform and develop new features", "Ensure platform security and prevent fraud", "Comply with legal obligations"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <CardTitle className="text-2xl">Sharing Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">We may share your information with:</p>
              <ul className="space-y-2 ml-4 mb-4">
                {["Trainers and service providers to fulfill bookings", "Payment processors for transaction handling", "Analytics providers to improve our services", "Legal authorities when required by law"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-border">
                <p className="text-foreground italic">We do not sell your personal information to third parties for marketing purposes.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">5</span>
                </div>
                <CardTitle className="text-2xl">Data Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed text-foreground">
                We implement appropriate technical and organizational measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">6</span>
                </div>
                <CardTitle className="text-2xl">Your Rights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground mb-3">Depending on your location, you may have the right to:</p>
              <ul className="space-y-2 ml-4">
                {["Access and receive a copy of your personal data", "Rectify inaccurate personal data", "Request deletion of your personal data", "Object to or restrict processing of your data", "Data portability", "Withdraw consent at any time"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">7</span>
                </div>
                <CardTitle className="text-2xl">Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">
                We use cookies and similar tracking technologies to enhance your experience. You can manage your cookie preferences through your browser settings.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">8</span>
                </div>
                <CardTitle className="text-2xl">Children's Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">
                Our platform is not intended for users under 18 years of age. We do not knowingly collect information from children under 18.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">9</span>
                </div>
                <CardTitle className="text-2xl">Changes to This Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">10</span>
                </div>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
              <ul className="space-y-2 ml-4">
                {["Email: privacy@petcare.com", "Address: 123 Pet Street, Suite 100, San Francisco, CA 94102"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-secondary/5 border-t border-border px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Your Privacy is Protected</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                We take your privacy seriously and are committed to transparent data practices. Your personal information is protected with industry-standard security measures and encryption.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
