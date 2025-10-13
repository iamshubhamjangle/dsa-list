"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QUESTION_TEMPLATES } from "@/lib/templates";
import { CheckCircle2 } from "lucide-react";

const TemplateImport = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleImportTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    const template = QUESTION_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) {
      toast.error("Template not found");
      return;
    }

    setIsImporting(true);
    toast.loading(`Importing ${template.name}...`, {
      id: "template-import",
    });

    try {
      const response = await fetch("/api/templates/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId: selectedTemplate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to import template");
      }

      toast.success(data.message, {
        id: "template-import",
      });

      // Refresh questions and tags list
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error importing template:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import template",
        {
          id: "template-import",
        }
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Template Selection */}
      <div className="w-full space-y-3">
        <h3 className="text-sm font-medium text-center">
          Choose a template to get started
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {QUESTION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              disabled={isImporting}
              className={`relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {/* Selected Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              )}

              {/* Template Info */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{template.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {template.questionCount} questions
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Import Button */}
      <Button
        onClick={handleImportTemplate}
        disabled={!selectedTemplate || isImporting}
        className="w-full max-w-xs"
        size="lg"
      >
        {isImporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Import{" "}
            {selectedTemplate
              ? QUESTION_TEMPLATES.find((t) => t.id === selectedTemplate)?.name
              : "Template"}
          </>
        )}
      </Button>
    </div>
  );
};

export default TemplateImport;
