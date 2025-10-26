"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";

interface Specification {
  key: string;
  value: string;
}

interface DynamicSpecificationsProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
}

export function DynamicSpecifications({
  specifications,
  onChange,
}: DynamicSpecificationsProps) {
  const [localSpecs, setLocalSpecs] = useState<Specification[]>(
    specifications.length > 0 ? specifications : [{ key: "", value: "" }]
  );

  const addSpecification = () => {
    const newSpecs = [...localSpecs, { key: "", value: "" }];
    setLocalSpecs(newSpecs);
    onChange(newSpecs.filter((spec) => spec.key.trim() && spec.value.trim()));
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newSpecs = localSpecs.map((spec, i) =>
      i === index ? { ...spec, [field]: newValue } : spec
    );
    setLocalSpecs(newSpecs);

    // Only call onChange with valid specifications
    const validSpecs = newSpecs.filter(
      (spec) => spec.key.trim() && spec.value.trim()
    );
    onChange(validSpecs);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = localSpecs.filter((_, i) => i !== index);
    setLocalSpecs(newSpecs.length > 0 ? newSpecs : [{ key: "", value: "" }]);
    onChange(newSpecs.filter((spec) => spec.key.trim() && spec.value.trim()));
  };

  return (
    <div className="space-y-4">
      <Label>Specifications</Label>

      <div className="space-y-3">
        {localSpecs.map((spec, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-2 items-start group"
          >
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-3" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full">
                <Input
                  placeholder="Specification name (e.g., Weight)"
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecification(index, "key", e.target.value)
                  }
                  className="text-sm"
                />
                <Input
                  placeholder="Specification value (e.g., 1.5kg)"
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecification(index, "value", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {localSpecs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpecification(index)}
                className="h-9 w-9 p-0 flex-shrink-0 mt-1 sm:mt-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addSpecification}
        className="w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Specification
      </Button>

      <p className="text-xs text-muted-foreground">
        Add product specifications. Empty rows will be automatically filtered
        out.
      </p>
    </div>
  );
}
