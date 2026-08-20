import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CategoryList from '../components/CategoryList';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import { categories } from '../data/categories';
import {
  getAllRecipes,
  getFavoriteIds,
  toggleFavorite,
} from '../storage/storage';
import { colors, spacing, borderRadius } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data ketika screen aktif / focus
  const loadData = async () => {
    try {
      const [allRecipes, favIds] = await Promise.all([
        getAllRecipes(),
        getFavoriteIds(),
      ]);
      setRecipes(allRecipes);
      setFavoriteIds(favIds);
    } catch (error) {
      console.error('Error memuat data di HomeScreen:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Filter resep berdasarkan kategori dan search query
  useEffect(() => {
    let result = [...recipes];

    // Filter kategori
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      result = result.filter(
        (recipe) =>
          recipe.category &&
          recipe.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter pencarian
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.category?.toLowerCase().includes(query) ||
          recipe.ingredients?.some((ing) => ing.toLowerCase().includes(query))
      );
    }

    setFilteredRecipes(result);
  }, [selectedCategory, searchQuery, recipes]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      const isNowFav = await toggleFavorite(recipeId);
      const strId = String(recipeId);
      if (isNowFav) {
        setFavoriteIds((prev) => [...prev, strId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== strId));
      }
    } catch (error) {
      console.error('Gagal mengubah status favorit:', error);
    }
  };

  const renderRecipeItem = ({ item }) => {
    const isFav = favoriteIds.includes(String(item.id));
    return (
      <RecipeCard
        recipe={item}
        isFavorite={isFav}
        onToggleFavorite={() => handleToggleFavorite(item.id)}
        onPress={() =>
          navigation.navigate('RecipeDetail', { recipeId: item.id })
        }
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Brand Header */}
      <View style={styles.brandRow}>
        <View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandName}>Foodie</Text>
            <View style={styles.brandDot} />
          </View>
          <Text style={styles.brandSubtitle}>
            Temukan & masak resep lezat setiap hari
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addQuickBtn}
          onPress={() => navigation.navigate('AddRecipe')}
          accessibilityRole="button"
          accessibilityLabel="Tambah Resep Baru"
        >
          <Ionicons name="add" size={22} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Cari resep, bahan, atau kategori..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearBtn}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Kategori */}
      <View style={styles.categorySection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Kategori Pilihan</Text>
          <Text style={styles.categoryCount}>{categories.length} Kategori</Text>
        </View>

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => setSelectedCategory(catName)}
        />
      </View>

      {/* Section Header Resep */}
      <View style={styles.recipesSectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All'
            ? 'Semua Resep'
            : `Resep ${selectedCategory}`}
        </Text>
        <Text style={styles.recipesCount}>
          {filteredRecipes.length} Resep ditemukan
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat aneka resep...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Resep Tidak Ditemukan"
              description={`Tidak ada resep yang cocok dengan "${
                searchQuery || selectedCategory
              }". Coba gunakan kata kunci lain.`}
              buttonTitle="Reset Filter"
              onButtonPress={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
    marginLeft: 3,
    marginTop: 8,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addQuickBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  categorySection: {
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  recipesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  recipesCount: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default HomeScreen;
