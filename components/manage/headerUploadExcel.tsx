"use client";

import { toast } from "sonner";
import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, XCircle, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  batchUploadQuestionsApi,
  BatchQuestionInput,
  BatchUploadResult,
  createTagApi,
} from "@/lib/api";

const MAX_QUESTIONS_PER_BATCH = 100;
const MAX_TOTAL_QUESTIONS = 500;

interface UploadLog {
  type: "success" | "error" | "info";
  message: string;
  rowNumber?: number;
}

const HeaderUploadExcel = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    processed: 0,
    successful: 0,
    failed: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const addLog = (log: UploadLog) => {
    setUploadLogs((prev) => [...prev, log]);
  };

  const parseExcelFile = async (
    file: File
  ): Promise<{
    questions: BatchQuestionInput[];
    tags: Array<{ name: string; color: string; description?: string }>;
  } | null> => {
    try {
      // Dynamically import XLSX
      const XLSX = await import("xlsx");

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // Get Questions sheet
      const questionsSheet = workbook.Sheets["Questions"];
      if (!questionsSheet) {
        toast.error('Excel file must contain a "Questions" sheet');
        return null;
      }

      // Get Tags sheet (optional)
      const tagsSheet = workbook.Sheets["Tags"];
      const tagsData: Array<{
        name: string;
        color: string;
        description?: string;
      }> = [];

      if (tagsSheet) {
        const jsonTags = XLSX.utils.sheet_to_json<{
          name?: string;
          color?: string;
          description?: string;
        }>(tagsSheet);

        jsonTags.forEach((row) => {
          if (row.name && row.color) {
            tagsData.push({
              name: row.name.trim(),
              color: row.color.trim(),
              description: row.description?.trim(),
            });
          }
        });
      }

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json<{
        name?: string;
        url?: string;
        difficulty?: string;
        completed?: boolean | string;
        starred?: boolean | string;
        tags?: string;
      }>(questionsSheet);

      if (jsonData.length === 0) {
        toast.error("No questions found in the Excel file");
        return null;
      }

      // Validate and transform data
      const questions: BatchQuestionInput[] = jsonData.map((row, index) => {
        // Parse tags (comma-separated)
        const tags =
          row.tags
            ?.split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0) || [];

        // Parse boolean values (Excel might read them as strings)
        const completed =
          typeof row.completed === "boolean"
            ? row.completed
            : row.completed === "true" || row.completed === "TRUE";

        const starred =
          typeof row.starred === "boolean"
            ? row.starred
            : row.starred === "true" || row.starred === "TRUE";

        return {
          name: row.name || "",
          url: row.url || "",
          difficulty:
            (row.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
          completed,
          starred,
          tags,
          rowNumber: index + 2, // +2 because Excel row 1 is header, and array is 0-indexed
        };
      });

      return { questions, tags: tagsData };
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast.error("Failed to parse Excel file");
      return null;
    }
  };

  const validateQuestions = (
    questions: BatchQuestionInput[]
  ): { valid: BatchQuestionInput[]; invalid: number } => {
    const validQuestions: BatchQuestionInput[] = [];
    let invalidCount = 0;

    for (const question of questions) {
      // Client-side validation
      if (!question.name || !question.url || !question.difficulty) {
        addLog({
          type: "error",
          message: `Row ${question.rowNumber}: Missing required fields`,
          rowNumber: question.rowNumber,
        });
        invalidCount++;
        continue;
      }

      if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) {
        addLog({
          type: "error",
          message: `Row ${question.rowNumber} (${question.name}): Invalid difficulty "${question.difficulty}"`,
          rowNumber: question.rowNumber,
        });
        invalidCount++;
        continue;
      }

      validQuestions.push(question);
    }

    return { valid: validQuestions, invalid: invalidCount };
  };

  const processBatch = async (
    batch: BatchQuestionInput[],
    batchNumber: number,
    totalBatches: number
  ): Promise<BatchUploadResult> => {
    addLog({
      type: "info",
      message: `Processing batch ${batchNumber}/${totalBatches} (${batch.length} questions)...`,
    });

    const result = await batchUploadQuestionsApi(batch);

    // Log errors from this batch
    if (result.errors.length > 0) {
      result.errors.forEach((error) => {
        addLog({
          type: "error",
          message: `Row ${error.rowNumber} (${error.name}): ${error.error}`,
          rowNumber: error.rowNumber,
        });
      });
    }

    addLog({
      type: "success",
      message: `Batch ${batchNumber} complete: ${result.successCount} uploaded, ${result.errorCount} failed`,
    });

    return result;
  };

  const handleFileUploadExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Initialize state
    setIsProcessing(true);
    setShowProgressDialog(true);
    setUploadLogs([]);
    setProgress(0);
    setStats({
      totalQuestions: 0,
      processed: 0,
      successful: 0,
      failed: 0,
    });

    addLog({ type: "info", message: "Reading Excel file..." });

    try {
      // Parse Excel file
      const parsed = await parseExcelFile(file);
      if (!parsed) {
        setIsProcessing(false);
        return;
      }

      const { questions: parsedQuestions, tags: parsedTags } = parsed;

      addLog({
        type: "info",
        message: `Found ${parsedQuestions.length} questions and ${parsedTags.length} tags in Excel file`,
      });

      // Process tags first (if any)
      if (parsedTags.length > 0) {
        addLog({
          type: "info",
          message: `Creating ${parsedTags.length} tag(s)...`,
        });

        let tagsCreated = 0;
        let tagsSkipped = 0;

        for (const tag of parsedTags) {
          try {
            await createTagApi(tag);
            tagsCreated++;
            addLog({
              type: "success",
              message: `Tag "${tag.name}" created successfully`,
            });
          } catch (error) {
            tagsSkipped++;
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            // Skip if tag already exists
            if (errorMessage.includes("already exists")) {
              addLog({
                type: "info",
                message: `Tag "${tag.name}" already exists, skipping`,
              });
            } else {
              addLog({
                type: "error",
                message: `Failed to create tag "${tag.name}": ${errorMessage}`,
              });
            }
          }
        }

        addLog({
          type: "success",
          message: `Tags processed: ${tagsCreated} created, ${tagsSkipped} skipped`,
        });

        // Refresh tags cache
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      }

      // Check total questions limit
      if (parsedQuestions.length > MAX_TOTAL_QUESTIONS) {
        addLog({
          type: "error",
          message: `Too many questions. Maximum ${MAX_TOTAL_QUESTIONS} questions allowed. Found ${parsedQuestions.length}.`,
        });
        toast.error(
          `Maximum ${MAX_TOTAL_QUESTIONS} questions allowed per upload`
        );
        setIsProcessing(false);
        return;
      }

      // Validate questions
      addLog({ type: "info", message: "Validating questions..." });
      const { valid: validQuestions, invalid: invalidCount } =
        validateQuestions(parsedQuestions);

      if (validQuestions.length === 0) {
        addLog({
          type: "error",
          message: "No valid questions to upload",
        });
        toast.error("No valid questions found");
        setIsProcessing(false);
        return;
      }

      addLog({
        type: "info",
        message: `${validQuestions.length} valid questions, ${invalidCount} invalid`,
      });

      setStats((prev) => ({
        ...prev,
        totalQuestions: validQuestions.length,
        failed: invalidCount,
      }));

      // Split into batches
      const batches: BatchQuestionInput[][] = [];
      for (let i = 0; i < validQuestions.length; i += MAX_QUESTIONS_PER_BATCH) {
        batches.push(validQuestions.slice(i, i + MAX_QUESTIONS_PER_BATCH));
      }

      addLog({
        type: "info",
        message: `Uploading in ${batches.length} batch(es)...`,
      });

      // Process batches sequentially
      let totalSuccessful = 0;
      let totalFailed = invalidCount;

      for (let i = 0; i < batches.length; i++) {
        try {
          const result = await processBatch(batches[i], i + 1, batches.length);
          totalSuccessful += result.successCount;
          totalFailed += result.errorCount;

          setStats((prev) => ({
            ...prev,
            processed: prev.processed + result.totalProcessed,
            successful: totalSuccessful,
            failed: totalFailed,
          }));

          setProgress(Math.round(((i + 1) / batches.length) * 100));
        } catch (error) {
          addLog({
            type: "error",
            message: `Batch ${i + 1} failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
          // Don't stop on batch error, continue with remaining batches
        }
      }

      // Final summary
      addLog({
        type: "info",
        message: `✅ Upload complete! ${totalSuccessful} successful, ${totalFailed} failed`,
      });

      toast.success(
        `Uploaded ${totalSuccessful} question(s) successfully${
          totalFailed > 0 ? `. ${totalFailed} failed.` : ""
        }`
      );

      // Refresh questions list
      queryClient.invalidateQueries({ queryKey: ["questions", "tags"] });
    } catch (error) {
      console.error("Error uploading Excel:", error);
      addLog({
        type: "error",
        message: `Fatal error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      toast.error("Failed to process Excel file");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  return (
    <>
      <Button
        asChild
        variant="default"
        className="flex items-center space-x-2"
        disabled={isProcessing}
      >
        <label className="cursor-pointer">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUploadExcel}
            className="hidden"
            disabled={isProcessing}
          />
        </label>
      </Button>

      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Upload Progress</span>
            </DialogTitle>
            <DialogDescription>
              Processing questions from Excel file
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 flex-1 min-h-0">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isProcessing ? "Processing..." : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.successful}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.failed}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {/* Logs */}
            <div className="flex flex-col space-y-2 flex-1 min-h-0">
              <h4 className="text-sm font-medium">Logs</h4>
              <div className="flex-1 min-h-0 w-full border rounded-md p-4 overflow-y-auto">
                <div className="space-y-2">
                  {uploadLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        log.type === "error"
                          ? "text-red-600"
                          : log.type === "success"
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {log.type === "success" && (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {log.type === "error" && (
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {log.type === "info" && (
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="break-words">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowProgressDialog(false)}
                disabled={isProcessing}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeaderUploadExcel;
