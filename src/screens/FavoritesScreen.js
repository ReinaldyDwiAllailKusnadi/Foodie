import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import { getFavoriteRecipes, toggleFavorite } from '../storage/storage';
import { colors, spacing } from '../styles/theme';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      const favList = await getFavoriteRecipes();
      setFavorites(favList);
    } catch (error) {
      console.error('Error memuat resep favorit:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      await toggleFavorite(recipeId);
      // Update list lokal dengan menghapus resep yang di-unfavorite
      setFavorites((prev) =>
        prev.filter((item) => String(item.id) !== String(recipeId))
      );
    } catch (error) {
      console.error('Gagal menghapus favorit:', error);
    }
  };

  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      isFavorite={true}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      onPress={() =>
        navigation.navigate('RecipeDetail', { recipeId: item.id })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <CustomHeader
        title="Resep Favorit"
        subtitle={`${favorites.length} resep tersimpan`}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat favorit...</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="heart-dislike-outline"
              title="Belum Ada Favorit"
              description="Tandai resep lezat yang Anda sukai dengan menekan ikon hati agar mudah ditemukan di sini."
              buttonTitle="Jelajahi Resep"
              onButtonPress={() => navigation.navigate('Home')}
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
});

export default FavoritesScreen;
