"use client";

import { useState, useEffect } from "react";
import { Question, Tag, StudyOptions } from "@/lib/types";
import {
  getQuestions,
  getTags,
  getProgress,
  saveProgress,
  getStudyOptions,
  saveStudyOptions,
} from "@/lib/storage";
import { Header } from "@/components/home/header";
import { Progress } from "@/components/home/progress";
import Questions from "@/components/home/questions";

export default function App() {
  useEffect(() => {}, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* <Header /> */}

      {/* <Progress questions={} progress={} /> */}

      <Questions />
    </div>
  );
}
