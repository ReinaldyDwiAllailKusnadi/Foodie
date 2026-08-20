import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import {
  getMyRecipes,
  deleteMyRecipe,
  getFavoriteIds,
  toggleFavorite,
} from '../storage/storage';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const MyRecipesScreen = ({ navigation }) => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [recipes, favIds] = await Promise.all([
        getMyRecipes(),
        getFavoriteIds(),
      ]);
      setMyRecipes(recipes);
      setFavoriteIds(favIds);
    } catch (error) {
      console.error('Error memuat data di MyRecipesScreen:', error);
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

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus resep "${recipe.name}"? Data yang sudah dihapus tidak dapat dipulihkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMyRecipe(recipe.id);
              setMyRecipes((prev) =>
                prev.filter((r) => String(r.id) !== String(recipe.id))
              );
              Alert.alert('Sukses', 'Resep berhasil dihapus.');
            } catch (error) {
              console.error('Gagal menghapus resep:', error);
              Alert.alert('Error', 'Gagal menghapus resep.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isFav = favoriteIds.includes(String(item.id));
    return (
      <RecipeCard
        recipe={item}
        isFavorite={isFav}
        onToggleFavorite={() => handleToggleFavorite(item.id)}
        onPress={() =>
          navigation.navigate('RecipeDetail', { recipeId: item.id })
        }
        showActions={true}
        onEdit={() =>
          navigation.navigate('EditRecipe', { recipeId: item.id })
        }
        onDelete={() => handleDeleteRecipe(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <CustomHeader
        title="Makanan Saya"
        subtitle={`${myRecipes.length} resep kreasi Anda`}
        rightComponent={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddRecipe')}
            style={styles.headerAddBtn}
            accessibilityRole="button"
            accessibilityLabel="Tambah Resep Baru"
          >
            <Ionicons name="add" size={20} color={colors.textWhite} />
            <Text style={styles.headerAddText}>Resep</Text>
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat resep Anda...</Text>
        </View>
      ) : (
        <FlatList
          data={myRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            myRecipes.length > 0 ? (
              <View style={styles.bannerContainer}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Punya Kreasi Baru?</Text>
                  <Text style={styles.bannerSubtitle}>
                    Bagikan dan simpan racikan bumbu rahasiamu.
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('AddRecipe')}
                  style={styles.bannerBtn}
                >
                  <Ionicons name="add-circle" size={18} color={colors.primary} />
                  <Text style={styles.bannerBtnText}>Tambah</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="Belum Ada Resep Sendiri"
              description="Anda belum menambahkan resep buatan Anda. Mulai kreasikan resep favorit dan simpan di sini!"
              buttonTitle="+ Tambahkan Resep Baru"
              onButtonPress={() => navigation.navigate('AddRecipe')}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    gap: 4,
    ...shadows.sm,
  },
  headerAddText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  bannerContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    gap: 4,
    ...shadows.sm,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default MyRecipesScreen;
