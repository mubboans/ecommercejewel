"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SizeGuidePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-6 relative">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        ← Back
      </Button>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Jewelry Size Guide
          </h1>
          <p className="text-gray-500">
            Find your perfect fit for rings, bracelets, and necklaces. ✨
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ring Size */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center text-amber-700">
                Ring Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                To measure your ring size, wrap a strip of paper around your
                finger, mark the point where it overlaps, and measure the
                length.
              </p>
              <ul className="list-disc pl-4 text-gray-600">
                <li>Use a millimeter ruler for accuracy.</li>
                <li>Compare your measurement with our chart below.</li>
                <li>Ensure your hands are warm for best results.</li>
              </ul>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border">US Size</th>
                      <th className="p-2 border">Diameter (mm)</th>
                      <th className="p-2 border">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border text-center">5</td>
                      <td className="p-2 border text-center">15.7</td>
                      <td className="p-2 border text-center">49.3</td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">6</td>
                      <td className="p-2 border text-center">16.5</td>
                      <td className="p-2 border text-center">51.9</td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">7</td>
                      <td className="p-2 border text-center">17.3</td>
                      <td className="p-2 border text-center">54.4</td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">8</td>
                      <td className="p-2 border text-center">18.1</td>
                      <td className="p-2 border text-center">57.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bracelet Size */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center text-amber-700">
                Bracelet Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Measure your wrist just above the wrist bone using a flexible
                measuring tape. Add 1–2 cm for a comfortable fit.
              </p>
              <ul className="list-disc pl-4 text-gray-600">
                <li>For a snug fit, add 1 cm.</li>
                <li>For a loose fit, add 2 cm.</li>
              </ul>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border">Wrist (cm)</th>
                      <th className="p-2 border">Bracelet Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border text-center">14–15</td>
                      <td className="p-2 border text-center">Small</td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">16–17</td>
                      <td className="p-2 border text-center">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">18–19</td>
                      <td className="p-2 border text-center">Large</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Necklace Size */}
          <Card className="shadow-md border border-gray-100 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center text-amber-700">
                Necklace Length
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Necklace lengths vary based on style and personal preference.
                Here’s a quick guide to how different lengths fit.
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border">Length (inches)</th>
                      <th className="p-2 border">Fit Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border text-center">14</td>
                      <td className="p-2 border text-center">
                        Choker (tight fit)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">16</td>
                      <td className="p-2 border text-center">
                        Base of the neck
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">18</td>
                      <td className="p-2 border text-center">
                        Just below collarbone
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border text-center">20+</td>
                      <td className="p-2 border text-center">
                        Longer chain look
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accordion Section */}
        <Card className="shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 text-center">
              Common Sizing Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>
                  What if I order the wrong size?
                </AccordionTrigger>
                <AccordionContent>
                  No worries! We offer free resizing for rings and exchanges for
                  other jewelry within 7 days of delivery.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>
                  How can I measure my ring size at home?
                </AccordionTrigger>
                <AccordionContent>
                  You can use a printable ring size chart or wrap a string
                  around your finger, then measure it in millimeters.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>
                  Does bracelet size vary by style?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, chunky or rigid bracelets may need a looser fit compared
                  to delicate chain styles.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
