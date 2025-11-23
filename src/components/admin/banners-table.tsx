/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Calendar, ArrowUpDown, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteBanner, toggleBannerStatus } from "@/app/admin/banners/actions";
import Link from "next/link";

export function BannersTable({ banners }: { banners: any[] }) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const result = await deleteBanner(deleteId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Banner deleted successfully");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete banner");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            const result = await toggleBannerStatus(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    `Banner ${result.isActive ? "activated" : "deactivated"} successfully`
                );
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update banner status");
        }
    };

    if (banners.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50/50">
                <div className="max-w-sm mx-auto">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Create your first banner to promote your products and offers
                    </p>
                    <Button asChild>
                        <Link href="/admin/banners/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Banner
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="font-semibold text-gray-900 py-4">Title</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Message</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">
                                <div className="flex items-center gap-1">
                                    Priority
                                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900 py-4">Dates</TableHead>
                            <TableHead className="text-right font-semibold text-gray-900 py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-4">
                                    <div className="font-medium text-gray-900">{banner.title}</div>
                                </TableCell>
                                <TableCell className="py-4 max-w-xs">
                                    <div className="text-sm text-gray-600 line-clamp-2">{banner.message}</div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant={banner.isActive ? "default" : "secondary"}
                                        className={banner.isActive
                                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
                                        }
                                    >
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${banner.priority}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{banner.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-3 w-3" />
                                        {banner.startDate
                                            ? new Date(banner.startDate).toLocaleDateString()
                                            : "No start"}{" "}
                                        -{" "}
                                        {banner.endDate
                                            ? new Date(banner.endDate).toLocaleDateString()
                                            : "No end"}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                onClick={() => router.push(`/admin/banners/${banner._id}`)}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit Banner
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleToggleStatus(banner._id)}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                {banner.isActive ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4" />
                                                        Activate
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setDeleteId(banner._id)}
                                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Delete Banner</AlertDialogTitle>
                                <AlertDialogDescription className="text-base">
                                    This action cannot be undone. The banner will be permanently removed.
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Banner"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}