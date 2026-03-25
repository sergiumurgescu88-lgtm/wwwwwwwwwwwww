import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Loader2, Image as ImageIcon, Download, Key, Sparkles, AlertCircle, Video, FileText, Copy, CheckCircle2, Search, MessageSquare, Users, MapPin, Mail, BarChart, Network, CalendarDays, MessageCircle, ListChecks } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const PROJECTS_DATA = {
  "Restaurante": [
    "MrDelivery Central", "AI Chatbot Clienti Restaurant", "Instant Menu Photos", "Laborator Texte Restaurant", "Audit AI Restaurant", "Review Manager Google+Facebook", "WhatsAll Bot Restaurante", "Social Content Restaurant", "Delivery Commission Analyzer", "Menu Translation Pro", "Restaurant SEO Pack", "QR Menu Digital", "Loyalty Program AI", "Staff Scheduling AI", "Food Cost Calculator"
  ],
  "Imobiliare": [
    "SocietyHUB CRM PRO", "AI Matching Proprietati", "Multi-portal Publisher", "LeadGenius Imobiliar", "Contract Generator", "Property Description AI", "Market Price Analyzer", "Virtual Tour Creator", "Client Follow-up Bot", "Investment ROI Calculator"
  ],
  "Energie": [
    "Helios Calculator", "Smart Helios Planner", "Energy Dashboard Monitor", "Audit Energie AI", "Green Investment Advisor"
  ],
  "Operatiuni": [
    "Automation Hub", "Process Optimizer AI", "Task Manager AI", "Team Sync Bot", "KPI Dashboard Live"
  ],
  "Afaceri": [
    "VentureAI", "Business Plan Generator", "Pitch Deck Creator", "Financial Forecast AI", "Competitor Intelligence"
  ],
  "Securitate": [
    "CyberIntel Hub", "Data Privacy Checker GDPR"
  ],
  "Lifestyle": [
    "LifeOS AI", "Velvet & Rose", "Aura AI", "MuseFlow", "Heart Echo", "Creator Studio Lifestyle"
  ],
  "Unelte AI": [
    "SSociety AI Studio", "SSociety Studio", "SSociety PromptLab", "SSociety Agents", "BetSentiment AI", "Trading Bots Dashboard", "MB EuroParts", "SSociety VIEW", "WhatsAll Bot Universal", "Alex Mercedes Platform"
  ],
  "Marketing": [
    "AdFusion AI", "Viral Architect", "One Image Ad Engine", "LeadGenius Universal", "SEO Mastermind", "Mega SEO Audit Pro"
  ],
  "Extra": [
    "WhatsAll Bot", "SSociety JOIN", "SSociety LIVE", "Botato Integration", "Brevo Email System", "Wati.io WhatsApp System", "SSociety Skool Community"
  ]
};

export const generateTextWithFallback = async (prompt: string, model: string, config?: any) => {
  try {
    // @ts-ignore
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });
    return { text: response.text, response };
  } catch (error: any) {
    console.warn(`Gemini API error (${model}), switching to NVIDIA fallback models...`, error);
    const res = await fetch('/api/text/fallback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Toate modelele (inclusiv fallback) au eșuat.");
    }
    const data = await res.json();
    return { text: data.text, response: null };
  }
};

