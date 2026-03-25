import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // KIE AI Video Generation Proxy
  app.post("/api/video/generate", async (req, res) => {
    try {
      const { prompt, model, imageUrls, aspect_ratio, generationType } = req.body;
      const apiKey = process.env.KIE_API_KEY || "3f3ded9dd74cc922092724e79359fc23";
      
      const payload: any = {
        prompt: prompt,
        model: model || "veo3_fast",
        aspect_ratio: aspect_ratio || "16:9",
        enableTranslation: true
      };

      if (imageUrls && imageUrls.length > 0) {
        payload.imageUrls = imageUrls;
      }
      if (generationType) {
        payload.generationType = generationType;
      }

      const response = await fetch("https://api.kie.ai/api/v1/veo/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("KIE API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // KIE AI Kling Video Generation Proxy
  app.post("/api/video/kling/generate", async (req, res) => {
    try {
      const { prompt, image_url, duration, negative_prompt, cfg_scale } = req.body;
      const apiKey = process.env.KIE_API_KEY || "3f3ded9dd74cc922092724e79359fc23";
      
      const payload: any = {
        model: "kling/v2-1-master-image-to-video",
        input: {
          prompt: prompt,
          image_url: image_url,
          duration: duration || "5",
          negative_prompt: negative_prompt || "blur, distort, and low quality",
          cfg_scale: cfg_scale || 0.5
        }
      };

      const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("KIE API Kling Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // KIE AI Sora2 Video Generation Proxy
  app.post("/api/video/sora/generate", async (req, res) => {
    try {
      const { prompt, image_urls, aspect_ratio, n_frames, remove_watermark } = req.body;
      const apiKey = process.env.KIE_API_KEY || "3f3ded9dd74cc922092724e79359fc23";
      
      const payload: any = {
        model: "sora-2-image-to-video",
        input: {
          prompt: prompt,
          image_urls: image_urls,
          aspect_ratio: aspect_ratio || "landscape",
          n_frames: n_frames || "10",
          remove_watermark: remove_watermark !== undefined ? remove_watermark : true,
          upload_method: "s3"
        }
      };

      const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("KIE API Sora Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // KIE AI Task Polling Proxy
  app.get("/api/video/status/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const apiKey = process.env.KIE_API_KEY || "3f3ded9dd74cc922092724e79359fc23";
      
      // Based on KIE AI docs, the unified query endpoint is used for all models
      const response = await fetch(`https://api.kie.ai/api/v1/jobs/getTaskDetail?taskId=${taskId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("KIE API Status Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // KIE AI Webhook Callback Handler
  app.post("/api/video/callback", (req, res) => {
    // In a real production environment, you would verify the webhook signature here
    // and update your database with the final video URL.
    console.log("Received KIE AI Webhook Callback:", req.body);
    res.status(200).json({ received: true });
  });

  // Text Generation Fallback Proxy (NVIDIA API)
  app.post("/api/text/fallback", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;

      const fallbacks = [
        {
          model: "deepseek-ai/deepseek-v3.2",
          key: "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",
          extra: { chat_template_kwargs: { thinking: true } }
        },
        {
          model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
          key: "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",
          extra: {}
        },
        {
          model: "qwen/qwen3.5-122b-a10b",
          key: "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",
          extra: { chat_template_kwargs: { enable_thinking: true } }
        },
        {
          model: "moonshotai/kimi-k2.5",
          key: "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",
          extra: { chat_template_kwargs: { thinking: true } }
        }
      ];

      let lastError = null;

      for (const fb of fallbacks) {
        try {
          console.log(`Attempting fallback with model: ${fb.model}`);
          
          const messages = [];
          if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
          }
          messages.push({ role: "user", content: prompt });

          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${fb.key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: fb.model,
              messages: messages,
              max_tokens: 16384,
              temperature: 0.6,
              top_p: 0.95,
              ...fb.extra
            })
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`Fallback ${fb.model} failed:`, errText);
            lastError = new Error(`Model ${fb.model} failed with status ${response.status}`);
            continue;
          }

          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          
          if (text) {
            console.log(`Successfully generated text with ${fb.model}`);
            return res.json({ text, model: fb.model });
          }
        } catch (err: any) {
          console.error(`Error with fallback ${fb.model}:`, err);
          lastError = err;
        }
      }

      throw lastError || new Error("All fallback models failed.");
    } catch (error: any) {
      console.error("All text fallbacks failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
