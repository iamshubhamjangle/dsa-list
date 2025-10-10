"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const HeaderUploadExcel = () => {
  const handleFileUploadExcel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log(file);
  };

  return (
    <Button asChild variant="default" className="flex items-center space-x-2">
      <label className="cursor-pointer">
        <Upload className="h-4 w-4" />
        <span>Upload Excel File</span>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUploadExcel}
          className="hidden"
        />
      </label>
    </Button>
  );
};

export default HeaderUploadExcel;
