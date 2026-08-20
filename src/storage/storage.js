import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialRecipes } from '../data/recipes';

export const FAVORITES_STORAGE_KEY = '@foodie_favorites';
export const MY_RECIPES_STORAGE_KEY = '@foodie_my_recipes';

/**
 * Mengambil daftar ID resep favorit dari AsyncStorage
 * @returns {Promise<string[]>} Array of recipe IDs
 */
export const getFavoriteIds = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error membaca data favorit dari AsyncStorage:', e);
    return [];
  }
};

/**
 * Menyimpan array ID favorit ke AsyncStorage
 * @param {string[]} ids
 */
export const saveFavoriteIds = async (ids) => {
  try {
    const jsonValue = JSON.stringify(ids);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error menyimpan data favorit ke AsyncStorage:', e);
    throw e;
  }
};

/**
 * Cek apakah sebuah resep merupakan favorit
 * @param {string} recipeId
 * @returns {Promise<boolean>}
 */
export const isFavorite = async (recipeId) => {
  try {
    const ids = await getFavoriteIds();
    return ids.includes(String(recipeId));
  } catch (e) {
    console.error('Error mengecek status favorit:', e);
    return false;
  }
};

/**
 * Toggle status favorit sebuah resep
 * @param {string} recipeId
 * @returns {Promise<boolean>} Status baru (true = favorit, false = tidak favorit)
 */
export const toggleFavorite = async (recipeId) => {
  try {
    const strId = String(recipeId);
    const ids = await getFavoriteIds();
    let newIds = [];
    let isNowFavorite = false;

    if (ids.includes(strId)) {
      newIds = ids.filter((id) => id !== strId);
      isNowFavorite = false;
    } else {
      newIds = [...ids, strId];
      isNowFavorite = true;
    }

    await saveFavoriteIds(newIds);
    return isNowFavorite;
  } catch (e) {
    console.error('Error melakukan toggle favorit:', e);
    throw e;
  }
};

/**
 * Mengambil daftar resep buatan pengguna dari AsyncStorage
 * @returns {Promise<Array>} Array of custom recipe objects
 */
export const getMyRecipes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(MY_RECIPES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error membaca resep saya dari AsyncStorage:', e);
    return [];
  }
};

/**
 * Menyimpan array resep buatan pengguna ke AsyncStorage
 * @param {Array} recipes
 */
export const saveMyRecipes = async (recipes) => {
  try {
    const jsonValue = JSON.stringify(recipes);
    await AsyncStorage.setItem(MY_RECIPES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error menyimpan resep saya ke AsyncStorage:', e);
    throw e;
  }
};

/**
 * Menambahkan resep baru ke daftar resep pengguna
 * @param {Object} recipeData
 * @returns {Promise<Object>} Resep yang baru ditambahkan
 */
export const addMyRecipe = async (recipeData) => {
  try {
    const currentRecipes = await getMyRecipes();
    const newRecipe = {
      ...recipeData,
      id: `my_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    const updatedRecipes = [newRecipe, ...currentRecipes];
    await saveMyRecipes(updatedRecipes);
    return newRecipe;
  } catch (e) {
    console.error('Error menambahkan resep baru:', e);
    throw e;
  }
};

/**
 * Memperbarui resep buatan pengguna yang sudah ada
 * @param {Object} updatedRecipe
 * @returns {Promise<Object>} Resep yang telah diperbarui
 */
export const updateMyRecipe = async (updatedRecipe) => {
  try {
    const currentRecipes = await getMyRecipes();
    const recipeIndex = currentRecipes.findIndex(
      (r) => String(r.id) === String(updatedRecipe.id)
    );

    if (recipeIndex === -1) {
      throw new Error('Resep tidak ditemukan');
    }

    currentRecipes[recipeIndex] = {
      ...currentRecipes[recipeIndex],
      ...updatedRecipe,
      updatedAt: new Date().toISOString(),
    };

    await saveMyRecipes(currentRecipes);
    return currentRecipes[recipeIndex];
  } catch (e) {
    console.error('Error memperbarui resep:', e);
    throw e;
  }
};

/**
 * Menghapus resep buatan pengguna berdasarkan ID
 * @param {string} recipeId
 * @returns {Promise<boolean>}
 */
export const deleteMyRecipe = async (recipeId) => {
  try {
    const strId = String(recipeId);
    const currentRecipes = await getMyRecipes();
    const filteredRecipes = currentRecipes.filter(
      (r) => String(r.id) !== strId
    );
    await saveMyRecipes(filteredRecipes);

    // Hapus juga dari daftar favorit jika ada
    const favIds = await getFavoriteIds();
    if (favIds.includes(strId)) {
      const updatedFavs = favIds.filter((id) => id !== strId);
      await saveFavoriteIds(updatedFavs);
    }

    return true;
  } catch (e) {
    console.error('Error menghapus resep:', e);
    throw e;
  }
};

/**
 * Mengambil semua resep gabungan (resep bawaan + resep buatan pengguna)
 * @returns {Promise<Array>}
 */
export const getAllRecipes = async () => {
  try {
    const myRecipes = await getMyRecipes();
    return [...myRecipes, ...initialRecipes];
  } catch (e) {
    console.error('Error mengambil seluruh resep:', e);
    return initialRecipes;
  }
};

/**
 * Mencari satu resep berdasarkan ID (di resep pengguna maupun bawaan)
 * @param {string} recipeId
 * @returns {Promise<Object|null>}
 */
export const getRecipeById = async (recipeId) => {
  try {
    const strId = String(recipeId);
    const all = await getAllRecipes();
    const found = all.find((r) => String(r.id) === strId);
    return found || null;
  } catch (e) {
    console.error('Error mencari resep by ID:', e);
    return null;
  }
};

/**
 * Mengambil seluruh objek resep yang sedang difavoritkan
 * @returns {Promise<Array>}
 */
export const getFavoriteRecipes = async () => {
  try {
    const favIds = await getFavoriteIds();
    if (favIds.length === 0) return [];

    const all = await getAllRecipes();
    return all.filter((r) => favIds.includes(String(r.id)));
  } catch (e) {
    console.error('Error mengambil resep favorit:', e);
    return [];
  }
};
