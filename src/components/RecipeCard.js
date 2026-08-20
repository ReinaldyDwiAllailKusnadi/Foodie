import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FavoriteButton from './FavoriteButton';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const RecipeCard = ({
  recipe,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'mudah':
      case 'easy':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'sedang':
      case 'medium':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'sulit':
      case 'hard':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const diffStyle = getDifficultyColor(recipe.difficulty);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Resep ${recipe.name}`}
    >
      {/* Gambar Resep */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              recipe.image ||
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge Kategori */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{recipe.category}</Text>
        </View>

        {/* Tombol Favorit */}
        <View style={styles.favoriteWrapper}>
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={onToggleFavorite}
            size={18}
          />
        </View>
      </View>

      {/* Konten Card */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.name}
        </Text>

        {/* Metadata info */}
        <View style={styles.metaRow}>
          {/* Prep Time */}
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.prepTime}</Text>
          </View>

          {/* Kalori jika ada */}
          {recipe.calories ? (
            <View style={styles.metaItem}>
              <Ionicons name="flame-outline" size={14} color={colors.primary} />
              <Text style={styles.metaText}>{recipe.calories} kkal</Text>
            </View>
          ) : null}

          {/* Difficulty Badge */}
          {recipe.difficulty ? (
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: diffStyle.bg },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: diffStyle.text },
                ]}
              >
                {recipe.difficulty}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Tombol Edit & Hapus jika pada halaman Makanan Saya */}
        {showActions && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onEdit}
              style={[styles.actionBtn, styles.editBtn]}
            >
              <Ionicons name="pencil" size={15} color={colors.primary} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDelete}
              style={[styles.actionBtn, styles.deleteBtn]}
            >
              <Ionicons name="trash-outline" size={15} color={colors.danger} />
              <Text style={styles.deleteBtnText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 190,
    backgroundColor: colors.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  favoriteWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 23,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
  },
  editBtn: {
    backgroundColor: colors.primaryLight,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteBtn: {
    backgroundColor: colors.dangerLight,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});

export default RecipeCard;