export default function App() {
  const [hasKey, setHasKey] = useState(true);
  const [category, setCategory] = useState('Restaurante');
  const [projectName, setProjectName] = useState(PROJECTS_DATA['Restaurante'][0]);
  const [isCustomProject, setIsCustomProject] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [projectUrl, setProjectUrl] = useState('mrdelivery.ro');
  const [city, setCity] = useState('Cluj-Napoca');
  const [googleRating, setGoogleRating] = useState('');
  
  // Recap State
  const [activeProjects, setActiveProjects] = useState('15');
  const [publishedContent, setPublishedContent] = useState('42');
  const [capturedLeads, setCapturedLeads] = useState('128');
  const [demoCalls, setDemoCalls] = useState('14');
  const [newClients, setNewClients] = useState('3');
  const [currentMrr, setCurrentMrr] = useState('€12.450');

  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);
  const [recapError, setRecapError] = useState<string | null>(null);
  const [recapContent, setRecapContent] = useState<string | null>(null);
  const [isCopiedRecap, setIsCopiedRecap] = useState(false);

  // Script State
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // SEO State
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [seoContent, setSeoContent] = useState<string | null>(null);
  const [isCopiedSeo, setIsCopiedSeo] = useState(false);

  // SEO Analysis State
  const [isGeneratingSeoAnalysis, setIsGeneratingSeoAnalysis] = useState(false);
  const [seoAnalysisError, setSeoAnalysisError] = useState<string | null>(null);
  const [seoAnalysisContent, setSeoAnalysisContent] = useState<string | null>(null);
  const [isCopiedSeoAnalysis, setIsCopiedSeoAnalysis] = useState(false);

  // Copy State
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copyContent, setCopyContent] = useState<string | null>(null);
  const [isCopiedCopy, setIsCopiedCopy] = useState(false);
  const [mainHook, setMainHook] = useState('');

  // Audience State
  const [isGeneratingAudience, setIsGeneratingAudience] = useState(false);
  const [audienceError, setAudienceError] = useState<string | null>(null);
  const [audienceContent, setAudienceContent] = useState<string | null>(null);
  const [isCopiedAudience, setIsCopiedAudience] = useState(false);

  // Email State
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailContent, setEmailContent] = useState<string | null>(null);
  const [isCopiedEmail, setIsCopiedEmail] = useState(false);

  // WhatsApp State
  const [isGeneratingWhatsapp, setIsGeneratingWhatsapp] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [whatsappContent, setWhatsappContent] = useState<string | null>(null);
  const [isCopiedWhatsapp, setIsCopiedWhatsapp] = useState(false);

  // Audit State
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditContent, setAuditContent] = useState<string | null>(null);
  const [isCopiedAudit, setIsCopiedAudit] = useState(false);

  // Funnel State
  const [isGeneratingFunnel, setIsGeneratingFunnel] = useState(false);
  const [funnelError, setFunnelError] = useState<string | null>(null);
  const [funnelContent, setFunnelContent] = useState<string | null>(null);
  const [isCopiedFunnel, setIsCopiedFunnel] = useState(false);

  // Image State
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [images, setImages] = useState<{
    segments: { id: string; url: string }[];
    thumbnail: string | null;
    social: string | null;
  }>({
    segments: [],
    thumbnail: null,
    social: null,
  });

  // Audio State
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speaker1Voice, setSpeaker1Voice] = useState('Zephyr');
  const [speaker2Voice, setSpeaker2Voice] = useState('Kore');

  // Assembly State
  const [isGeneratingAssembly, setIsGeneratingAssembly] = useState(false);
  const [assemblyError, setAssemblyError] = useState<string | null>(null);
  const [assemblyContent, setAssemblyContent] = useState<string | null>(null);
  const [isCopiedAssembly, setIsCopiedAssembly] = useState(false);

  const [mobileTab, setMobileTab] = useState<'settings' | 'results'>('settings');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleCopyScript = () => {
    if (scriptContent) {
      navigator.clipboard.writeText(scriptContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopySeo = () => {
    if (seoContent) {
      navigator.clipboard.writeText(seoContent);
      setIsCopiedSeo(true);
      setTimeout(() => setIsCopiedSeo(false), 2000);
    }
  };

  const handleCopySeoAnalysis = () => {
    if (seoAnalysisContent) {
      navigator.clipboard.writeText(seoAnalysisContent);
      setIsCopiedSeoAnalysis(true);
      setTimeout(() => setIsCopiedSeoAnalysis(false), 2000);
    }
  };

  const handleCopySocialCopy = () => {
    if (copyContent) {
      navigator.clipboard.writeText(copyContent);
      setIsCopiedCopy(true);
      setTimeout(() => setIsCopiedCopy(false), 2000);
    }
  };

  const handleCopyAudience = () => {
    if (audienceContent) {
      navigator.clipboard.writeText(audienceContent);
      setIsCopiedAudience(true);
      setTimeout(() => setIsCopiedAudience(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    if (emailContent) {
      navigator.clipboard.writeText(emailContent);
      setIsCopiedEmail(true);
      setTimeout(() => setIsCopiedEmail(false), 2000);
    }
  };

  const handleCopyWhatsapp = () => {
    if (whatsappContent) {
      navigator.clipboard.writeText(whatsappContent);
      setIsCopiedWhatsapp(true);
      setTimeout(() => setIsCopiedWhatsapp(false), 2000);
    }
  };

  const handleCopyAudit = () => {
    if (auditContent) {
      navigator.clipboard.writeText(auditContent);
      setIsCopiedAudit(true);
      setTimeout(() => setIsCopiedAudit(false), 2000);
    }
  };

  const handleCopyFunnel = () => {
    if (funnelContent) {
      navigator.clipboard.writeText(funnelContent);
      setIsCopiedFunnel(true);
      setTimeout(() => setIsCopiedFunnel(false), 2000);
    }
  };

  const handleCopyRecap = () => {
    if (recapContent) {
      navigator.clipboard.writeText(recapContent);
      setIsCopiedRecap(true);
      setTimeout(() => setIsCopiedRecap(false), 2000);
    }
  };

  const handleGenerateScript = async () => {
    if (!projectName || !category || !projectUrl) {
      setScriptError("Te rog completează numele, categoria și URL-ul proiectului.");
      return;
    }

    setIsGeneratingScript(true);
    setScriptError(null);
    setScriptContent(null);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Genereaza script TTS podcast CU ANALIZA VIZUALA COMPLETA pentru: ${projectName}
Categorie: ${category}
URL: ${projectUrl}

Te rog sa generezi exact in acest format:

SCRIPT:
[00:00-00:03] SERGIU (ton socat): "..."
[00:03-00:07] ALINA (ton curios): "..."
[00:07-00:18] SERGIU (ton serios): "..."
...

TABEL SEGMENTE:
| Nr | Timecode | Durata | Se aude | Imagine | Emotie |
| 1 | 00:00-00:03 | 3s | Hook noapte AI | Restaurant noaptea, ecran telefon cu comanda, lumini albastre | shock |
| 2 | 00:03-00:07 | 4s | Intrebare Alina | Doua persoane la podcast, microfoane, studio modern | curiozitate |
...

TOTAL: X segmente, X imagini, X secunde

Reguli:
- Scriptul trebuie sa aiba in jur de 60 de secunde.
- Imparte in segmente logice de 3-10 secunde.
- Tabelul trebuie sa contina toate segmentele.
- Tonul lui Sergiu: direct, antreprenorial, axat pe rezultate.
- Tonul Alinei: curios, pune intrebarile pe care le-ar pune clientul.
- CTA final mereu: ssociety.eu/join`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setScriptContent(text || "Nu s-a putut genera scriptul.");

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setScriptError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setScriptError(err.message || "A apărut o eroare la generarea scriptului.");
      }
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateSeoAnalysis = async () => {
    if (!projectName || !category) {
      setSeoAnalysisError("Te rog completează numele proiectului și categoria.");
      return;
    }

    setIsGeneratingSeoAnalysis(true);
    setSeoAnalysisError(null);
    setSeoAnalysisContent(null);
    setIsCopiedSeoAnalysis(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Analiză SEO completă pentru proiectul: ${projectName}
Categorie: ${category}
Piață: România

Te rog să generezi o analiză SEO detaliată care să includă:
1. Top 10 Keyword-uri principale (cu intenție de căutare și dificultate estimată)
2. 5 Keyword-uri Long-Tail valoroase
3. Structura recomandată pentru site (categorii/pagini principale)
4. 5 idei de articole de blog pentru atragerea traficului organic
5. Recomandări On-Page SEO specifice pentru această nișă`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setSeoAnalysisContent(text || "Nu s-a putut genera analiza SEO.");
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setSeoAnalysisError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setSeoAnalysisError(err.message || "A apărut o eroare la generarea analizei SEO.");
      }
    } finally {
      setIsGeneratingSeoAnalysis(false);
    }
  };

  const handleGenerateSeo = async () => {
    if (!projectName || !category) {
      setSeoError("Te rog completează numele proiectului și categoria.");
      return;
    }

    setIsGeneratingSeo(true);
    setSeoError(null);
    setSeoContent(null);
    setIsCopiedSeo(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `SEO per platforma pentru: ${projectName}, ${category}

Foloseste google pentru trends ${category} Romania.

YOUTUBE: 2 titluri (curiosity + how-to) 60 char, descriere 200 cuv + ssociety.eu/join, 15 tags
TIKTOK/REELS: 3 caption-uri 150 char, 15 hashtags (5 mari, 5 medii, 5 mici)
LINKEDIN: titlu 80 char, post 200 cuv spatii albe, CTA intrebare, 5 hashtags
FACEBOOK: 100 cuv personal + CTA + 5 hashtags
X: 3 tweet-uri 280 char CTA diferit + 3 hashtags
Tabel: platforma, ora optima, frecventa/saptamana`;

      const { text, response } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview', {
        tools: [{ googleSearch: {} }],
      });

      let finalContent = text || "Nu s-a putut genera SEO & Hashtags.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks && chunks.length > 0) {
        finalContent += "\n\n=========================================\nSURSE GOOGLE SEARCH:\n=========================================\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            finalContent += `- ${chunk.web.title}: ${chunk.web.uri}\n`;
          }
        });
      }

      setSeoContent(finalContent);
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error("Error generating SEO:", err);
      if (err.message?.includes("API key not valid")) {
        setHasKey(false);
      } else {
        setSeoError(err.message || "A apărut o eroare la generarea SEO & Hashtags.");
      }
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const handleGenerateCopy = async () => {
    if (!projectName || !category) {
      setCopyError("Te rog completează numele și categoria proiectului.");
      return;
    }

    setIsGeneratingCopy(true);
    setCopyError(null);
    setCopyContent(null);
    setIsCopiedCopy(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Copy gata de postat pentru: ${projectName}, ${category}
Hook: ${mainHook || 'Foloseste un hook puternic specific nisei'}

FACEBOOK: 200 cuv personal, intrebare final, ssociety.eu/join
INSTAGRAM: hook linia 1, 3-4 paragrafe, "Link in bio", 10 hashtags
TIKTOK: 150 char direct, 3 hashtags
YOUTUBE: hook+link primele 2 randuri, 200 cuv, links ${category}
LINKEDIN: profesional+personal, spatii albe, date, intrebare, 300 cuv
X THREAD: 4 tweets (hook → problema → solutia → CTA)
TELEGRAM: preview + blur PRO + CTA Skool

Plus: comentariu pin per platforma`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setCopyContent(text || "Nu s-a putut genera copy-ul.");
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setCopyError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setCopyError(err.message || "A apărut o eroare la generarea copy-ului.");
      }
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateAudience = async () => {
    if (!projectName || !category) {
      setAudienceError("Te rog completează numele și categoria proiectului.");
      return;
    }

    setIsGeneratingAudience(true);
    setAudienceError(null);
    setAudienceContent(null);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Gaseste audienta exacta pentru proiectul: ${projectName}
Categorie: ${category}
Tara: Romania (focus Cluj-Napoca, Bucuresti, Timisoara)

Cauta pe Google si Google Maps si genereaza:

FACEBOOK GROUPS (10 grupuri):
- Nume grup exact
- Link daca il gasesti
- Numar estimat de membri
- Cat de activ e (posturi/zi)
- Strategia de postare: ce tip de continut functioneaza acolo

LINKEDIN:
- 5 grupuri profesionale relevante
- 5 hashtags de urmarit
- 3 tipuri de posturi care primesc engagement in nisa asta

TIKTOK:
- 10 hashtags principale in nisa
- 5 creatori romani din nisa (de studiat stilul)
- Ce tip de continut viralizeaza in nisa asta

YOUTUBE:
- 5 canale romanesti din nisa
- Ce keywords au trafic (din autocomplete Google/YouTube)
- Format de video care functioneaza (tutorial, review, demo, vlog)

GOOGLE MAPS (doar pentru categorii cu business local):
- Cauta pe Google Maps: business-uri din categoria ${category} in Cluj-Napoca
- Cate business-uri active exista
- Care au rating sub 4.0 (tinte pentru outreach)
- Care nu au website sau au website slab

TELEGRAM:
- 5 canale/grupuri romanesti relevante
- Cum sa intri si sa dai valoare fara spam

La final: un plan de engagement pe 7 zile — unde postezi, ce postezi, cand.`;

      const { text, response } = await generateTextWithFallback(prompt, 'gemini-2.5-flash', {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      });

      let finalContent = text || "Nu s-a putut genera audiența.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks && chunks.length > 0) {
        finalContent += "\n\n=========================================\nSURSE GOOGLE SEARCH & MAPS:\n=========================================\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            finalContent += `- ${chunk.web.title}: ${chunk.web.uri}\n`;
          } else if (chunk.maps?.uri) {
            finalContent += `- ${chunk.maps.title || 'Locație Google Maps'}: ${chunk.maps.uri}\n`;
          }
        });
      }

      setAudienceContent(finalContent);

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setAudienceError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setAudienceError(err.message || "A apărut o eroare la generarea audienței.");
      }
    } finally {
      setIsGeneratingAudience(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!category) {
      setEmailError("Te rog completează categoria proiectului.");
      return;
    }

    setIsGeneratingEmail(true);
    setEmailError(null);
    setEmailContent(null);
    setIsCopiedEmail(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const getBundlePrice = (cat: string) => {
        const prices: Record<string, string> = {
          "Restaurante": "€499",
          "Imobiliare": "€599",
          "Energie": "€699",
          "Operatiuni": "€499",
          "Afaceri": "€799",
          "Securitate": "€399",
          "Lifestyle": "€299",
          "Unelte AI": "€599",
          "Marketing": "€799"
        };
        return prices[cat] || "€499";
      };

      const prompt = `Email sequence pentru: ${category}, proiect ${projectName}, bundle ${getBundlePrice(category)}/luna

Zi0 WELCOME: Subject A/B, preheader, bun venit, CTA ghid, PS "DEMO"
Zi1 VALOARE: Top 3 tools ${category}, links, CTA
Zi3 DEMO: video 4 min YouTube, CTA demo live
Zi5 PROOF: studiu caz, CTA Telegram
Zi7 OFERTA: recap + pret + demo gratuit, WA 0768 676 141
Zi14 REACTIVARE: obiectie #1 + raspuns + testimonial
Zi30 LAST CHANCE: calcul bani pierduti, ultim reminder

Per email: lista Brevo, delay, UTM. Ton Sergiu personal.`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setEmailContent(text || "Nu s-a putut genera secvența de email.");
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setEmailError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setEmailError(err.message || "A apărut o eroare la generarea secvenței de email.");
      }
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleGenerateWhatsapp = async () => {
    if (!category || !projectName || !city) {
      setWhatsappError("Te rog completează categoria, numele proiectului și orașul.");
      return;
    }

    setIsGeneratingWhatsapp(true);
    setWhatsappError(null);
    setWhatsappContent(null);
    setIsCopiedWhatsapp(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `10 mesaje WA outreach: ${category}, ${projectName}, ${city}

Foloseste google_pin sa cauti businessuri din ${category} in ${city}.

10 variante unice 300 char:
1. Bani pierduti 2. Concurenta 3. Audit gratuit 4. Intrebare simpla
5. Studiu caz 6. Sezon 7. Recenzie Google 8. Complement
9. Data shock 10. Invitatie exclusiva

Per mesaj: follow-up 48h + follow-up 7 zile. Ton prietenos, valoare prima.`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview', {
        tools: [{ googleMaps: {} }],
      });

      setWhatsappContent(text || "Nu s-a putut genera secvența de WhatsApp.");
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setWhatsappError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setWhatsappError(err.message || "A apărut o eroare la generarea mesajelor de WhatsApp.");
      }
    } finally {
      setIsGeneratingWhatsapp(false);
    }
  };

  const handleGenerateAudit = async () => {
    if (!projectName || !category || !projectUrl || !city) {
      setAuditError("Te rog completează numele, categoria, URL-ul și orașul proiectului.");
      return;
    }

    setIsGeneratingAudit(true);
    setAuditError(null);
    setAuditContent(null);
    setIsCopiedAudit(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Audit digital pentru: ${projectName}
Categorie: ${category}, URL: ${projectUrl}, Oras: ${city}, Rating: ${googleRating || "cauta pe Google Maps"}

Foloseste google si google_pin.

SCOR ACTUAL: X/100
SCOR DUPA SSOCIETY: Y/100

5 PROBLEME:
Per problema: situatia, impact financiar lunar/anual, solutia SSociety, timp, cost (inclus in bundle).

IMPACT TOTAL ANUAL: +€X
BUNDLE: ${category} Suite [PRET]/luna
ROI: recuperare in X luni
CTA: "Raport PDF? WA: 0768 676 141"

Format cu emoji si separatori, gata de trimis WA sau Telegram.`;

      const { text, response } = await generateTextWithFallback(prompt, 'gemini-2.5-flash', {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      });

      let finalContent = text || "Nu s-a putut genera auditul.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks && chunks.length > 0) {
        finalContent += "\n\n=========================================\nSURSE GOOGLE SEARCH & MAPS:\n=========================================\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            finalContent += `- ${chunk.web.title}: ${chunk.web.uri}\n`;
          } else if (chunk.maps?.uri) {
            finalContent += `- ${chunk.maps.title || 'Locație Google Maps'}: ${chunk.maps.uri}\n`;
          }
        });
      }

      setAuditContent(finalContent);

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setAuditError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setAuditError(err.message || "A apărut o eroare la generarea auditului.");
      }
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  const handleGenerateFunnel = async () => {
    if (!category || !projectName) {
      setFunnelError("Te rog completează numele proiectului și categoria.");
      return;
    }

    setIsGeneratingFunnel(true);
    setFunnelError(null);
    setFunnelContent(null);
    setIsCopiedFunnel(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Funnel complet pentru: ${category}, proiect: ${projectName}

SKOOL: nume, descriere, 5 module onboarding (titlu + descriere + 5 quiz), reguli, template post
TELEGRAM: nume, post zilnic (preview + PRO blur + CTA), ora 09:00
WHATSAPP: nume, reguli, welcome automat, template saptamanal
CAPTARE ssociety.eu/join: Prenume+Email+WA+nisa → Brevo+Wati+TG simultan, dedup Sheets
WELCOME 7 ZILE: Zi0 email+WA, Zi1 WA tools, Zi3 email demo, Zi5 TG invite, Zi7 WA demo`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setFunnelContent(text || "Nu s-a putut genera funnel-ul.");

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setFunnelError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setFunnelError(err.message || "A apărut o eroare la generarea funnel-ului.");
      }
    } finally {
      setIsGeneratingFunnel(false);
    }
  };

  const handleGenerateRecap = async () => {
    setIsGeneratingRecap(true);
    setRecapError(null);
    setRecapContent(null);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Genereaza recap saptamanal SSociety.

PROIECTE ACTIVE: ${activeProjects}
CONTINUT PUBLICAT: ${publishedContent}
LEADS CAPTURATE: ${capturedLeads}
DEMO CALLS: ${demoCalls}
CLIENTI NOI: ${newClients}
MRR ACTUAL: ${currentMrr}
MRR TARGET: €63.842

Genereaza:

STATUS DASHBOARD:
- Vizualizare text a progresului per categorie
- Ce merge bine (top 3 metrici)
- Ce nu merge (bottom 3 metrici)
- Comparatie cu saptamana trecuta

TOP PERFORMERI:
- Ce proiect a generat cele mai multe views
- Ce hook a avut cel mai mare engagement
- Ce platforma a convertit cel mai bine

PLAN SAPTAMANA URMATOARE:
- Luni: ce proiecte promovezi (3 video-uri batch)
- Marti: outreach (10 mesaje WA per nisa)
- Joi: newsletter + LinkedIn carousel
- Vineri: analiza + update

NEXT 5 ACTIUNI PRIORITARE:
Ordinea exacta a ce trebuie facut, cu timp estimat per actiune.

GAPS:
- Ce nise nu au fost acoperite inca
- Ce platforme au fost ignorate
- Ce oportunitati au fost ratate`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setRecapContent(text || "Nu s-a putut genera recap-ul.");

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setRecapError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setRecapError(err.message || "A apărut o eroare la generarea recap-ului.");
      }
    } finally {
      setIsGeneratingRecap(false);
    }
  };

  const generateSingleImage = async (prompt: string, aspectRatio: string) => {
    // @ts-ignore
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Nu s-a putut genera imaginea.");
  };

  const handleGenerateImages = async () => {
    if (!projectName || !category) {
      setImageError("Te rog completează numele proiectului și categoria.");
      return;
    }
    if (!scriptContent) {
      setImageError("Te rog generează întâi Scriptul TTS. Imaginile se bazează pe segmentele din script.");
      return;
    }

    setIsGeneratingImages(true);
    setImageError(null);
    setImages({ segments: [], thumbnail: null, social: null });

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Genereaza imaginile tematice sincronizate cu TTS pentru: ${projectName}
Categorie: ${category}

CONTEXT: Am un podcast TTS impartit in segmente.
Fiecare imagine apare pe ecran exact cand se vorbeste despre acel subiect.
Video-ul final = colaj de imagini care se schimba sincronizat cu vocea.

IMPORTANT:
- Fiecare imagine trebuie sa ilustreze EXACT ce se discuta in segmentul respectiv
- Fara text generat AI pe imagini (textul se adauga in editare)
- Stil consistent intre toate imaginile: dark mode, accente gold #f0c040, cinematic tech
- Aspect ratio: 16:9 landscape

LISTA IMAGINI DE GENERAT (extrase din acest script):
${scriptContent}

Te rog sa returnezi un array JSON cu prompturile in limba engleza (pentru modelul de generare imagini) pentru fiecare segment, plus Thumbnail si Social Post.
Format JSON cerut:
[
  {
    "id": "Segment 00:00-00:03",
    "aspectRatio": "16:9",
    "prompt": "Detailed prompt in English: [description]. Style: cinematic dark, gold accents #f0c040, ultra HD, no text."
  },
  ...
  {
    "id": "Thumbnail",
    "aspectRatio": "16:9",
    "prompt": "..."
  },
  {
    "id": "Social Post",
    "aspectRatio": "1:1",
    "prompt": "..."
  }
]
Returneaza DOAR JSON-ul valid, fara markdown.`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview', {
        responseMimeType: "application/json",
      });

      const jsonText = text || "[]";
      const imagePrompts = JSON.parse(jsonText);

      const newSegments: {id: string, url: string}[] = [];
      let newThumbnail = null;
      let newSocial = null;

      for (const item of imagePrompts) {
        try {
          const imageUrl = await generateSingleImage(item.prompt, item.aspectRatio || "16:9");
          if (item.id === 'Thumbnail' || item.id.toLowerCase().includes('thumbnail')) {
            newThumbnail = imageUrl;
          } else if (item.id === 'Social Post' || item.id.toLowerCase().includes('social')) {
            newSocial = imageUrl;
          } else {
            newSegments.push({ id: item.id, url: imageUrl });
          }
          
          setImages({
            segments: [...newSegments],
            thumbnail: newThumbnail,
            social: newSocial
          });
        } catch (e) {
          console.error("Eroare la generarea imaginii pentru", item.id, e);
        }
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setImageError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setImageError(err.message || "A apărut o eroare la generarea imaginilor.");
      }
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!projectName) {
      setAudioError("Te rog completează numele proiectului.");
      return;
    }
    if (!scriptContent) {
      setAudioError("Te rog generează întâi Scriptul TTS.");
      return;
    }

    setIsGeneratingAudio(true);
    setAudioError(null);
    setAudioUrl(null);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Genereaza audio TTS din urmatorul script podcast.

