"use client";

import React, { Suspense, lazy } from "react";
import HeaderAddQuestion from "./headerAddQuestion";
import HeaderAddTag from "./headerAddTag";
import HeaderUploadExcel from "./headerUploadExcel";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

// Lazy load the HeaderExportExcel component
const HeaderExportExcel = lazy(() => import("./headerExportExcel"));

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Manage Problems</h1>
      <div className="flex space-x-3">
        {/* Add Question Dialog */}
        <HeaderAddQuestion />

        {/* Add Tag Dialog */}
        <HeaderAddTag />

        {/* Upload Excel File */}
        <HeaderUploadExcel />

        {/* Export Excel File - Lazy loaded */}
        <Suspense
          fallback={
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              disabled
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          }
        >
          <HeaderExportExcel />
        </Suspense>
      </div>
    </div>
  );
};

export default Header;
