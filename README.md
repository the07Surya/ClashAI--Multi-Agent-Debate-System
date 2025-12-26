
# Clash AI: The Multi-Agent AI Debate System

## Objective

**Clash AI** is a dynamic AI ecosystem designed to move beyond simple Q&A and into the realm of complex, multi-perspective discussions.

- **Simulate Expert Panels**: Instead of a single AI, you orchestrate a team of specialized AI agents to simulate a real-time expert panel discussion.
- **Build Your Own Agents**: Use the intuitive "Persona Studio" to create custom AI experts. You define their roles, expertise, and viewpoints.
- **Watch a Live Debate**: The agents don't just answer—they research, argue, build upon, and challenge each other's points on any topic you provide.
- **Get Synthesized Insights**: The debate culminates in a comprehensive final report, distilling the entire conversation into key insights, areas of consensus, and actionable recommendations.

## ✨ Key Features

**Dynamic Persona Studio**: Don't just use preset agents. Build your own AI experts from the ground up.
- Define their Name, Avatar, Role Description, and even their unique UI Color Scheme.
- Save and reuse your custom personas for future debates.
**Real-Time Debate Flow**: No more waiting. Watch agent responses stream to the UI the moment they are generated for a truly live, sequential conversation.

**Stateful Agent Orchestration (LangGraph)**: A robust backend workflow ensures the debate follows a logical sequence: Research → Debate Rounds → Judicial Review → Synthesis.

**Automated Research Phase**: Kick off every debate with facts. A dedicated Researcher Agent uses the Tavily API to gather relevant information, ensuring the discussion is grounded in real-world data.

**AI Judicial Review**: An impartial Judge Agent analyzes each round, providing targeted feedback to steer the conversation, deepen the discussion, and prevent repetition.

**Comprehensive Final Report**: The debate concludes with a Moderator Agent delivering a detailed analysis, breaking down the complex discussion into:
- An Executive Summary
- Key Insights & Discoveries
- Points of Consensus & Tension
- Actionable Recommendations

## 🛠️ Tech Stack & Architecture

The project is architected with a decoupled frontend and backend, communicating in real-time via WebSockets.

### Backend
-  Python 3.10+
-  FastAPI (for WebSockets & API)
-  LangGraph (for agent orchestration
-  LangChain (for LLM integration)
-  Groq (as the LLM provider)
-  Pydantic (for data validation)
-  Tavily AI (for web search)

### Frontend
-  React 18+ (with Vite)
-  Tailwind CSS (for styling)
-  Framer Motion (for animations)
-  Heroicons (for icons)
-  useWebSocket (custom hook for real-time)



## System Flow:

The application follows a clear, event-driven flow orchestrated by LangGraph:

**User Input → Research → Agent Configuration → Round 1 (Parallel) → Judge → Round 2+ (Sequential) → Judge → ... → Moderator → Final Report**

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites:
-  Python 3.10 or newer.
-  Node.js 18 or newer (with npm or yarn).
-  A Groq API Key (free tier available at groq.com).
-  A Tavily AI API Key (free tier available at tavily.com).

## Backend Setup
First, clone the repository and set up the Python environment.

### Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### Create and activate a virtual environment
-  python -m venv venv
-  source venv/bin/activate  # On Windows,
-  venv\Scripts\activate

## Install backend dependencies
- pip install -r requirements.txt


Next, configure your API keys.
-  Find the .env.example file in the root directory.
-  Create a copy of it and name it .env.
-  Open the new .env file and replace the placeholder values with your actual API keys from Groq and Tavily.

## .env file
- GROQ_API_KEY="gsk_YourActualGroqApiKey"
- TAVILY_API_KEY="tvly-YourActualTavilyApiKey"

Now, you can run the backend server.
## Start the FastAPI server
- uvicorn main:app --reload

The backend is now running and listening for connections at http://localhost:8000.

## Frontend Setup
Open a new terminal window and navigate to the frontend directory.
### Navigate to the frontend directory
- cd frontend

### Install frontend dependencies
- npm install

### Run the React development server
- npm run dev

The frontend development server will start, and your browser should automatically open to http://localhost:5173 (or another available port).

### You are now ready to use the application!!

# 📖 User Guide: How to Use Clash AI
Using the application is an intuitive, five-step process.

### Step 1: Open the Persona Studio

When you first load the application, you'll be in the Persona Studio. This is your creative hub for building the AI panel.

### Step 2: Build Your Debate Panel
You have two options for selecting your agents:

**Use Presets**: Click on the "Classic" or "Business" tabs to view pre-configured expert personas like the Innovation Strategist or the Risk Analyst. Simply click on a card to add that persona to one of the four slots in your panel.

### Create Custom Personas:

1. Navigate to the "Custom" tab and click the "Create Persona" button.
2. In the modal that appears, fill in the details:
    -  Name: A descriptive title (e.g., "Cautious Environmental Scientist").
    - Avatar: An emoji that represents the persona.
    - Color Theme: A color for their UI elements.
    - Role Description: This is the most important part. Be descriptive about their expertise, priorities, biases, and perspective. The more detailed, the better the AI will embody the role.

3. Click "Create Persona" to save it. Your new persona will now appear under the "Custom" tab, ready to be selected for your panel.

You must select between 2 and 4 agents to form a valid panel.

### Step 3: Start the Debate
Once your panel is ready:

Enter the topic you want the agents to debate in the main input field.
The **Start Debate** button will become active. Click it to begin.

### Step 4: Watch the Debate Unfold
The application will switch to the Debate view, and the workflow will begin automatically:

-  Research Phase: The Researcher Agent will gather information on your topic. A panel will appear showing its status.
-  Round 1: Each of your selected agents will provide their opening statement. You will see their responses appear sequentially in real-time.
-  Judicial Review: After the round, the Judge Agent's analysis will appear, providing a summary and determining whether to continue.
-  Subsequent Rounds: The debate will continue for the configured number of rounds, with agents responding to each other based on the judge's feedback.

### Step 5: Review the Final Report
After the final round, the Moderator Agent will generate and display a comprehensive Final Report. This report provides a complete synthesis of the entire debate, perfect for analysis and decision-making.
To start a new session, simply click the **Back to Studio** button.

To start a new session, simply click the **Back to Studio** button.


# 🤝 Contributing
Contributions are welcome!! If you have suggestions for new features, improvements to the agent prompts, or bug fixes, please feel free to open an issue or submit a pull request.


