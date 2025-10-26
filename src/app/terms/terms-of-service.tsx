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
  FileText,
  Scale,
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Download,
} from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export function TermsOfService() {
  const [lastUpdated] = useState("January 1, 2024");
  const [effectiveDate] = useState("January 1, 2024");

  const termsSections = [
    {
      id: "agreement",
      title: "Agreement to Terms",
      icon: <Scale className="h-5 w-5" />,
      content: `
        <p class="mb-4">By accessing and using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        
        <h4 class="font-semibold mb-3">Eligibility</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>You must be at least 16 years old to use our services</li>
          <li>You have the legal capacity to enter into binding contracts</li>
          <li>You will use the website in compliance with all applicable laws</li>
        </ul>

        <h4 class="font-semibold mb-3">Modifications</h4>
        <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the modified terms.</p>
      `,
    },
    {
      id: "accounts",
      title: "User Accounts & Registration",
      icon: <Shield className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Account Creation</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>You must provide accurate and complete registration information</li>
          <li>You are responsible for maintaining account confidentiality</li>
          <li>You must notify us immediately of any unauthorized use</li>
          <li>We reserve the right to refuse service or cancel accounts at our discretion</li>
        </ul>

        <h4 class="font-semibold mb-3">Account Responsibilities</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Maintain the security of your password</li>
          <li>Update your information to keep it current</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Not share your account credentials with others</li>
        </ul>

        <h4 class="font-semibold mb-3">Account Termination</h4>
        <p>We may suspend or terminate your account for violations of these terms, fraudulent activities, or at our sole discretion.</p>
      `,
    },
    {
      id: "products",
      title: "Products & Pricing",
      icon: <ShoppingCart className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Product Information</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>We strive to display accurate product descriptions and images</li>
          <li>Colors may vary due to monitor settings and photography</li>
          <li>We reserve the right to limit quantities and refuse orders</li>
          <li>All products are subject to availability</li>
        </ul>

        <h4 class="font-semibold mb-3">Pricing</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>All prices are in US Dollars unless otherwise stated</li>
          <li>Prices are subject to change without notice</li>
          <li>We are not responsible for pricing errors and may cancel orders containing errors</li>
          <li>Additional taxes and shipping fees may apply</li>
        </ul>

        <h4 class="font-semibold mb-3">Order Acceptance</h4>
        <p>Your receipt of an order confirmation does not constitute our acceptance of your order. We reserve the right to refuse or cancel any order for any reason.</p>
      `,
    },
    {
      id: "payments",
      title: "Payment Terms",
      icon: <CreditCard className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Accepted Payment Methods</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Credit Cards (Visa, MasterCard, American Express, Discover)</li>
          <li>PayPal</li>
          <li>Apple Pay and Google Pay</li>
          <li>Other payment methods as indicated during checkout</li>
        </ul>

        <h4 class="font-semibold mb-3">Payment Processing</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Payment is processed at the time of order placement</li>
          <li>We use secure third-party payment processors</li>
          <li>You authorize us to charge the provided payment method</li>
          <li>Failed payments may result in order cancellation</li>
        </ul>

        <h4 class="font-semibold mb-3">Sales Tax</h4>
        <p>Applicable sales tax will be calculated and added to your order total based on your shipping address and local tax regulations.</p>
      `,
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <Truck className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Shipping Methods & Times</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Standard Shipping: 3-5 business days</li>
          <li>Express Shipping: 1-2 business days</li>
          <li>International Shipping: 7-14 business days</li>
          <li>Processing Time: 1-2 business days before shipment</li>
        </ul>

        <h4 class="font-semibold mb-3">Shipping Costs</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Calculated based on package weight and destination</li>
          <li>Displayed during checkout before payment</li>
          <li>Free shipping may be available for orders over specified amounts</li>
          <li>International customers responsible for customs and duties</li>
        </ul>

        <h4 class="font-semibold mb-3">Delivery Issues</h4>
        <p>We are not responsible for delivery delays caused by shipping carriers, weather, customs, or other circumstances beyond our control. Risk of loss passes to you upon delivery to the carrier.</p>
      `,
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: <RotateCcw className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Return Policy</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>30-day return period from delivery date</li>
          <li>Items must be in original condition with tags attached</li>
          <li>Return shipping costs are the customer's responsibility</li>
          <li>Sale items may have different return conditions</li>
        </ul>

        <h4 class="font-semibold mb-3">Refund Process</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Refunds processed within 5-10 business days of receipt</li>
          <li>Original shipping costs are non-refundable</li>
          <li>Refunds issued to original payment method</li>
          <li>Store credit may be offered as an alternative</li>
        </ul>

        <h4 class="font-semibold mb-3">Non-Returnable Items</h4>
        <p>The following items cannot be returned: personalized/customized products, intimate apparel, final sale items, and products damaged by customer misuse.</p>
      `,
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <FileText className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Our Intellectual Property</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>All website content, logos, and designs are our property</li>
          <li>Product designs and branding are protected by copyright</li>
          <li>Trademarks and service marks are our property</li>
          <li>Content may not be used without express written permission</li>
        </ul>

        <h4 class="font-semibold mb-3">Limited License</h4>
        <p class="mb-4">We grant you a limited, non-exclusive, non-transferable license to access and use the website for personal shopping purposes only.</p>

        <h4 class="font-semibold mb-3">Prohibited Uses</h4>
        <ul class="list-disc list-inside space-y-2">
          <li>Copying, modifying, or distributing website content</li>
          <li>Using our intellectual property for commercial purposes</li>
          <li>Reverse engineering or scraping website content</li>
          <li>Creating derivative works based on our content</li>
        </ul>
      `,
    },
    {
      id: "prohibited-conduct",
      title: "Prohibited Conduct",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Website Usage</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>No unauthorized access or interference with website operations</li>
          <li>No transmission of viruses or malicious code</li>
          <li>No attempts to bypass security measures</li>
          <li>No use of automated systems to access the website</li>
        </ul>

        <h4 class="font-semibold mb-3">Fraud & Abuse</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>No fraudulent purchases or payment methods</li>
          <li>No false information in account registration</li>
          <li>No attempts to manipulate pricing or availability</li>
          <li>No abuse of promotions or discount codes</li>
        </ul>

        <h4 class="font-semibold mb-3">Legal Compliance</h4>
        <p>You agree to use the website in compliance with all applicable laws and regulations. Any violation may result in termination of your access and legal action.</p>
      `,
    },
    {
      id: "disclaimers",
      title: "Disclaimers & Limitations",
      icon: <Scale className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Service Availability</h4>
        <p class="mb-4">We do not guarantee uninterrupted or error-free access to our website. We may suspend access for maintenance, updates, or other reasons without notice.</p>

        <h4 class="font-semibold mb-3">Product Information</h4>
        <p class="mb-4">While we strive for accuracy, we do not warrant that product descriptions, prices, or other content are error-free. We reserve the right to correct errors.</p>

        <h4 class="font-semibold mb-3">Limitation of Liability</h4>
        <p class="mb-4">To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website.</p>

        <h4 class="font-semibold mb-3">Indemnification</h4>
        <p>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your violation of these terms or use of the website.</p>
      `,
    },
    {
      id: "governing-law",
      title: "Governing Law & Disputes",
      icon: <Scale className="h-5 w-5" />,
      content: `
        <h4 class="font-semibold mb-3">Governing Law</h4>
        <p class="mb-4">These terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law provisions.</p>

        <h4 class="font-semibold mb-3">Dispute Resolution</h4>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Informal negotiation for 30 days before formal proceedings</li>
          <li>Binding arbitration for disputes under $10,000</li>
          <li>Small claims court for eligible disputes</li>
          <li>Class action waivers where permitted by law</li>
        </ul>

        <h4 class="font-semibold mb-3">Jurisdiction</h4>
        <p>Any legal proceedings shall be brought in the state or federal courts located in [Your City, Your State], and you consent to personal jurisdiction in these courts.</p>
      `,
    },
  ];

  const quickLinks = [
    { title: "Agreement to Terms", href: "#agreement" },
    { title: "User Accounts", href: "#accounts" },
    { title: "Products & Pricing", href: "#products" },
    { title: "Payment Terms", href: "#payments" },
    { title: "Shipping & Delivery", href: "#shipping" },
    { title: "Returns & Refunds", href: "#returns" },
    { title: "Intellectual Property", href: "#intellectual-property" },
    { title: "Prohibited Conduct", href: "#prohibited-conduct" },
    { title: "Disclaimers", href: "#disclaimers" },
    { title: "Governing Law", href: "#governing-law" },
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
      <section className="bg-gradient-to-br from-gray-50 to-orange-50 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Please read these terms carefully before using our website
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Last updated: {lastUpdated}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Effective: {effectiveDate}
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Legal Document
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
                  <CardDescription>Jump to specific sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <nav className="space-y-2">
                      {quickLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="block py-2 px-3 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
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
                  <CardTitle>Terms of Service Overview</CardTitle>
                  <CardDescription>
                    These Terms of Service govern your use of our website and
                    the purchase of products from our store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Introduction */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                    <p className="text-gray-600 mb-4">
                      Welcome to our Terms of Service. These terms outline the
                      rules and regulations for the use of our website and the
                      purchase of products from our online store.
                    </p>
                    <p className="text-gray-600">
                      By accessing this website, we assume you accept these
                      terms and conditions. Do not continue to use our website
                      if you do not agree to all the terms and conditions stated
                      on this page.
                    </p>
                  </section>

                  {/* Terms Sections */}
                  {termsSections.map((section, index) => (
                    <section key={section.id} id={section.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                          {section.icon}
                        </div>
                        <h2 className="text-2xl font-bold">{section.title}</h2>
                      </div>
                      <div
                        className="text-gray-600 prose prose-orange max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </section>
                  ))}

                  {/* Termination */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Termination</h2>
                    <p className="text-gray-600 mb-4">
                      We may terminate or suspend your access to our service
                      immediately, without prior notice or liability, for any
                      reason whatsoever, including without limitation if you
                      breach the Terms.
                    </p>
                    <p className="text-gray-600">
                      Upon termination, your right to use the service will cease
                      immediately. If you wish to terminate your account, you
                      may simply discontinue using the service.
                    </p>
                  </section>

                  {/* Severability */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Severability</h2>
                    <p className="text-gray-600">
                      If any provision of these Terms is held to be
                      unenforceable or invalid, such provision will be changed
                      and interpreted to accomplish the objectives of such
                      provision to the greatest extent possible under applicable
                      law and the remaining provisions will continue in full
                      force and effect.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">
                      Contact Information
                    </h2>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about these Terms of Service,
                      please contact us:
                    </p>
                    <div className="bg-gray-50 p-1 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-semibold">
                          Email: {CONTACT_INFO.EMAIL}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4" />
                        <span className="font-semibold">
                          Phone: {CONTACT_INFO.PHONE}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-semibold">
                          Address: {CONTACT_INFO.ADDRESS}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Acceptance */}
                  <section className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      Acceptance of Terms
                    </h3>
                    <p className="text-gray-700">
                      By using our website and services, you acknowledge that
                      you have read, understood, and agree to be bound by these
                      Terms of Service.
                    </p>
                  </section>
                </CardContent>
              </Card>

              {/* Mobile Quick Links */}
              <div className="lg:hidden mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Navigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="sections">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sections">All Sections</TabsTrigger>
                        <TabsTrigger value="important">Key Points</TabsTrigger>
                      </TabsList>
                      <TabsContent value="sections">
                        <Accordion type="single" collapsible>
                          {termsSections.map((section, index) => (
                            <AccordionItem key={index} value={section.id}>
                              <AccordionTrigger>
                                {section.title}
                              </AccordionTrigger>
                              <AccordionContent>
                                <a
                                  href={`#${section.id}`}
                                  className="text-orange-600 hover:underline"
                                >
                                  Jump to section
                                </a>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </TabsContent>
                      <TabsContent value="important">
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold mb-2">Key Points:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              <li>30-day return policy</li>
                              <li>Secure payment processing</li>
                              <li>Account security is your responsibility</li>
                              <li>Prices subject to change</li>
                              <li>Contact us for disputes</li>
                            </ul>
                          </div>
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
