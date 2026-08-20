import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CategoryItem from './CategoryItem';
import { spacing } from '../styles/theme';

const CategoryList = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
}) => {
  const renderItem = ({ item }) => (
    <CategoryItem
      category={item}
      isSelected={selectedCategory.toLowerCase() === item.name.toLowerCase()}
      onSelect={onSelectCategory}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
});

export default CategoryList;
