import httpx
from typing import List, Dict, Any, Optional
from .config import settings

async def ask_openrouter(messages: List[Dict[str, str]], system_prompt: Optional[str] = None) -> str:
    """
    Sends a chat completion request to OpenRouter API.
    If the OPENROUTER_API_KEY is not set, returns a helpful mock fallback response.
    """
    if not settings.OPENROUTER_API_KEY:
        # Generate simulated premium response for demo/development purposes
        last_user_message = messages[-1]["content"] if messages else ""
        print("Warning: OPENROUTER_API_KEY is not set. Using fallback mock response.")
        
        # Simple heuristic to provide somewhat relevant mock responses
        if any(w in last_user_message.lower() for w in ["code", "error", "bug", "debug", "function"]):
            return (
                "### SkillSphere Code Assistant (Demo Mode)\n\n"
                "**Analysis:** I see you are working on a code snippet. Since the `OPENROUTER_API_KEY` is not configured on this server, "
                "I am providing a standard analysis template:\n\n"
                "1. **Syntax Check:** Your code structure looks correct. Ensure all braces, indentations, and parentheses match.\n"
                "2. **Potential Improvements:** Consider optimizing time complexity by using hash maps (O(1) lookups) rather than nested loops (O(N^2)).\n"
                "3. **Code Quality:** Use descriptive naming conventions and add comments for complex business logic.\n\n"
                "```python\n# Recommended clean pattern\ndef solve_efficiently(data):\n    seen = set()\n    for item in data:\n        if item not in seen:\n            seen.add(item)\n            # Process item\n    return len(seen)\n```\n\n"
                "*Tip: Add your OpenRouter API Key in the backend `.env` file to unlock live interactive analysis.*"
            )
        elif any(w in last_user_message.lower() for w in ["recommend", "roadmap", "what next", "suggest"]):
            return (
                "### SkillSphere AI Recommendation Engine (Demo Mode)\n\n"
                "Based on your profile, here are your personalized recommendations:\n\n"
                "1. **Core Recommendation:** **React & Frontend Architecture**.\n"
                "   - *Why:* You have shown interest in JavaScript web modules. Advancing to React component patterns will round out your skillset.\n"
                "2. **Next Milestone:** **Python Backend development**.\n"
                "   - *Why:* Knowing React and Python FastAPI makes you a highly valued Full Stack Developer.\n"
                "3. **Recommended Practice Challenge:** LeetCode #1 - *Two Sum* (Easy/Medium) to polish array search techniques.\n\n"
                "*Tip: Add your OpenRouter API Key in the backend `.env` file to unlock live interactive analysis.*"
            )
        else:
            return (
                f"### SkillSphere Learning Assistant (Demo Mode)\n\n"
                f"Thank you for your question: *\"{last_user_message}\"*\n\n"
                f"I am running in **Demo Mode** because the `OPENROUTER_API_KEY` environment variable is not set on the server.\n\n"
                f"**How to configure the API key:**\n"
                f"1. Create a `.env` file inside the `backend` folder.\n"
                f"2. Add the variable: `OPENROUTER_API_KEY=your_key_here`\n"
                f"3. Restart the FastAPI server.\n\n"
                f"**A Quick Learning Note:** Whatever concept you asked about, remember that learning programming is about active recall "
                f"and spaced repetition. Head over to our **Coding Practice Module** to practice code syntax directly on LeetCode and HackerRank!"
            )

    # Prepare request payload for OpenRouter
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkillSphere Learning Platform",
        "Content-Type": "application/json"
    }

    full_messages = []
    if system_prompt:
        full_messages.append({"role": "system", "content": system_prompt})
    full_messages.extend(messages)

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": full_messages
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                error_detail = response.text
                print(f"OpenRouter Error Status {response.status_code}: {error_detail}")
                return f"Error: OpenRouter API returned status code {response.status_code}. Detail: {error_detail[:200]}"
    except Exception as e:
        print(f"Exception during OpenRouter call: {e}")
        return f"Error connecting to OpenRouter API: {str(e)}"

# --- Feature wrappers ---

async def generate_chat_response(user_message: str, chat_history: List[Dict[str, str]], skill_context: Optional[str] = None) -> str:
    system = (
        "You are the SkillSphere Learning Assistant, an expert technical tutor. "
        "Your goal is to explain complex concepts in an engaging, beginner-friendly manner. "
        "Use markdown formatting with bold text, lists, and code blocks where appropriate. "
    )
    if skill_context:
        system += f"The user is currently studying the skill: '{skill_context}'. Tailor your explanation to this skill context."

    # Assemble messages
    messages = []
    for h in chat_history[-6:]:  # include last 3 exchanges to preserve context
        messages.append({"role": "user", "content": h["message"]})
        messages.append({"role": "assistant", "content": h["response"]})
    messages.append({"role": "user", "content": user_message})

    return await ask_openrouter(messages, system_prompt=system)

async def generate_code_response(code: str, language: str, query_type: str) -> str:
    system = (
        "You are the SkillSphere Code Assistant, an expert senior developer. "
        "Your task is to analyze user-provided code, explain its behavior, "
        "detect syntax or logical errors, and suggest clean, optimized improvements."
    )
    
    prompt = f"Language: {language}\nQuery Type: {query_type}\n\nCode Snippet:\n```\n{code}\n```\n\n"
    if query_type == "debug":
        prompt += "Please find errors in the code above and explain how to fix them."
    elif query_type == "explain":
        prompt += "Please explain this code line-by-line or conceptually."
    else:
        prompt += "Please refactor this code to make it more optimized, readable, and clean. Provide the improved version."

    messages = [{"role": "user", "content": prompt}]
    return await ask_openrouter(messages, system_prompt=system)

async def generate_recommendation(user_name: str, completed_skills: List[str], bookmarked_titles: List[str]) -> str:
    system = (
        "You are the SkillSphere Recommendation Engine. "
        "Analyze the user's progress and interests, and provide structured, highly-targeted "
        "learning recommendations (skills to learn next, roadmaps to follow, or practice types)."
    )

    prompt = (
        f"User Name: {user_name}\n"
        f"Completed Skills: {', '.join(completed_skills) if completed_skills else 'None yet'}\n"
        f"Bookmarked Resources: {', '.join(bookmarked_titles) if bookmarked_titles else 'None yet'}\n\n"
        "Provide a short markdown list of 2-3 personalized suggestions on what they should learn next and why."
    )

    messages = [{"role": "user", "content": prompt}]
    return await ask_openrouter(messages, system_prompt=system)
