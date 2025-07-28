import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { marked } from "marked";

// --- CONSTANTS ---
const NICHES = ["Fashion", "Fitness", "Food", "Motivation", "Tech", "Travel", "Beauty", "Art"];
const GOALS = ["Engagement", "Sales", "Followers"];
const TONES = ["Funny", "Emotional", "Trust-building", "Inspirational", "Educational", "GenZ"];

// --- API HELPER ---
let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

const generateContent = async (prompt: string): Promise<string> => {
    if (!ai) {
        return "Error: AI client not initialized. Please check your API key.";
    }
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are “InstaBoost Coach” – a dedicated Reels Growth Assistant built for Instagram creators.

Your ONLY job is to provide:
1. 🎬 1 Creative Reel Idea based on the given niche, goal, and tone.
2. 🏷️ 5 trending Hashtags that are relevant and viral in that niche.
3. 📝 1 Short, Engaging Caption in a youth-focused tone with at least 1 emoji.

📌 Rules:
- DO NOT introduce yourself.
- DO NOT explain anything.
- DO NOT respond to general queries.
- Stick to your expert role ONLY.
- Keep response short, crisp, and GenZ-friendly.

📦 Response Format (Always):
🎬 **Reel Idea:** [1-line viral idea]  
🏷️ **Hashtags:** #tag1 #tag2 #tag3 #tag4 #tag5  
📝 **Caption:** “[Short, punchy caption with 1 emoji]”

⚠️ If user input is unclear, politely ask: “Please enter a valid niche and goal.”

Inputs to expect:
- Niche (e.g., Fashion, Fitness, Food, Motivation)
- Goal (Engagement / Sales / Followers)
- Tone (Funny / Emotional / Trust-building)

DO NOT ever break character.`,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        return "Oops! Something went wrong on my end. Please try again in a bit.";
    }
};

// --- UI COMPONENTS ---

const App: React.FC = () => {
    const [niche, setNiche] = useState<string>("");
    const [goal, setGoal] = useState<string>("");
    const [tone, setTone] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult("");

        if (!niche || !goal || !tone) {
            setError("Please select a niche, goal, and tone to continue.");
            return;
        }

        setIsLoading(true);
        const prompt = `Niche: ${niche}, Goal: ${goal}, Tone: ${tone}`;
        const generatedResult = await generateContent(prompt);
        setResult(generatedResult);
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        if (!result) return;
        // Clean up markdown for plain text copy
        const plainText = result
            .replace(/🎬 \*\*Reel Idea:\*\* /g, 'Reel Idea: ')
            .replace(/🏷️ \*\*Hashtags:\*\* /g, '\nHashtags: ')
            .replace(/📝 \*\*Caption:\*\* /g, '\nCaption: ')
            .replace(/“|”/g, '')
            .replace(/\*/g, ''); // Remove any other asterisks
        
        navigator.clipboard.writeText(plainText).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Failed to copy. Please try again.");
        });
    };

    return (
        <>
            <style>{`
                :root {
                  --brand-primary: #833AB4;
                  --brand-secondary: #F77737;
                  --bg-light: #F9F9F9;
                  --text-light: #262626;
                  --surface-color: #FFFFFF;
                  --border-color: #E0E0E0;
                  --font-family: 'Poppins', sans-serif;
                }
                body {
                  font-family: var(--font-family);
                  background-color: var(--bg-light);
                  color: var(--text-light);
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  padding: 20px;
                  box-sizing: border-box;
                }
                #root {
                  width: 100%;
                  max-width: 550px;
                  display: flex;
                  flex-direction: column;
                  background: var(--surface-color);
                  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                  border-radius: 20px;
                  overflow: hidden;
                }
                .header {
                  background: linear-gradient(90deg, var(--brand-primary), var(--brand-secondary));
                  color: white;
                  padding: 20px;
                  text-align: center;
                  font-weight: 600;
                  font-size: 1.5rem;
                  letter-spacing: 1px;
                }
                .main-content {
                  padding: 24px;
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                }
                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #555;
                }
                .input-group select {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    font-family: var(--font-family);
                    font-size: 1rem;
                    background-color: #fff;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                }
                .action-button {
                  padding: 14px 20px;
                  border: none;
                  background: linear-gradient(90deg, var(--brand-primary), var(--brand-secondary));
                  color: white;
                  font-family: var(--font-family);
                  font-size: 1.1rem;
                  font-weight: 600;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: transform 0.2s, box-shadow 0.2s;
                  margin-top: 8px;
                }
                .action-button:hover:not(:disabled) {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 15px rgba(131, 58, 180, 0.3);
                }
                .action-button:disabled {
                  opacity: 0.7;
                  cursor: not-allowed;
                }
                .error-message {
                    color: #D32F2F;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .result-container {
                    background-color: #F9FAFB;
                    border: 1px dashed var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    margin-top: 16px;
                    position: relative;
                }
                .result-content p {
                    margin: 0 0 12px 0;
                    line-height: 1.6;
                }
                .result-content p:last-child {
                    margin-bottom: 0;
                }
                .copy-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #fff;
                    border: 1px solid var(--border-color);
                    color: #555;
                    border-radius: 6px;
                    padding: 6px 10px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-family: var(--font-family);
                }
                .copy-button:hover {
                    background-color: #f0f0f0;
                }
                .loading-indicator {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100px;
                }
                .loading-spinner {
                  width: 40px;
                  height: 40px;
                  border: 4px solid var(--border-color);
                  border-top-color: var(--brand-primary);
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                .result-content strong {
                   color: var(--brand-primary);
                }
            `}</style>
            <header className="header">
                InstaBoost Coach 🤖
            </header>
            <main className="main-content">
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="niche-select">1. Choose Your Niche</label>
                        <select id="niche-select" value={niche} onChange={e => setNiche(e.target.value)} required>
                            <option value="" disabled>Select a niche...</option>
                            {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="goal-select">2. Choose Your Goal</label>
                        <select id="goal-select" value={goal} onChange={e => setGoal(e.target.value)} required>
                            <option value="" disabled>Select a goal...</option>
                            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="tone-select">3. Choose Your Tone</label>
                        <select id="tone-select" value={tone} onChange={e => setTone(e.target.value)} required>
                            <option value="" disabled>Select a tone...</option>
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="action-button" disabled={isLoading}>
                        {isLoading ? 'Generating...' : '🚀 Get Reel Idea'}
                    </button>
                </form>

                {isLoading && (
                    <div className="result-container">
                        <div className="loading-indicator">
                            <div className="loading-spinner"></div>
                        </div>
                    </div>
                )}

                {result && !isLoading && (
                    <div className="result-container">
                        <button className="copy-button" onClick={copyToClipboard}>📋 Copy</button>
                        <div className="result-content" dangerouslySetInnerHTML={{ __html: marked(result) }} />
                    </div>
                )}
            </main>
        </>
    );
};


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
