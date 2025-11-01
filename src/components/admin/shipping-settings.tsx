/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Save, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { CURRENCY } from "@/constants";

interface ShippingMethod {
  name: string;
  description: string;
  price: number;
  deliveryTime: string;
  enabled: boolean;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  defaultShippingMethod: string;
  shippingMethods: ShippingMethod[];
  taxRate: number;
}

export function ShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(
    null
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/shipping-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error("Failed to fetch settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load shipping settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/shipping-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Shipping settings updated successfully");
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update shipping settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addShippingMethod = () => {
    if (!settings) return;

    const newMethod: ShippingMethod = {
      name: "",
      description: "",
      price: 0,
      deliveryTime: "",
      enabled: true,
    };

    setSettings({
      ...settings,
      shippingMethods: [...settings.shippingMethods, newMethod],
    });
    setEditingMethod(newMethod);
  };

  const updateShippingMethod = (
    index: number,
    field: keyof ShippingMethod,
    value: any
  ) => {
    if (!settings) return;

    const updatedMethods = [...settings.shippingMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value,
    };

    setSettings({
      ...settings,
      shippingMethods: updatedMethods,
    });
  };

  const removeShippingMethod = (index: number) => {
    if (!settings) return;

    const updatedMethods = settings.shippingMethods.filter(
      (_, i) => i !== index
    );
    setSettings({
      ...settings,
      shippingMethods: updatedMethods,
    });
  };

  if (isLoading) {
    return <div>Loading shipping settings...</div>;
  }

  if (!settings) {
    return <div>Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Configuration</CardTitle>
          <CardDescription>
            Configure free shipping threshold, tax rates, and shipping methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Free Shipping Threshold */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">
                Free Shipping Threshold ({CURRENCY.SYMBOL})
              </Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                placeholder="500"
              />
              <p className="text-sm text-muted-foreground">
                Orders above this amount qualify for free shipping
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxRate: Number(e.target.value),
                  })
                }
                placeholder="18"
              />
              <p className="text-sm text-muted-foreground">
                GST or sales tax rate in percentage
              </p>
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Shipping Methods</Label>
              <Button onClick={addShippingMethod} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price ({CURRENCY.SYMBOL})</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.shippingMethods.map((method, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={method.name}
                        onChange={(e) =>
                          updateShippingMethod(index, "name", e.target.value)
                        }
                        placeholder="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={method.description}
                        onChange={(e) =>
                          updateShippingMethod(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Standard Shipping"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={method.price}
                        onChange={(e) =>
                          updateShippingMethod(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        placeholder="50"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={method.deliveryTime}
                        onChange={(e) =>
                          updateShippingMethod(
                            index,
                            "deliveryTime",
                            e.target.value
                          )
                        }
                        placeholder="3-5 business days"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={method.enabled}
                        onCheckedChange={(checked) =>
                          updateShippingMethod(index, "enabled", checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeShippingMethod(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
