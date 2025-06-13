"use client";

import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";

interface MediaPlanData {
  [key: string]: any;
}

interface FileUploadProps {
  onDataUpload: (data: MediaPlanData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error("Nenhum dado encontrado no arquivo.");
      }

      const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

      const requiredFields = ["CAMPANHA", "PRACA", "MEIO", "VEICULO", "MES"];

      const normalizedData = jsonData.map((registro: any) => {
        const novoRegistro: any = {};
        Object.keys(registro).forEach(chaveOriginal => {
          const chaveLimpa = normalize(chaveOriginal);
          novoRegistro[chaveLimpa] = registro[chaveOriginal];
        });
        return novoRegistro;
      });

      const firstRecord = normalizedData[0];
      const missingFields = requiredFields.filter(field => !(field in firstRecord));

      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(", ")}`);
      }

      onDataUpload(normalizedData as MediaPlanData[]);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      alert(error instanceof Error ? error.message : "Erro ao processar o arquivo.");
    } finally {
      setIsProcessing(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file =>
      file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    );

    if (!excelFile) {
      alert("Por favor, envie um arquivo .xlsx ou .xls");
      return;
    }

    processFile(excelFile);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-md p-8 text-center transition-all ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setIsDragOver(false);
        }}
      >
        <div className="text-4xl mb-2">{isProcessing ? "⏳" : "📤"}</div>
        <h3 className="text-lg font-semibold mb-2">
          {isProcessing ? "Processando arquivo..." : "Solte seu arquivo Excel aqui"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {isProcessing
            ? "Aguarde enquanto processamos seus dados"
            : "ou clique para selecionar manualmente"}
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label htmlFor="file-upload">
          <button
            disabled={isProcessing}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50 text-sm"
          >
            📄 Selecionar arquivo
          </button>
        </label>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm flex items-start gap-2">
        <div className="text-xl mt-0.5">⚠️</div>
        <div>
          <h4 className="font-medium text-yellow-800 mb-1">Requisitos do Arquivo</h4>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>✓ Arquivo Excel (.xlsx ou .xls)</li>
            <li>✓ Primeira aba da planilha será usada</li>
            <li>✓ Campos obrigatórios: CAMPANHA, PRACA, MEIO, VEICULO, MES</li>
            <li>✓ Letras maiúsculas ou acentos não causam problema</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
