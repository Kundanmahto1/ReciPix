import ollama
import json

class RecipeGenerator:
    def __init__(self, model_name='gemma3:4b'):
        self.model_name = model_name
        # Verify ollama is running and model is available
        try:
            ollama.list()
        except Exception as e:
            print(f"Warning: Ollama might not be running: {e}")

    def generate(self, ingredients):
        prompt = self._create_prompt(ingredients)
        
        try:
            response = ollama.chat(model=self.model_name, messages=[
                {
                    'role': 'user',
                    'content': prompt,
                },
            ])
            
            content = response['message']['content']
            print(f"LLM Response: {content[:500]}...")  # Debug: print first 500 chars
            
            # Extract JSON from response (it might be wrapped in ```json ... ```)
            json_str = self._extract_json(content)
            print(f"Extracted JSON: {json_str[:500]}...")  # Debug: print extracted JSON
            
            parsed = json.loads(json_str)
            print(f"Parsed successfully: {parsed}")  # Debug: print parsed result
            return parsed
        except Exception as e:
            print(f"Error generating recipes: {e}")
            print(f"Full content: {content if 'content' in locals() else 'No content'}")
            return {"error": str(e)}

    def _extract_json(self, text):
        # Find the first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}') + 1
        
        if start != -1 and end != -1:
            json_str = text[start:end]
            # Clean up common issues
            json_str = json_str.replace('\n', ' ')
            return json_str
        return text

    def _create_prompt(self, ingredients):
        ingredients_str = ", ".join(ingredients)
        return f"""
        You are a helpful cooking assistant. Generate 3 creative recipes using these ingredients: {ingredients_str}

        CRITICAL: Output MUST be valid JSON only. Do not include any text before or after the JSON.
        
        Required JSON Structure:
        {{
          "recipes": [
            {{
              "name": "Recipe Name",
              "description": "Short description",
              "time": "XX mins",
              "servings": 2,
              "difficulty": "Easy",
              "ingredients": ["item1", "item2"],
              "steps": ["Step 1", "Step 2"]
            }}
          ]
        }}
        """
