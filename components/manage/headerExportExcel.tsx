"use client";

import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

const HeaderExportExcel = () => {
  const handleExportQuestionsExcel = () => {
    console.log("Exporting questions Excel");
  };

  return (
    <Button
      onClick={handleExportQuestionsExcel}
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Download className="h-4 w-4" />
      <span>Export</span>
    </Button>
  );
};

export default HeaderExportExcel;
