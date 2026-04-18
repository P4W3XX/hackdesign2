import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { education, interests, goal } = await req.json();

  const prompt = `
    Jesteś profesjonalnym doradcą kariery w Polsce. 
    Użytkownik: Wykształcenie ${education}, zainteresowania: ${interests}, cel: ${goal}.
    Stwórz optymalną ścieżkę kariery (5 kroków). 
    Zwróć TYLKO czysty JSON w formacie:
    {
      "steps": [
        {
          "role": "Nazwa stanowiska",
          "timeframe": "Okres czasu (np. 1-2 rok)",
          "salary": "Widełki płacowe w PLN",
          "description": "Krótki opis co robić w tym kroku",
          "skills": ["Umiejętność 1", "Umiejętność 2", "Umiejętność 3"]
        }
      ]
    }
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const cleanJson = text.replace(/```json|```/g, "");
  
  return new Response(cleanJson);
}