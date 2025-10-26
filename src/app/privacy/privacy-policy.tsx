"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Eye,
  User,
  CreditCard,
  Mail,
  Smartphone,
  Cookie,
  Lock,
  Download,
  Calendar,
} from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export function PrivacyPolicy() {
  const [lastUpdated] = useState("January 1, 2024");

  const policySections = [
    {
      id: "information-collected",
      title: "Information We Collect",
      icon: <Eye className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Personal Information</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Contact details (name, email address, phone number)</li>
          <li>Shipping and billing addresses</li>
          <li>Payment information (processed securely through our payment partners)</li>
          <li>Account credentials and preferences</li>
        </ul>

        <h4 class="font-semibold mb-3">Automatically Collected Information</h4>
        <ul class="list-disc list-inside space-y-2">
          <li>Device information and IP address</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on site</li>
          <li>Referring website information</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      `,
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: <User className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Primary Uses</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Process and fulfill your orders</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Personalize your shopping experience</li>
          <li>Process payments and prevent fraud</li>
        </ul>

        <h4 class="font-semibold mb-3">Communication</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Send promotional emails (with your consent)</li>
          <li>Notify you about new products and special offers</li>
          <li>Request feedback and reviews</li>
          <li>Send important policy updates</li>
        </ul>

        <h4 class="font-semibold mb-3">Analytics & Improvement</h4>
        <ul class="list-disc list-inside space-y-2">
          <li>Analyze website usage and performance</li>
          <li>Improve our products and services</li>
          <li>Develop new features and functionality</li>
          <li>Ensure website security and prevent abuse</li>
        </ul>
      `,
    },
    {
      id: "data-sharing",
      title: "Data Sharing & Disclosure",
      icon: <CreditCard className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Service Providers</h4>
        <p class="mb-3">We share information with trusted third parties who assist us in operating our website and conducting our business, including:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Payment processors (Stripe, PayPal)</li>
          <li>Shipping carriers (UPS, FedEx, USPS)</li>
          <li>Email marketing platforms</li>
          <li>Analytics and customer support tools</li>
        </ul>

        <h4 class="font-semibold mb-3">Legal Requirements</h4>
        <p class="mb-3">We may disclose your information when required by law or to:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Comply with legal processes</li>
          <li>Protect our rights and property</li>
          <li>Prevent fraud or security issues</li>
          <li>Protect the safety of our users</li>
        </ul>

        <h4 class="font-semibold mb-3">Business Transfers</h4>
        <p>In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
      `,
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Cookie className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Types of Cookies We Use</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
          <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
        </ul>

        <h4 class="font-semibold mb-3">Managing Cookies</h4>
        <p class="mb-3">You can control cookie settings through your browser. However, disabling certain cookies may affect your experience on our website.</p>

        <h4 class="font-semibold mb-3">Third-Party Tracking</h4>
        <p>We use services like Google Analytics to help analyze how users use the site. These tools use cookies to collect standard internet log information and visitor behavior information.</p>
      `,
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Security Measures</h4>
        <p class="mb-3">We implement appropriate technical and organizational security measures to protect your personal information, including:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>SSL encryption for data transmission</li>
          <li>Secure servers and firewalls</li>
          <li>Regular security assessments</li>
          <li>Limited access to personal information</li>
          <li>Employee training on data protection</li>
        </ul>

        <h4 class="font-semibold mb-3">Payment Security</h4>
        <p class="mb-3">All payment transactions are processed through PCI-DSS compliant payment gateways. We do not store your complete payment card information on our servers.</p>

        <h4 class="font-semibold mb-3">Data Retention</h4>
        <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>
      `,
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      icon: <Shield className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Access and Control</h4>
        <p class="mb-3">You have the right to:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Request restriction of processing</li>
          <li>Data portability</li>
        </ul>

        <h4 class="font-semibold mb-3">Marketing Communications</h4>
        <p class="mb-3">You can opt-out of marketing communications at any time by:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Clicking the "unsubscribe" link in our emails</li>
          <li>Updating your preferences in your account settings</li>
          <li>Contacting our customer support team</li>
        </ul>

        <h4 class="font-semibold mb-3">Exercising Your Rights</h4>
        <p>To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.</p>
      `,
    },
    {
      id: "international",
      title: "International Transfers",
      icon: <Smartphone className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Data Transfer</h4>
        <p class="mb-3">Your personal information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country.</p>

        <h4 class="font-semibold mb-3">Safeguards</h4>
        <p class="mb-3">We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy, including:</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Standard contractual clauses</li>
          <li>Adequacy decisions</li>
          <li>Other legally approved mechanisms</li>
        </ul>

        <h4 class="font-semibold mb-3">Specific Regions</h4>
        <p>For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we comply with applicable data protection laws regarding international data transfers.</p>
      `,
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: <Mail className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Age Restrictions</h4>
        <p class="mb-3">Our website is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.</p>

        <h4 class="font-semibold mb-3">Parental Control</h4>
        <p class="mb-3">If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove that information from our servers.</p>

        <h4 class="font-semibold mb-3">Verification</h4>
        <p>If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information.</p>
      `,
    },
  ];

  const quickLinks = [
    { title: "Information Collection", href: "#information-collected" },
    { title: "How We Use Data", href: "#how-we-use" },
    { title: "Data Sharing", href: "#data-sharing" },
    { title: "Cookie Policy", href: "#cookies" },
    { title: "Your Rights", href: "#your-rights" },
    { title: "Contact Information", href: "#contact" },
  ];

  const handleDownloadPDF = () => {
    // In a real implementation, this would download the PDF version
    alert(
      "PDF download would start here. In production, link to actual PDF file."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              How we protect and use your personal information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Last updated: {lastUpdated}
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                GDPR Compliant
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                CCPA Ready
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <nav className="space-y-2">
                      {quickLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="block py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          {link.title}
                        </a>
                      ))}
                    </nav>
                  </ScrollArea>
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy Overview</CardTitle>
                  <CardDescription>
                    This Privacy Policy describes how we collect, use, and share
                    your personal information when you visit or make a purchase
                    from our website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Introduction */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                    <p className="text-gray-600 mb-4">
                      Welcome to our Privacy Policy. Your privacy is critically
                      important to us, and we are committed to protecting your
                      personal information and being transparent about what
                      information we collect and how we use it.
                    </p>
                    <p className="text-gray-600">
                      This policy applies to all information collected through
                      our website and any related services, sales, marketing, or
                      events.
                    </p>
                  </section>

                  {/* Policy Sections */}
                  {policySections.map((section, index) => (
                    <section key={section.id} id={section.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {section.icon}
                        </div>
                        <h2 className="text-2xl font-bold">{section.title}</h2>
                      </div>
                      <div
                        className="text-gray-600 prose prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </section>
                  ))}

                  {/* Policy Updates */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
                    <p className="text-gray-600 mb-4">
                      We may update this privacy policy from time to time to
                      reflect changes to our practices or for other operational,
                      legal, or regulatory reasons.
                    </p>
                    <p className="text-gray-600">
                      We will notify you of any material changes by posting the
                      new Privacy Policy on this page and updating the "Last
                      Updated" date at the top of this policy.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section id="contact">
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about this Privacy Policy or our
                      privacy practices, please contact us:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">Email: {CONTACT_INFO.EMAIL}</p>
                      <p className="font-semibold">Phone: {CONTACT_INFO.PHONE}</p>
                      <p className="font-semibold">
                        Address: {CONTACT_INFO.ADDRESS}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">
                      We typically respond to privacy-related inquiries within
                      48 hours.
                    </p>
                  </section>

                  {/* Consent */}
                  <section className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Your Consent</h3>
                    <p className="text-gray-700">
                      By using our website, you hereby consent to our Privacy
                      Policy and agree to its terms.
                    </p>
                  </section>
                </CardContent>
              </Card>

              {/* Mobile Quick Links */}
              <div className="lg:hidden mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="sections">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sections">Sections</TabsTrigger>
                        <TabsTrigger value="rights">Your Rights</TabsTrigger>
                      </TabsList>
                      <TabsContent value="sections">
                        <Accordion type="single" collapsible>
                          {policySections.map((section, index) => (
                            <AccordionItem key={index} value={section.id}>
                              <AccordionTrigger>
                                {section.title}
                              </AccordionTrigger>
                              <AccordionContent>
                                <a
                                  href={`#${section.id}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  Jump to section
                                </a>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </TabsContent>
                      <TabsContent value="rights">
                        <div className="space-y-2">
                          <p className="font-semibold">
                            You have the right to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request data deletion</li>
                            <li>Object to data processing</li>
                            <li>Data portability</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
