"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "@/constants";

const pressFeatures = [
  {
    id: 1,
    title: "Featured in Vogue India",
    description:
      "Our handcrafted diamond collection was highlighted by Vogue India as one of the top emerging jewelry brands of the year.",
    image:
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761488742/0777a57f-1bec-441a-940b-a187939c5516.png",
    date: "March 2025",
    link: "https://www.vogue.in",
  },
  {
    id: 2,
    title: "Grazia: The Future of Fine Jewelry",
    description:
      "Grazia magazine praised our sustainable sourcing and timeless aesthetic that bridges tradition and modern design.",
    image:
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761488805/0fc753f1-71aa-4525-9dff-e80236e9dec6.png",
    date: "January 2025",
    link: "https://www.grazia.co.in",
  },
  {
    id: 3,
    title: "Elle: Women Behind the Brand",
    description:
      "Elle India celebrated our female-led design team for their commitment to craftsmanship and ethical luxury.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop&crop=center",
    date: "December 2024",
    link: "https://www.elle.in",
  },
  {
    id: 4,
    title: "Times Fashion Week Collaboration",
    description:
      "We showcased our royal heritage collection at Times Fashion Week 2024, blending vintage elegance with contemporary allure.",
    image:
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761488864/9f37b4be-ff40-4b5b-a282-a716ae718d6a.png",
    date: "September 2024",
    link: "https://timesfashionweek.com",
  },
];

export default function PressPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-6 relative">
      {/* 🔙 Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        ← Back
      </Button>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800">In the Press</h1>
        <p className="text-gray-500 mt-2">
          We’re humbled to be featured in leading fashion magazines, luxury
          blogs, and global media.
        </p>
      </div>

      {/* Press Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pressFeatures.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-amber-700">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 text-sm space-y-2">
                <p>{item.description}</p>
                <p className="text-xs text-gray-400 italic">{item.date}</p>
                <Button
                  variant="link"
                  className="text-amber-700 hover:text-amber-800 p-0"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  Read Article →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto text-center mt-16">
        <p className="text-gray-500">
          Interested in featuring us? Contact our PR team at{" "}
          <a
            href="mailto:press@yourbrand.com"
            className="text-amber-700 font-medium underline hover:text-amber-800"
          >
            {CONTACT_INFO.EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
