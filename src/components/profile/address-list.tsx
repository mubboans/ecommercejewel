"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "./address-form";
import { IAddress } from "@/types";
import { deleteAddress } from "@/app/profile/actions";
import { toast } from "sonner";

interface AddressListProps {
    addresses: IAddress[];
}

export function AddressList({ addresses }: AddressListProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

    const handleDelete = async (addressId: string) => {
        try {
            const result = await deleteAddress(addressId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Address deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Addresses</h3>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <AddressForm onSuccess={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/50">
                    <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No addresses saved yet</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="relative flex flex-col justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                            <div className="space-y-1 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{address.street}</span>
                                    {address.isDefault && (
                                        <Badge variant="secondary" className="text-xs">
                                            Default
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>{address.city}, {address.state} {address.zipCode}</p>
                                    <p>{address.country}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Dialog
                                    open={editingAddress?._id === address._id}
                                    onOpenChange={(open) => !open && setEditingAddress(null)}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() => setEditingAddress(address)}
                                        >
                                            <Pencil className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Address</DialogTitle>
                                        </DialogHeader>
                                        <AddressForm
                                            address={address}
                                            onSuccess={() => setEditingAddress(null)}
                                        />
                                    </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-3 w-3" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this address? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => address._id && handleDelete(address._id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
