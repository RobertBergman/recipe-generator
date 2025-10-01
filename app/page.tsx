'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { ChefHat, Loader2 } from 'lucide-react';
import { Recipe } from '@/lib/types';
import { storage } from '@/lib/utils/storage';

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSettings, setHasSettings] = useState(false);

  useEffect(() => {
    const checkSettings = () => {
      const settings = storage.getSettings();
      setHasSettings(!!(settings?.openRouterApiKey && settings?.userPreferences));
    };

    // Check settings on mount
    checkSettings();

    // Load saved meal plan on mount
    const savedMealPlan = storage.getCurrentMealPlan();
    if (savedMealPlan.length > 0) {
      setRecipes(savedMealPlan);
    }

    // Listen for settings changes
    window.addEventListener('settingsChanged', checkSettings);

    return () => {
      window.removeEventListener('settingsChanged', checkSettings);
    };
  }, []);

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = storage.getSettings();
      if (!settings?.openRouterApiKey || !settings?.userPreferences) {
        setError('Please configure your settings first');
        return;
      }

      console.log('Generating meal plan with preferences:', settings.userPreferences.dietType);

      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: settings.openRouterApiKey,
          preferences: settings.userPreferences,
          numberOfDays: 4, // Generate 4 days worth of meals (12 recipes total)
          aiModel: settings.aiModel || 'z-ai/glm-4.6',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', data.error);
        let errorMsg = data.error || 'Failed to generate meal plan';

        // Provide helpful error messages
        if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
          errorMsg = 'Invalid API key. Please check your OpenRouter API key in settings.';
        } else if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
          errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (errorMsg.includes('insufficient')) {
          errorMsg = 'Insufficient credits. Please add credits to your OpenRouter account.';
        }

        throw new Error(errorMsg);
      }

      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error('Invalid response from server');
      }

      console.log(`Successfully generated ${data.recipes.length} recipes`);
      setRecipes(data.recipes);
      // Save to localStorage so it persists across page refreshes
      storage.saveCurrentMealPlan(data.recipes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Meal plan generation error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!hasSettings ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome to Recipe Generator!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Get started by configuring your OpenRouter API key and meal preferences in Settings.
            </p>
          </CardContent>
        </Card>
      ) : recipes.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Generate Your Meal Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Click the button below to generate a personalized meal plan based on your
              preferences and local store sales.
            </p>
            <Button
              onClick={handleGenerateMealPlan}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Meal Plan...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Generate Meal Plan
                </>
              )}
            </Button>
            {error && (
              <p className="text-red-500 mt-4 text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">Your Meal Plan</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {recipes.length} delicious recipes
              </p>
            </div>
            <Button
              onClick={handleGenerateMealPlan}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </main>
  );
}