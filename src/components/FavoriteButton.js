import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../styles/theme';

const FavoriteButton = ({
  isFavorite = false,
  onPress,
  size = 22,
  activeColor = colors.heart,
  inactiveColor = colors.textSecondary,
  style,
  hasBackground = true,
  bgVariant = 'glass', // 'glass', 'solid', 'transparent'
}) => {
  const getContainerStyle = () => {
    if (!hasBackground) return styles.noBg;
    if (bgVariant === 'solid') return styles.solidBg;
    if (bgVariant === 'heartBg') return styles.heartPillBg;
    return styles.glassBg;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, getContainerStyle(), style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? activeColor : inactiveColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBg: {
    backgroundColor: 'transparent',
  },
  glassBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...shadows.sm,
  },
  solidBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  heartPillBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.heartBg,
  },
});

export default FavoriteButton;
