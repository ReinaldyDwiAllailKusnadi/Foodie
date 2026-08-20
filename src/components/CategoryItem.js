import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const CategoryItem = ({ category, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onSelect(category.name)}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <View
        style={[
          styles.iconWrapper,
          isSelected ? styles.selectedIconWrapper : styles.unselectedIconWrapper,
        ]}
      >
        <MaterialCommunityIcons
          name={category.icon || 'food'}
          size={18}
          color={isSelected ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text
        style={[
          styles.title,
          isSelected ? styles.selectedTitle : styles.unselectedTitle,
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  selectedContainer: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  unselectedContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedIconWrapper: {
    backgroundColor: colors.surface,
  },
  unselectedIconWrapper: {
    backgroundColor: colors.borderLight,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedTitle: {
    color: colors.textWhite,
  },
  unselectedTitle: {
    color: colors.text,
  },
});

export default CategoryItem;
