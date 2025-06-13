"use client";
import { FileUpload } from "@/components/FileUpload";

export type MediaPlanData = {
  [key: string]: any;
};

export default function Home() {
  const handleDataUpload = (data: MediaPlanData[]) => {
    console.log("Arquivo processado:", data);
    alert("Arquivo processado com sucesso!");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Upload de Planejamento</h1>
      <FileUpload onDataUpload={handleDataUpload} />
    </main>
  );
}
