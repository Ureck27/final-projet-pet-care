import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2 } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-indigo-50/20 dark:from-background dark:to-slate-900/20">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-slate-100/50 via-indigo-100/50 to-blue-100/50 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20 px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Legal Document</Badge>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Please read these terms carefully before using our platform</p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: January 15, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Section 1 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed text-foreground">
                By accessing or using PetCare's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-2xl">Description of Service</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">PetCare provides a platform connecting pet owners with certified trainers and pet care professionals. Our services include but are not limited to:</p>
              <ul className="space-y-2 ml-4">
                {["Pet training session bookings", "Pet sitting and walking services", "Grooming service coordination", "Pet health tracking and management"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-2xl">User Accounts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-primary mb-2">Account Creation</h4>
                <p className="text-foreground mb-3">To use certain features of our platform, you must create an account. You agree to:</p>
                <ul className="space-y-2 ml-4">
                  {["Provide accurate and complete information", "Maintain the security of your account credentials", "Notify us immediately of any unauthorized access", "Accept responsibility for all activities under your account"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-lg text-primary mb-2">Account Types</h4>
                <p className="text-foreground">We offer two types of accounts: Pet Owner accounts and Trainer accounts. Each account type has specific features and responsibilities associated with it.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <CardTitle className="text-2xl">Trainer Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">Trainers on our platform must:</p>
              <ul className="space-y-2 ml-4">
                {["Hold valid professional certifications", "Pass background verification checks", "Maintain appropriate insurance coverage", "Comply with all local regulations and licensing requirements", "Adhere to our community guidelines and professional standards"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">5</span>
                </div>
                <CardTitle className="text-2xl">Booking and Payments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-primary mb-2">Bookings</h4>
                <p className="text-foreground">When you book a service through PetCare, you enter into a direct agreement with the trainer or service provider. PetCare facilitates this connection but is not a party to the service agreement.</p>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-lg text-primary mb-2">Payments</h4>
                <p className="text-foreground">All payments are processed securely through our platform. By making a payment, you agree to our payment terms and authorize us to charge your payment method.</p>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-lg text-primary mb-3">Cancellation Policy</h4>
                <ul className="space-y-2 ml-4">
                  {["Cancellations made 24+ hours before: Full refund", "Cancellations made 12-24 hours before: 50% refund", "Cancellations made less than 12 hours before: No refund"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">6</span>
                </div>
                <CardTitle className="text-2xl">User Conduct</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">You agree not to:</p>
              <ul className="space-y-2 ml-4">
                {["Violate any laws or regulations", "Infringe on the rights of others", "Submit false or misleading information", "Harass, abuse, or harm other users", "Attempt to gain unauthorized access to our systems", "Use the platform for any fraudulent purpose", "Circumvent our fee structure"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Sections 7-13 */}
          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">7</span>
                </div>
                <CardTitle className="text-2xl">Content and Intellectual Property</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">All content on the PetCare platform, including text, graphics, logos, and software, is the property of PetCare or its licensors and is protected by intellectual property laws.</p>
              <p className="text-foreground">By posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display that content in connection with our services.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">8</span>
                </div>
                <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">PetCare is a platform that connects pet owners with trainers. We are not responsible for the actions, services, or conduct of any users, including trainers. To the maximum extent permitted by law:</p>
              <ul className="space-y-2 ml-4">
                {["We provide the platform 'as is' without warranties", "We are not liable for any indirect, incidental, or consequential damages", "Our total liability is limited to the fees you paid in the past 12 months"].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">9</span>
                </div>
                <CardTitle className="text-2xl">Indemnification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">You agree to indemnify and hold harmless PetCare, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the platform or violation of these terms.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">10</span>
                </div>
                <CardTitle className="text-2xl">Dispute Resolution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">11</span>
                </div>
                <CardTitle className="text-2xl">Changes to Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">12</span>
                </div>
                <CardTitle className="text-2xl">Termination</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground">We may terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion. Upon termination, your right to use the platform ceases immediately.</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/40 dark:from-primary/10 dark:to-secondary/10 border-b border-indigo-200 dark:border-border">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">13</span>
                </div>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">For questions about these Terms of Service, please contact us at:</p>
              <ul className="space-y-2 ml-4">
                {["Email: legal@petcare.com", "Address: 123 Pet Street, Suite 100, San Francisco, CA 94102"].map((item, idx) => (
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
      <section className="bg-gradient-to-b from-slate-50/50 to-indigo-50/30 dark:bg-slate-900/50 border-t border-border px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle>Your Rights Protected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                We take your rights and our responsibilities seriously. These terms are designed to protect both our users and our platform.
                If you have any questions or concerns, please don't hesitate to contact our legal team.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
