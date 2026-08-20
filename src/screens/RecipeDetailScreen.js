import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FavoriteButton from '../components/FavoriteButton';
import {
  getRecipeById,
  isFavorite,
  toggleFavorite,
  deleteMyRecipe,
} from '../storage/storage';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipeId } = route.params || {};

  const [recipe, setRecipe] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    fetchRecipeData();
  }, [recipeId]);

  const fetchRecipeData = async () => {
    try {
      if (!recipeId) return;
      const [foundRecipe, favStatus] = await Promise.all([
        getRecipeById(recipeId),
        isFavorite(recipeId),
      ]);
      setRecipe(foundRecipe);
      setIsFav(favStatus);
    } catch (error) {
      console.error('Error memuat detail resep:', error);
      Alert.alert('Error', 'Gagal memuat informasi resep.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const newStatus = await toggleFavorite(recipeId);
      setIsFav(newStatus);
    } catch (error) {
      console.error('Gagal toggle favorit:', error);
      Alert.alert('Error', 'Gagal memperbarui status favorit.');
    }
  };

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Resep',
      `Apakah Anda yakin ingin menghapus resep "${recipe?.name}"? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMyRecipe(recipeId);
              Alert.alert('Berhasil', 'Resep berhasil dihapus.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus resep.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat resep...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={56}
            color={colors.danger}
          />
          <Text style={styles.errorTitle}>Resep Tidak Ditemukan</Text>
          <Text style={styles.errorSubtitle}>
            Resep mungkin telah dihapus atau tidak tersedia.
          </Text>
          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backHomeText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'mudah':
      case 'easy':
        return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'sedang':
      case 'medium':
        return { bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' };
      case 'sulit':
      case 'hard':
        return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const diffStyle = getDifficultyColor(recipe.difficulty);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                recipe.image ||
                'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />

          {/* Floating Navigation Controls */}
          <SafeAreaView style={styles.floatingNavSafe}>
            <View style={styles.navRow}>
              {/* Tombol Back */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}
                style={styles.navIconBtn}
                accessibilityRole="button"
                accessibilityLabel="Kembali"
              >
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </TouchableOpacity>

              {/* Action Buttons Right */}
              <View style={styles.rightNavActions}>
                {recipe.isCustom && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate('EditRecipe', { recipeId: recipe.id })
                      }
                      style={[styles.navIconBtn, styles.editIconBtn]}
                      accessibilityRole="button"
                      accessibilityLabel="Edit Resep"
                    >
                      <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleDelete}
                      style={[styles.navIconBtn, styles.deleteIconBtn]}
                      accessibilityRole="button"
                      accessibilityLabel="Hapus Resep"
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </>
                )}

                {/* Favorite Button */}
                <FavoriteButton
                  isFavorite={isFav}
                  onPress={handleToggleFavorite}
                  size={22}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Recipe Info Body */}
        <View style={styles.bodyCard}>
          {/* Category & Badge */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{recipe.category}</Text>
            </View>
            {recipe.isCustom && (
              <View style={styles.customBadge}>
                <Ionicons name="person" size={12} color={colors.primary} />
                <Text style={styles.customBadgeText}>Resep Saya</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.recipeTitle}>{recipe.name}</Text>

          {/* Key Metrics Row */}
          <View style={styles.metricsContainer}>
            {/* Prep Time */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconBg, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time" size={20} color="#FF9800" />
              </View>
              <Text style={styles.metricLabel}>Waktu</Text>
              <Text style={styles.metricValue}>{recipe.prepTime || '-'}</Text>
            </View>

            {/* Servings */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconBg, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="people" size={20} color="#0284C7" />
              </View>
              <Text style={styles.metricLabel}>Porsi</Text>
              <Text style={styles.metricValue}>
                {recipe.servings ? `${recipe.servings} Orang` : '-'}
              </Text>
            </View>

            {/* Calories */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconBg, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="flame" size={20} color={colors.danger} />
              </View>
              <Text style={styles.metricLabel}>Kalori</Text>
              <Text style={styles.metricValue}>
                {recipe.calories ? `${recipe.calories} kkal` : '-'}
              </Text>
            </View>

            {/* Difficulty */}
            <View style={styles.metricCard}>
              <View
                style={[
                  styles.metricIconBg,
                  { backgroundColor: diffStyle.bg },
                ]}
              >
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={20}
                  color={diffStyle.text}
                />
              </View>
              <Text style={styles.metricLabel}>Tingkat</Text>
              <Text
                style={[styles.metricValue, { color: diffStyle.text }]}
              >
                {recipe.difficulty || 'Mudah'}
              </Text>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons
                  name="basket-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Bahan-Bahan</Text>
              </View>
              <Text style={styles.itemsCount}>
                {recipe.ingredients?.length || 0} bahan
              </Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Ketuk bahan untuk menandai yang sudah disiapkan:
            </Text>

            <View style={styles.ingredientsList}>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((item, index) => {
                  const isChecked = !!checkedIngredients[index];
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => toggleIngredientCheck(index)}
                      style={[
                        styles.ingredientItem,
                        isChecked && styles.ingredientItemChecked,
                      ]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isChecked && styles.checkboxChecked,
                        ]}
                      >
                        {isChecked && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.textWhite}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.ingredientText,
                          isChecked && styles.ingredientTextChecked,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyItemsText}>
                  Tidak ada bahan yang dicantumkan.
                </Text>
              )}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons
                  name="restaurant-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>Langkah Memasak</Text>
              </View>
              <Text style={styles.itemsCount}>
                {recipe.instructions?.length || 0} langkah
              </Text>
            </View>

            <View style={styles.instructionsList}>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                  <View key={index} style={styles.instructionStep}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyItemsText}>
                  Tidak ada langkah instruksi yang dicantumkan.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  errorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  backHomeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: borderRadius.full,
  },
  backHomeText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  floatingNavSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  rightNavActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editIconBtn: {
    backgroundColor: colors.primaryLight,
  },
  deleteIconBtn: {
    backgroundColor: colors.dangerLight,
  },
  bodyCard: {
    marginTop: -28,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  categoryPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  customBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
    marginVertical: spacing.sm,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  itemsCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientItemChecked: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
    opacity: 0.85,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  ingredientText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  instructionsList: {
    marginTop: spacing.sm,
    gap: 14,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  emptyItemsText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});

export default RecipeDetailScreen;
