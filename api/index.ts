import express from 'express';
import { ToolsService, tool, ParameterType } from '@optimizely-opal/opal-tools-sdk';

const app = express();
app.use(express.json());

const toolsService = new ToolsService(app);

// ── Interfaces ──────────────────────────────────────────────
interface GreetingParameters {
  name: string;
  language?: string;
}

interface DateParameters {
  format?: string;
}

// ── Greeting Tool ───────────────────────────────────────────
async function greeting(parameters: GreetingParameters) {
  const { name, language } = parameters;
  const selectedLanguage =
    language ||
    ['english', 'spanish', 'french'][Math.floor(Math.random() * 3)];

  let greetingText: string;
  if (selectedLanguage.toLowerCase() === 'spanish') {
    greetingText = `¡Hola, ${name}! ¿Cómo estás?`;
  } else if (selectedLanguage.toLowerCase() === 'french') {
    greetingText = `Bonjour, ${name}! Comment ça va?`;
  } else {
    greetingText = `Hello, ${name}! How are you?`;
  }

  return { greeting: greetingText, language: selectedLanguage };
}

// ── Today's Date Tool ───────────────────────────────────────
async function todaysDate(parameters: DateParameters) {
  const format = parameters.format || '%Y-%m-%d';
  const today = new Date();

  let formattedDate: string;
  if (format === '%Y-%m-%d') {
    formattedDate = today.toISOString().split('T')[0];
  } else if (format === '%B %d, %Y') {
    formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } else if (format === '%d/%m/%Y') {
    formattedDate = today.toLocaleDateString('en-GB');
  } else {
    formattedDate = today.toISOString().split('T')[0];
  }

  return { date: formattedDate, format, timestamp: today.getTime() / 1000 };
}

// ── Register Tools ──────────────────────────────────────────
tool({
  name: 'greeting',
  description: 'Greets a person in a random language (English, Spanish, or French)',
  parameters: [
    { name: 'name', type: ParameterType.String, description: 'Name of the person to greet', required: true },
    { name: 'language', type: ParameterType.String, description: 'Language for greeting (defaults to random)', required: false },
  ],
})(greeting);

tool({
  name: 'todays-date',
  description: "Returns today's date in the specified format",
  parameters: [
    { name: 'format', type: ParameterType.String, description: 'Date format (defaults to ISO format)', required: false },
  ],
})(todaysDate);

// ── Export for Vercel ───────────────────────────────────────
export default app;