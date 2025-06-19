"use client";
import { useEffect, useState } from "react";
import { ModelGrid } from "@/components/model-grid"; // adjust import as needed

export function ModelGridWithDb({ manualModels, onModelClick }: { manualModels: any[], onModelClick: (model: any) => void }) {
  const [dbModels, setDbModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbModels = async () => {
      try {
        const res = await fetch("/api/product/list");
        const data = await res.json();
        setDbModels(data.products || []);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDbModels();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a skeleton loader or any placeholder
  }

  const combinedModels = [...manualModels, ...dbModels];

  return (
    <ModelGrid
      title="Models"
      models={combinedModels}
      onModelClick={onModelClick}
    />
  );
}