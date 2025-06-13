"use client";
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";

export type MediaPlanData = {
  [key: string]: any;
};

export default function Home() {
  const [planData, setPlanData] = useState<MediaPlanData[] | null>(null);

  const handleDataUpload = (data: MediaPlanData[]) => {
    setPlanData(data); // guarda os dados
    alert("Arquivo processado com sucesso!");
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Upload de Planejamento</h1>

      <FileUpload onDataUpload={handleDataUpload} />

      {planData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Prévia dos dados</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(planData[0]).map((coluna, idx) => (
                  <th key={idx} className="border px-2 py-1 text-left">{coluna}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planData.slice(0, 5).map((linha, i) => (
                <tr key={i} className="border-t">
                  {Object.values(linha).map((valor, j) => (
                    <td key={j} className="px-2 py-1 border">{valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Mostrando as 5 primeiras linhas.
          </p>
        </div>
      )}
    </main>
  );
}