PROIECT: ${projectName}
DURATA TOTALA: 60 secunde

SCRIPT COMPLET CU TIMECODES:
${scriptContent}

SETARI VOCE:
- SERGIU: voce masculina naturala romana, ton energic antreprenorial, ritm conversational
- ALINA: voce feminina naturala romana, ton curios si prietenos
- Pauze naturale de 0.5 secunde intre replici
- Pauza de 1 secunda inainte de CTA final
- Ritm: nu robotizat, conversational ca la podcast real

NOTA SINCRONIZARE:
Audio-ul trebuie sa respecte timecodes din script pentru ca il vom sincroniza cu imagini tematice.
Fiecare segment [00:XX-00:YY] trebuie sa dureze exact cat e specificat.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'SERGIU',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker1Voice }
                  }
                },
                {
                  speaker: 'ALINA',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker2Voice }
                  }
                }
              ]
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } else {
        throw new Error("Nu s-a putut genera fișierul audio.");
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key not valid")) {
        setAudioError("Eroare de API Key. Te rog selectează o cheie validă dintr-un proiect Google Cloud cu billing activ.");
        setHasKey(false);
      } else {
        setAudioError(err.message || "A apărut o eroare la generarea audio-ului.");
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGenerateAssembly = async () => {
    if (!projectName || !category || !projectUrl) {
      setAssemblyError("Te rog completează toate detaliile proiectului.");
      return;
    }

    if (!scriptContent) {
      setAssemblyError("Te rog generează mai întâi scriptul TTS.");
      return;
    }

    setIsGeneratingAssembly(true);
    setAssemblyError(null);
    setAssemblyContent(null);
    setIsCopiedAssembly(false);

    try {
      // @ts-ignore
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Pe baza scriptului TTS si imaginilor generate pentru ${projectName}, creeaza instructiunile complete de asamblare video.

Am:
- Audio TTS: dialog Sergiu + Alina
- Imagini tematice sincronizate
- 1 thumbnail
- Timecodes exacte per segment

Genereaza:

TIMELINE EXACTA DE EDITARE:

| Timecode | Durata | Fisier Imagine | Ce se aude | Tranzitie |
|----------|--------|---------------|------------|-----------|
| 00:00-00:03 | 3s | img_01_hook.png | "Hook text..." | Cut direct |
| 00:03-00:08 | 5s | img_02_intrebare.png | "Intrebare..." | Cross dissolve 0.3s |
| 00:08-00:20 | 12s | img_03_problema.png | "Problema..." | Cross dissolve 0.3s |
| ... | ... | ... | ... | ... |

SETARI VIDEO:
- Rezolutie: 1080x1920 (9:16 vertical) pentru TikTok/Reels/Shorts
- Rezolutie alternativa: 1920x1080 (16:9) pentru YouTube/LinkedIn
- FPS: 30
- Tranzitii intre imagini: cross dissolve 0.3 secunde (smooth, nu abrupt)
- Ken Burns effect subtil pe fiecare imagine (zoom lent 105% sau pan usor)
- Audio: TTS-ul generat, sincronizat perfect cu imaginile

OVERLAY-URI TEXT (adaugate in editare):
- [00:00-00:03] Text hook mare centrat, font bold, culoare gold #f0c040
- [00:50-00:60] CTA: "ssociety.eu/join" + "Demo Gratuit" in partea de jos
- Subtitluri auto pe tot video-ul (optional)

MUZICA:
- Background ambient subtil, volum 10-15% (nu acopera vocea)
- Genul: lo-fi tech, corporate minimalist
- Fade in primele 2 secunde, fade out ultimele 2 secunde

EXPORT:
- Format: MP4 H.264
- Calitate: 1080p
- Fisier TikTok: 9:16, max 60s
- Fisier YouTube Shorts: 9:16, max 60s
- Fisier YouTube Long: 16:9 (aceleasi imagini rearanjate)
- Fisier LinkedIn: 16:9 sau 1:1

TOOL-URI EDITARE RECOMANDATE:
- CapCut (gratuit, auto-sync, Ken Burns built-in)
- CapCut auto-captions pentru subtitluri
- Alternativ: DaVinci Resolve, Canva Video

SCRIPT TTS DE BAZĂ:
${scriptContent}`;

      const { text } = await generateTextWithFallback(prompt, 'gemini-3.1-pro-preview');

      setAssemblyContent(text || "");
      if (window.innerWidth < 1024) {
        setMobileTab('results');
      }
    } catch (err: any) {
      console.error("Error generating assembly instructions:", err);
      if (err.message?.includes("API key not valid")) {
        setHasKey(false);
      } else {
        setAssemblyError(err.message || "A apărut o eroare la generarea instrucțiunilor de asamblare.");
      }
    } finally {
      setIsGeneratingAssembly(false);
    }
  };

  const handleCopyAssembly = async () => {
    if (assemblyContent) {
      await navigator.clipboard.writeText(assemblyContent);
      setIsCopiedAssembly(true);
      setTimeout(() => setIsCopiedAssembly(false), 2000);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#04050a] text-white flex items-center justify-center p-4 sm:p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/5 border border-[#f0c040]/20 p-6 sm:p-8 rounded-2xl text-center"
        >
          <div className="w-16 h-16 bg-[#f0c040]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-[#f0c040]" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Autentificare SSociety Studio</h1>
          <p className="text-gray-400 mb-8">
            Pentru a genera conținut (Script, Imagini, Video) cu modelele Pro, 
            este necesar să selectezi o cheie API dintr-un proiect Google Cloud cu billing activ.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-[#f0c040] hover:bg-[#d9ad39] text-black font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            Selectează API Key
          </button>
          <p className="mt-4 text-xs text-gray-500">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-gray-300">
              Află mai multe despre billing
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#f0c040] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f0c040] to-[#d9ad39] rounded-xl flex items-center justify-center shadow-lg shadow-[#f0c040]/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight">SSociety Studio</h1>
              <p className="text-[10px] sm:text-xs text-[#f0c040] font-medium tracking-widest uppercase">Content Generator AI</p>
            </div>
          </div>
          <div className="hidden sm:flex text-sm text-gray-400 items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            Gemini Pro & Veo Ready
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Mobile Tabs */}
        <div className="lg:hidden flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
          <button
            onClick={() => setMobileTab('settings')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              mobileTab === 'settings' 
                ? 'bg-[#f0c040] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Setări & Generare
          </button>
          <button
            onClick={() => setMobileTab('results')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              mobileTab === 'results' 
                ? 'bg-[#f0c040] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Rezultate
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          
          {/* Controls */}
          <div className={`lg:col-span-4 space-y-6 lg:space-y-8 ${mobileTab === 'settings' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/50 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#f0c040]" />
                Setări Proiect
              </h2>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">Categorie</label>
                    {isCustomCategory && (
                      <button 
                        onClick={() => {
                          setIsCustomCategory(false);
                          setCategory(Object.keys(PROJECTS_DATA)[0]);
                          setProjectName(PROJECTS_DATA[Object.keys(PROJECTS_DATA)[0] as keyof typeof PROJECTS_DATA][0]);
                          setIsCustomProject(false);
                        }}
                        className="text-xs text-[#f0c040] hover:underline"
                      >
                        Înapoi la listă
                      </button>
                    )}
                  </div>
                  {!isCustomCategory ? (
                    <select 
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === 'NEW_CATEGORY') {
                          setIsCustomCategory(true);
                          setCategory('');
                          setIsCustomProject(true);
                          setProjectName('');
                        } else {
                          setCategory(e.target.value);
                          setProjectName(PROJECTS_DATA[e.target.value as keyof typeof PROJECTS_DATA][0]);
                          setIsCustomProject(false);
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all appearance-none"
                    >
                      {Object.keys(PROJECTS_DATA).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="NEW_CATEGORY" className="text-[#f0c040] font-bold bg-black/90">
                        + Adaugă Categorie Nouă
                      </option>
                    </select>
                  ) : (
                    <input 
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Introdu numele categoriei..."
                      className="w-full bg-black/40 border border-[#f0c040]/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                      autoFocus
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">Nume Proiect</label>
                    {isCustomProject && (
                      <button 
                        onClick={() => {
                          setIsCustomProject(false);
                          setProjectName(PROJECTS_DATA[category as keyof typeof PROJECTS_DATA][0]);
                        }}
                        className="text-xs text-[#f0c040] hover:underline"
                      >
                        Înapoi la listă
                      </button>
                    )}
                  </div>
                  {!isCustomProject ? (
                    <select 
                      value={projectName}
                      onChange={(e) => {
                        if (e.target.value === 'NEW_PROJECT') {
                          setIsCustomProject(true);
                          setProjectName('');
                        } else {
                          setProjectName(e.target.value);
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all appearance-none"
                    >
                      {PROJECTS_DATA[category as keyof typeof PROJECTS_DATA]?.map(proj => (
                        <option key={proj} value={proj}>{proj}</option>
                      ))}
                      <option value="NEW_PROJECT" className="text-[#f0c040] font-bold bg-black/90">
                        + Adaugă Proiect Nou
                      </option>
                    </select>
                  ) : (
                    <input 
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Introdu numele proiectului..."
                      className="w-full bg-black/40 border border-[#f0c040]/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                      autoFocus
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">URL Proiect</label>
                  <input 
                    type="text" 
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                    placeholder="ex: mrdelivery.ro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Oraș (Pentru Audit)</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                    placeholder="ex: Cluj-Napoca"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rating Google (Opțional)</label>
                  <input 
                    type="text" 
                    value={googleRating}
                    onChange={(e) => setGoogleRating(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                    placeholder="ex: 4.2 (150 recenzii)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Hook Principal (Opțional)</label>
                  <input 
                    type="text" 
                    value={mainHook}
                    onChange={(e) => setMainHook(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                    placeholder="Lipește hook-ul câștigător aici..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Voce Sergiu (Speaker 1)</label>
                    <select
                      value={speaker1Voice}
                      onChange={(e) => setSpeaker1Voice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all appearance-none"
                    >
                      <option value="Zephyr">Zephyr (Masculin)</option>
                      <option value="Puck">Puck (Masculin)</option>
                      <option value="Charon">Charon (Masculin)</option>
                      <option value="Kore">Kore (Feminin)</option>
                      <option value="Fenrir">Fenrir (Masculin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Voce Alina (Speaker 2)</label>
                    <select
                      value={speaker2Voice}
                      onChange={(e) => setSpeaker2Voice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all appearance-none"
                    >
                      <option value="Kore">Kore (Feminin)</option>
                      <option value="Zephyr">Zephyr (Masculin)</option>
                      <option value="Puck">Puck (Masculin)</option>
                      <option value="Charon">Charon (Masculin)</option>
                      <option value="Fenrir">Fenrir (Masculin)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <button
                    onClick={handleGenerateScript}
                    disabled={isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-gradient-to-r from-[#f0c040] to-[#d9ad39] hover:from-[#d9ad39] hover:to-[#c29a32] disabled:opacity-50 text-black font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f0c040]/20"
                  >
                    {isGeneratingScript ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează scriptul...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        1. Generează Script TTS
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateImages}
                    disabled={!scriptContent || isGeneratingImages || isGeneratingScript || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingImages ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează imagini...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        2. Generează Imagini Sincronizate
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateAudio}
                    disabled={(images.segments.length === 0 && !images.thumbnail) || isGeneratingAudio || isGeneratingScript || isGeneratingImages || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingAudio ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează audio...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        3. Generează Audio TTS
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateAssembly}
                    disabled={!audioUrl || isGeneratingAssembly || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingAssembly ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează instrucțiunile...
                      </>
                    ) : (
                      <>
                        <ListChecks className="w-5 h-5" />
                        4. Instrucțiuni Asamblare Video
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateSeoAnalysis}
                    disabled={!assemblyContent || isGeneratingSeoAnalysis || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingSeoAnalysis ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează analiza SEO...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        5. Generează Analiză SEO Completă
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateAudit}
                    disabled={!seoAnalysisContent || isGeneratingAudit || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingAudit ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se analizează business-ul...
                      </>
                    ) : (
                      <>
                        <BarChart className="w-5 h-5" />
                        6. Generează Audit Digital
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateFunnel}
                    disabled={!auditContent || isGeneratingFunnel || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingFunnel ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se creează funnel-ul...
                      </>
                    ) : (
                      <>
                        <Network className="w-5 h-5" />
                        7. Generează Funnel Skool/TG/WA
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateAudience}
                    disabled={!funnelContent || isGeneratingAudience || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingAudience ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se caută audiența...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5" />
                        8. Scraping Audiență & Grupuri
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateSeo}
                    disabled={!audienceContent || isGeneratingSeo || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingCopy || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingSeo ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează SEO...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        9. Generează SEO & Hashtags
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateCopy}
                    disabled={!seoContent || isGeneratingCopy || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingEmail || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingCopy ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează copy-ul...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        10. Generează Social Media Copy
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateEmail}
                    disabled={!copyContent || isGeneratingEmail || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingWhatsapp || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingEmail ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează emailurile...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        11. Generează Secvență Email
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerateWhatsapp}
                    disabled={!emailContent || isGeneratingWhatsapp || isGeneratingScript || isGeneratingImages || isGeneratingAudio || isGeneratingAssembly || isGeneratingSeoAnalysis || isGeneratingAudit || isGeneratingFunnel || isGeneratingAudience || isGeneratingSeo || isGeneratingCopy || isGeneratingEmail || isGeneratingRecap}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingWhatsapp ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează mesajele WA...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        12. Generează WhatsApp Outreach
                      </>
                    )}
                  </button>
                </div>

                {(scriptError || seoError || seoAnalysisError || copyError || audienceError || emailError || whatsappError || auditError || funnelError || recapError || imageError || audioError || assemblyError) && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{scriptError || seoError || seoAnalysisError || copyError || audienceError || emailError || whatsappError || auditError || funnelError || recapError || imageError || audioError || assemblyError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recap Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#f0c040]" />
                Recap Săptămânal & KPIs
              </h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Proiecte Active</label>
                    <input 
                      type="text" 
                      value={activeProjects}
                      onChange={(e) => setActiveProjects(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Conținut Publicat</label>
                    <input 
                      type="text" 
                      value={publishedContent}
                      onChange={(e) => setPublishedContent(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Leads Capturate</label>
                    <input 
                      type="text" 
                      value={capturedLeads}
                      onChange={(e) => setCapturedLeads(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Demo Calls</label>
                    <input 
                      type="text" 
                      value={demoCalls}
                      onChange={(e) => setDemoCalls(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Clienți Noi</label>
                    <input 
                      type="text" 
                      value={newClients}
                      onChange={(e) => setNewClients(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">MRR Actual</label>
                    <input 
                      type="text" 
                      value={currentMrr}
                      onChange={(e) => setCurrentMrr(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleGenerateRecap}
                    disabled={isGeneratingRecap || isGeneratingScript || isGeneratingImages || isGeneratingSeo || isGeneratingCopy || isGeneratingAudience || isGeneratingEmail || isGeneratingAudit || isGeneratingFunnel}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingRecap ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se generează recap-ul...
                      </>
                    ) : (
                      <>
                        <CalendarDays className="w-5 h-5" />
                        Generează Recap Săptămânal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Specificații Output</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Audit: Scor Digital & ROI
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Funnel: Skool, Telegram, WA
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Script: Dialog Sergiu & Alina (60s)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Audiență: Grupuri, Maps, Creatori
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  SEO: YouTube, TikTok, IG, FB, X, LinkedIn
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Copy: 7 Platforme + Pinned Comments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Email: Secvență 7 Zile (Brevo)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Imagini: 16:9, 1:1, 9:16 (Ultra HD)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Video: 9:16 Vertical (1080p, 15s)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f0c040]"></div>
                  Culori Brand: Gold & Dark
                </li>
              </ul>
            </div>
          </div>

          {/* Results */}
          <div className={`lg:col-span-8 ${mobileTab === 'results' ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Script Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    SCRIPT TTS PODCAST
                  </h3>
                  {scriptContent && (
                    <button 
                      onClick={handleCopyScript}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Script
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingScript ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se scrie scriptul...</p>
                    </div>
                  ) : scriptContent ? (
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed bg-transparent p-0 border-0">
                        {scriptContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <FileText className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Script TTS" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic text-[#f0c040]"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    AUDIO TTS PODCAST (MULTI-SPEAKER)
                  </h3>
                  {audioUrl && (
                    <a 
                      href={audioUrl}
                      download={`${projectName}-podcast.wav`}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      <Download className="w-4 h-4" />
                      Descarcă Audio
                    </a>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[120px] flex items-center justify-center">
                  {isGeneratingAudio ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-[#f0c040] py-8">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează vocile (Sergiu & Alina)...</p>
                    </div>
                  ) : audioUrl ? (
                    <div className="w-full flex flex-col items-center gap-4">
                      <audio controls className="w-full max-w-2xl" src={audioUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-white/20 py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                      <p className="text-sm">Apasă "Generează Audio TTS" pentru a crea podcastul</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    AUDIT DIGITAL (SEARCH + MAPS)
                  </h3>
                  {auditContent && (
                    <button 
                      onClick={handleCopyAudit}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedAudit ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Auditul
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingAudit ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se analizează business-ul...</p>
                    </div>
                  ) : auditContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{auditContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <BarChart className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Audit Digital" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recap Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    RECAP SĂPTĂMÂNAL & KPIs
                  </h3>
                  {recapContent && (
                    <button 
                      onClick={handleCopyRecap}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedRecap ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Recap-ul
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingRecap ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se analizează performanța săptămânii...</p>
                    </div>
                  ) : recapContent ? (
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed bg-transparent p-0 border-0">
                        {recapContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <CalendarDays className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Recap Săptămânal" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Funnel Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <Network className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    FUNNEL SKOOL + TELEGRAM + WHATSAPP
                  </h3>
                  {funnelContent && (
                    <button 
                      onClick={handleCopyFunnel}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedFunnel ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Funnel-ul
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingFunnel ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se construiește funnel-ul...</p>
                    </div>
                  ) : funnelContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{funnelContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <Network className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Funnel Skool" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audience Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    AUDIENȚĂ & GRUPURI (SEARCH + MAPS)
                  </h3>
                  {audienceContent && (
                    <button 
                      onClick={handleCopyAudience}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedAudience ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Audiența
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingAudience ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se scanează Google Search & Maps...</p>
                    </div>
                  ) : audienceContent ? (
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed bg-transparent p-0 border-0">
                        {audienceContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <MapPin className="w-12 h-12" />
                      <p className="text-sm">Apasă "Scraping Audiență & Grupuri" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    SECVENȚĂ EMAIL (7 ZILE)
                  </h3>
                  {emailContent && (
                    <button 
                      onClick={handleCopyEmail}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedEmail ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Emailurile
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingEmail ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează secvența de emailuri...</p>
                    </div>
                  ) : emailContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{emailContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <Mail className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Secvență Email" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Outreach Result */}
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    WHATSAPP OUTREACH
                  </h3>
                  {whatsappContent && (
                    <button 
                      onClick={handleCopyWhatsapp}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedWhatsapp ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Mesajele
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingWhatsapp ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează mesajele WhatsApp...</p>
                    </div>
                  ) : whatsappContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{whatsappContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <MessageCircle className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează WhatsApp Outreach" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Analysis Result */}
              <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    ANALIZĂ SEO COMPLETĂ
                  </h3>
                  {seoAnalysisContent && (
                    <button 
                      onClick={handleCopySeoAnalysis}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedSeoAnalysis ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Analiza
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingSeoAnalysis ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează analiza SEO...</p>
                    </div>
                  ) : seoAnalysisContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{seoAnalysisContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <Search className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Analiză SEO" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    SEO & HASHTAGS PER PLATFORMĂ
                  </h3>
                  {seoContent && (
                    <button 
                      onClick={handleCopySeo}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedSeo ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Analiza
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingSeo ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează SEO și hashtag-urile...</p>
                    </div>
                  ) : seoContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{seoContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <Search className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează SEO & Hashtags" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    SOCIAL MEDIA COPY
                  </h3>
                  {copyContent && (
                    <button 
                      onClick={handleCopySocialCopy}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedCopy ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingCopy ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează copy-ul pentru social media...</p>
                    </div>
                  ) : copyContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{copyContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <MessageSquare className="w-12 h-12" />
                      <p className="text-sm">Apasă "Generează Social Media Copy" pentru a începe</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Imagini Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0c040]" />
                    ASSET-URI VIZUALE (SINCRONIZATE CU SCRIPTUL)
                  </h3>
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingImages && images.segments.length === 0 && !images.thumbnail ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse text-center">Se analizează scriptul și se generează imaginile pe rând...<br/><span className="text-xs opacity-70">(Acest proces poate dura 1-2 minute)</span></p>
                    </div>
                  ) : (images.segments.length > 0 || images.thumbnail) ? (
                    <div className="space-y-8">
                      {/* Segmente */}
                      {images.segments.length > 0 && (
                        <div>
                          <h4 className="text-[#f0c040] font-medium mb-4 text-sm">SEGMENTE VIDEO (16:9)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {images.segments.map((seg, idx) => (
                              <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-400 font-medium">{seg.id}</span>
                                  <a href={seg.url} download={`${projectName}-${seg.id}.png`} className="text-[#f0c040] hover:text-white">
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                                <img src={seg.url} alt={seg.id} className="w-full aspect-video object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                              </div>
                            ))}
                            {isGeneratingImages && (
                              <div className="flex flex-col items-center justify-center aspect-video bg-white/5 rounded-lg border border-white/10 border-dashed">
                                <Loader2 className="w-6 h-6 text-[#f0c040] animate-spin mb-2" />
                                <span className="text-xs text-gray-500">Se generează următoarea...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Thumbnail & Social */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {images.thumbnail && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-[#f0c040] font-medium text-sm">THUMBNAIL (16:9)</h4>
                              <a href={images.thumbnail} download={`${projectName}-thumbnail.png`} className="text-[#f0c040] hover:text-white">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                            <img src={images.thumbnail} alt="Thumbnail" className="w-full aspect-video object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        {images.social && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-[#f0c040] font-medium text-sm">SOCIAL POST (1:1)</h4>
                              <a href={images.social} download={`${projectName}-social.png`} className="text-[#f0c040] hover:text-white">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                            <img src={images.social} alt="Social" className="w-full aspect-square object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <ImageIcon className="w-12 h-12" />
                      <p className="text-sm text-center max-w-sm">Apasă "Generează Imagini" pentru a crea vizualurile sincronizate cu scriptul TTS.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assembly Result */}
              <div className="md:col-span-2 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-black/40">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-200 flex items-center gap-2 tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-film text-[#f0c040]"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                    INSTRUCȚIUNI ASAMBLARE VIDEO
                  </h3>
                  {assemblyContent && (
                    <button 
                      onClick={handleCopyAssembly}
                      className="text-[#f0c040] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium self-end sm:self-auto"
                    >
                      {isCopiedAssembly ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiază Instrucțiuni
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-black/50 p-4 sm:p-6 min-h-[200px]">
                  {isGeneratingAssembly ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-[#f0c040] py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Se generează instrucțiunile de asamblare...</p>
                    </div>
                  ) : assemblyContent ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="markdown-body">
                        <Markdown>{assemblyContent}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                      <p className="text-sm">Apasă "Instrucțiuni Asamblare Video" pentru a genera planul de editare</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
