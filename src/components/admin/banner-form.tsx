/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette, Calendar, Target, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createBanner, updateBanner } from "@/app/admin/banners/actions";

const bannerSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    bgColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    link: z.string().url("Invalid URL").optional().or(z.literal("")),
    isActive: z.boolean(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    priority: z.number().int().min(0).max(100),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
    banner?: any;
}

export function BannerForm({ banner }: BannerFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BannerFormValues>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            title: banner?.title || "",
            message: banner?.message || "",
            bgColor: banner?.bgColor || "#ec4899",
            textColor: banner?.textColor || "#ffffff",
            link: banner?.link || "",
            isActive: banner?.isActive ?? true,
            startDate: banner?.startDate
                ? new Date(banner.startDate).toISOString().split("T")[0]
                : "",
            endDate: banner?.endDate
                ? new Date(banner.endDate).toISOString().split("T")[0]
                : "",
            priority: banner?.priority ?? 50,
        },
    });

    const onSubmit = async (data: BannerFormValues) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                link: data.link || undefined,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            };

            const result = banner
                ? await updateBanner(banner._id, payload)
                : await createBanner(payload);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    banner ? "Banner updated successfully" : "Banner created successfully"
                );
                router.push("/admin/banners");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const bgColor = form.watch("bgColor");
    const textColor = form.watch("textColor");
    const message = form.watch("message");
    const title = form.watch("title");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                Banner Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Summer Sale 2024"
                                                        {...field}
                                                        className="focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Internal title for identifying this banner
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="⚡ ALL PRODUCTS FLAT ₹395 · ENDS IN 00:00:23"
                                                        {...field}
                                                        className="min-h-[80px] focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    The promotional message displayed to users
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="bgColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Palette className="h-4 w-4" />
                                                        Background Color
                                                    </FormLabel>
                                                    <div className="flex gap-3 items-center">
                                                        <FormControl>
                                                            <Input
                                                                type="color"
                                                                {...field}
                                                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                                            />
                                                        </FormControl>
                                                        <Input
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="#ec4899"
                                                            className="flex-1 focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="textColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Palette className="h-4 w-4" />
                                                        Text Color
                                                    </FormLabel>
                                                    <div className="flex gap-3 items-center">
                                                        <FormControl>
                                                            <Input
                                                                type="color"
                                                                {...field}
                                                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                                            />
                                                        </FormControl>
                                                        <Input
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="#ffffff"
                                                            className="flex-1 focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Link (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com/sale"
                                                        {...field}
                                                        className="focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    URL to redirect when banner is clicked
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        Start Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            className="focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="endDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        End Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            className="focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Priority</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                                                        />
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>Low (0)</span>
                                                            <span className="font-medium">{field.value}</span>
                                                            <span>High (100)</span>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Higher priority banners are shown first
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base font-medium">Active Status</FormLabel>
                                                    <FormDescription className="text-sm">
                                                        Display this banner on the website
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-green-600"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/admin/banners")}
                                            disabled={isLoading}
                                            className="flex-1 border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {banner ? "Update Banner" : "Create Banner"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-sm sticky top-6">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Eye className="h-5 w-5 text-green-600" />
                                Live Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-gray-700">Banner Preview:</div>
                                <div
                                    className="w-full px-4 py-3 text-center text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                                    style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        border: `1px solid ${bgColor}20`
                                    }}
                                >
                                    {message || "Your banner message will appear here"}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="text-sm font-medium text-gray-700">Details:</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Title:</span>
                                        <span className="font-medium">{title || "Untitled"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge variant={form.watch("isActive") ? "default" : "secondary"}>
                                            {form.watch("isActive") ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Priority:</span>
                                        <span className="font-medium">{form.watch("priority")}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}