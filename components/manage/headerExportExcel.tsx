"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsApi, fetchTagsApi } from "@/lib/api";
import { toast } from "sonner";

const HeaderExportExcel = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Fetch questions and tags - will use cached data if available
  const { data: questions } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestionsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTagsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  const handleExportQuestionsExcel = async () => {
    if (!questions || !tags) {
      toast.error("No data available to export");
      return;
    }

    setIsExporting(true);

    try {
      // Dynamically import XLSX library
      const XLSX = await import("xlsx");

      // Prepare questions sheet data
      const questionsSheet = [
        ["name", "url", "difficulty", "completed", "starred", "tags"],
        ...questions.map((q) => [
          q.name,
          q.url,
          q.difficulty,
          q.completed ?? false,
          q.starred ?? false,
          q.tags.map((t) => t.name).join(","),
        ]),
      ];

      // Prepare tags sheet data
      const tagsSheet = [
        ["name", "color"],
        ...tags.map((t) => [t.name, t.color]),
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const wsQuestions = XLSX.utils.aoa_to_sheet(questionsSheet);
      const wsTags = XLSX.utils.aoa_to_sheet(tagsSheet);
      XLSX.utils.book_append_sheet(wb, wsQuestions, "Questions");
      XLSX.utils.book_append_sheet(wb, wsTags, "Tags");

      // Export to file
      XLSX.writeFile(wb, "questions_and_tags.xlsx");
      toast.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportQuestionsExcel}
      variant="outline"
      className="flex items-center space-x-2"
      disabled={isExporting || !questions || !tags}
    >
      <Download className="h-4 w-4" />
      <span>{isExporting ? "Exporting..." : "Export"}</span>
    </Button>
  );
};

export default HeaderExportExcel;
