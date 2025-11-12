import { useState, useEffect, useCallback } from "react";

import { toast } from "sonner";

import type { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById, SaveUpdateCode } from "../actions";

interface PlaygroundData {
  id: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
    null
  );
  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayground = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPlaygroundById(id);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPlaygroundData(data);
      const rawContent = data?.templateFile?.[0]?.content;
      if (typeof rawContent === "string") {
        const parsedContent = JSON.parse(rawContent);
        setTemplateData(parsedContent);
        toast.success("Playground loaded successfully");
        return;
      }

      //load template from api if not in save content
      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) throw new Error(`Failed to load template: ${res.status}`);
      const templateRes = await res.json();

      if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
        setTemplateData({
          folderName: "Root",
          items: templateRes.templateJson,
        });
      } else {
        setTemplateData(
          templateRes.templateJson || {
            folderName: "Root",
            items: [],
          }
        );
      }
      toast.success("Template loaded successfully");
    } catch (err) {
      console.log(err);
      setError("Failed to load playground");
      toast.error("Failed to load playground");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(async (data: TemplateFolder) => {
    if (!id) return;
    try {
      await SaveUpdateCode(id,data)
      setTemplateData(data);
      toast.success("Template data saved successfully");
    }catch(err){
      setError("Failed to save template data");
      toast.error("Failed to save template data");
      throw err;
    }
  },  [id]);
  useEffect(() => {
    loadPlayground();
  }, [loadPlayground]);

  return {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  };
};
