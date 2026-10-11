import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Gym Business Advisor
app.post('/api/ai/gym-advisor', async (req, res) => {
  try {
    const { branch, stats, recentExpenses, topDues } = req.body;

    const prompt = `You are a world-class elite Gym Business Consultant and Fitness ERP Analyst.
Analyze the following operational data for "${branch || 'All Branches'}":
- Total Members: ${stats.totalMembers}
- Active Members: ${stats.activeMembers}
- Due Members: ${stats.dueMembers}
- Total Collections: ₹${stats.totalRevenue}
- Total Maintenance & Expenses: ₹${stats.totalExpenses}
- Net Profit: ₹${stats.netProfit}
- Total Outstanding Dues: ₹${stats.totalDues}
- Recent Expenses breakdown: ${JSON.stringify(recentExpenses || [])}
- Top Member Dues: ${JSON.stringify(topDues || [])}

Provide a concise, high-impact executive report formatted in clean Markdown with:
1. 💡 Financial Health Check (Score 1-10 & 2-sentence summary)
2. 🚨 Cash Flow & Dues Recovery Strategy (Actionable steps to collect outstanding ₹${stats.totalDues})
3. 📉 Expense Optimization (Where the gym is leaking money based on maintenance & bills)
4. 🚀 Member Retention & Upsell Tactics (Personal training, annual packages, supplements)
Keep the tone professional, encouraging, and focused on maximizing net profit.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, analysis: response.text });
  } catch (error: any) {
    console.error('Error generating gym advisor analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI business analysis',
    });
  }
});

// Endpoint: AI Personalized Workout & Diet Routine
app.post('/api/ai/workout-diet', async (req, res) => {
  try {
    const { memberName, weight, height, bodybuildingGoal, plan, medicalNotes } = req.body;

    const prompt = `You are a certified IFBB Pro strength coach and sports nutritionist.
Create a customized, comprehensive 7-day Workout Plan and Diet/Nutrition Blueprint for gym member:
- Name: ${memberName}
- Current Weight: ${weight} kg
- Height: ${height ? `${height} cm` : 'Not specified'}
- Chosen Bodybuilding/Fitness Goal: ${bodybuildingGoal} (e.g. Muscle Hypertrophy, Classic Physique, Fat Loss & Shred, Powerlifting)
- Membership Plan: ${plan}
- Health / Injury Notes: ${medicalNotes || 'None reported'}

Format the output cleanly in Markdown:
1. 🎯 Macro & Caloric Target (Estimated daily calories, protein, carbs, fats)
2. 🥗 Daily Meal Plan (Pre-workout, Breakfast, Lunch, Post-workout shake, Dinner with budget-friendly real gym foods like eggs, chicken/paneer, rice, oats)
3. 🏋️ 7-Day Workout Routine Split (e.g., Push/Pull/Legs or Arnold Split with exact exercises, sets, rep ranges, and rest periods)
4. 💊 Core Supplementation & Recovery Protocol (Creatine, Whey, hydration, sleep)
Keep it motivational, safe, and tailored specifically to ${bodybuildingGoal}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, plan: response.text });
  } catch (error: any) {
    console.error('Error generating workout & diet plan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate workout plan',
    });
  }
});

// Endpoint: AI Smart WhatsApp/SMS Due Reminder Drafter
app.post('/api/ai/fee-reminder', async (req, res) => {
  try {
    const { memberName, dueAmount, plan, expiryDate, branch, tone, upiId } = req.body;

    const prompt = `Draft 3 ready-to-copy WhatsApp/SMS payment reminder messages for a gym member:
- Member Name: ${memberName}
- Outstanding Due: ₹${dueAmount}
- Plan: ${plan}
- Expiry Date: ${expiryDate}
- Gym Branch: ${branch}
- Owner UPI ID: ${upiId || 'ironcore@upi'}
- Desired Tone: ${tone || 'Polite & Friendly'}

Generate 3 options:
1. Option 1: Friendly & Courteous (Warm check-in, renewal reminder with payment details)
2. Option 2: Professional & Direct (Formal reminder with urgent deadline to avoid workout disruption)
3. Option 3: Motivational Fitness Focus ("Keep your gains going strong! Renew your membership...")
Include emojis suitable for WhatsApp and clear UPI payment instruction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, reminders: response.text });
  } catch (error: any) {
    console.error('Error drafting fee reminder:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to draft fee reminder',
    });
  }
});

// Endpoint: General Gym AI Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, gymContext } = req.body;

    const systemInstruction = `You are IronCore AI, the intelligent built-in manager for IronCore Gym ERP.
You assist gym owners, trainers, and receptionists with:
- Managing 500+ gym members across 4 branches
- Calculating net profit, sales, and outstanding dues
- Equipment maintenance guidelines and reducing electricity/light bills
- Formulating gym promotional offers and festival discounts
- Answering fitness and bodybuilding technical questions.
Current Gym Context: ${JSON.stringify(gymContext || {})}.
Provide concise, accurate, actionable responses.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process AI chat query',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`IronCore Gym ERP server running on port ${port}`);
  });
}

startServer();
