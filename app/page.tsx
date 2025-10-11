import { Progress } from "@/components/home/progress";
import Questions from "@/components/home/questions";
import { Header } from "@/components/home/header";

export default async function App() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Header />
      <Progress />
      <Questions />
    </div>
  );
}
