import Header from "@/components/manage/header";
import Questions from "@/components/manage/questions";
import Tags from "@/components/manage/tags";

export default function ManagePage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Header />

      {/* Sample Questions Download Link */}
      <div className="flex justify-end">
        <a
          href="/sample_questions.xlsx"
          download
          className="text-muted-foreground text-xs hover:underline"
        >
          Getting Started? Download Sample Questions .xlsx
        </a>
      </div>

      {/* Tags Section */}
      <Tags />

      {/* Questions Section */}
      <Questions />
    </div>
  );
}
