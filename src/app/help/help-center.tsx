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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Truck,
  Shield,
  CreditCard,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { CONTACT_INFO } from "@/constants";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface ContactMethod {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  availability?: string;
}

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQ[] = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days. International shipping typically takes 7-14 business days depending on the destination.",
      category: "shipping",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in original condition with tags attached. Sale items may have different return conditions. Please contact us for personalized assistance.",
      category: "returns",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Order History' section.",
      category: "orders",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. Customs fees may apply depending on your country's regulations.",
      category: "shipping",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for certain orders.",
      category: "payments",
    },
    {
      question: "How do I change or cancel my order?",
      answer:
        "You can change or cancel your order within 1 hour of placement by contacting our customer service team. After 1 hour, orders enter processing and cannot be modified.",
      category: "orders",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Yes, we guarantee 100% authenticity for all our products. We work directly with brands and authorized distributors to ensure genuine products.",
      category: "products",
    },
    {
      question: "How do I care for my jewelry?",
      answer:
        "Avoid contact with water, chemicals, and perfumes. Store in a dry place and clean with a soft cloth. Specific care instructions vary by material - refer to product details.",
      category: "products",
    },
  ];

  const contactMethods: ContactMethod[] = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our customer service team",
      action: CONTACT_INFO.PHONE,
      availability: "24/7",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: CONTACT_INFO.EMAIL,
      availability: "24/7",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Instant messaging with our support team",
      action: "Start Chat",
      availability: "Mon-Fri, 9AM-6PM EST",
    },
  ];

  const popularTopics = [
    { name: "Order Tracking", icon: <Truck className="h-5 w-5" />, count: 124 },
    {
      name: "Returns & Exchanges",
      icon: <RotateCcw className="h-5 w-5" />,
      count: 89,
    },
    {
      name: "Payment Issues",
      icon: <CreditCard className="h-5 w-5" />,
      count: 67,
    },
    { name: "Product Care", icon: <Shield className="h-5 w-5" />, count: 54 },
    { name: "Shipping Info", icon: <Clock className="h-5 w-5" />, count: 112 },
    {
      name: "Account Help",
      icon: <HelpCircle className="h-5 w-5" />,
      count: 45,
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support
            team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {topic.count} questions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to the most common questions we receive
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                      <Badge variant="secondary" className="mt-2">
                        {faq.category}
                      </Badge>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs
                    .filter((faq) => faq.category === category)
                    .map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-400">
                Try different keywords or contact support
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our customer support team is here to assist you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 rounded-full text-blue-600 w-fit">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-2">{method.action}</Button>
                  {method.availability && (
                    <p className="text-sm text-gray-500">
                      Available: {method.availability}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-gray-300">Support Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15min</div>
              <p className="text-gray-300">Average Response Time</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <p className="text-gray-300">Questions Answered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
