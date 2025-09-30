'use client';

import { Recipe } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { storage } from '@/lib/utils/storage';
import { useState, useEffect } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onSaveToggle?: (saved: boolean) => void;
  showSaveButton?: boolean;
}

export function RecipeCard({ recipe, onClick, onSaveToggle, showSaveButton = true }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(storage.isRecipeSaved(recipe.id));
  }, [recipe.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSaved) {
      storage.deleteRecipe(recipe.id);
      setIsSaved(false);
      onSaveToggle?.(false);
    } else {
      storage.saveRecipe(recipe);
      setIsSaved(true);
      onSaveToggle?.(true);
    }
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      lunch: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      dinner: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      snack: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    };
    return colors[mealType as keyof typeof colors] || colors.dinner;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow relative" onClick={onClick}>
      {showSaveButton && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 z-10"
          onClick={handleSaveToggle}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </Button>
      )}

      <CardHeader>
        <div className="flex items-start gap-2">
          <ChefHat className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <CardTitle className="mb-2">{recipe.name}</CardTitle>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getMealTypeColor(recipe.mealType)}`}>
              {recipe.mealType}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {recipe.description}
        </p>

        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {recipe.nutritionInfo && (
          <div className="grid grid-cols-4 gap-2 text-xs text-center bg-gray-100 dark:bg-gray-800 rounded p-3">
            <div>
              <div className="font-bold">{recipe.nutritionInfo.calories}</div>
              <div className="text-gray-600 dark:text-gray-400">cal</div>
            </div>
            <div>
              <div className="font-bold">{recipe.nutritionInfo.protein}g</div>
              <div className="text-gray-600 dark:text-gray-400">protein</div>
            </div>
            <div>
              <div className="font-bold">{recipe.nutritionInfo.carbs}g</div>
              <div className="text-gray-600 dark:text-gray-400">carbs</div>
            </div>
            <div>
              <div className="font-bold">{recipe.nutritionInfo.fat}g</div>
              <div className="text-gray-600 dark:text-gray-400">fat</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.tags
            .filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase()))
            .map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
              >
                {tag}
              </span>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}