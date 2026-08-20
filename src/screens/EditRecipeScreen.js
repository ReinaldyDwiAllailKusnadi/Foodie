import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import { categories } from '../data/categories';
import { getRecipeById, updateMyRecipe } from '../storage/storage';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const EditRecipeScreen = ({ route, navigation }) => {
  const { recipeId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Indonesian');
  const [imageUri, setImageUri] = useState('');
  const [prepTime, setPrepTime] = useState('20 menit');
  const [servings, setServings] = useState('2');
  const [calories, setCalories] = useState('350');
  const [difficulty, setDifficulty] = useState('Mudah');

  // Dynamic inputs
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formCategories = categories.filter((c) => c.id !== 'all');
  const difficultyLevels = ['Mudah', 'Sedang', 'Sulit'];

  useEffect(() => {
    loadExistingRecipe();
  }, [recipeId]);

  const loadExistingRecipe = async () => {
    try {
      if (!recipeId) return;
      const data = await getRecipeById(recipeId);
      if (data) {
        setName(data.name || '');
        setCategory(data.category || 'Indonesian');
        setImageUri(data.image || '');
        setPrepTime(data.prepTime || '20 menit');
        setServings(String(data.servings || '2'));
        setCalories(String(data.calories || '350'));
        setDifficulty(data.difficulty || 'Mudah');
        setIngredients(
          data.ingredients && data.ingredients.length > 0
            ? [...data.ingredients]
            : ['']
        );
        setInstructions(
          data.instructions && data.instructions.length > 0
            ? [...data.instructions]
            : ['']
        );
      } else {
        Alert.alert('Error', 'Data resep tidak ditemukan.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error memuat resep untuk diedit:', error);
      Alert.alert('Error', 'Gagal memuat resep.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Izin Ditolak',
          'Izin akses galeri foto diperlukan untuk memilih gambar resep.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error memilih gambar:', error);
      Alert.alert('Error', 'Gagal membuka galeri foto.');
    }
  };

  // Ingredients Handlers
  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, '']);
  };

  const handleUpdateIngredient = (text, index) => {
    const updated = [...ingredients];
    updated[index] = text;
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length <= 1) {
      Alert.alert('Perhatian', 'Resep membutuhkan minimal 1 bahan.');
      return;
    }
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Instructions Handlers
  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, '']);
  };

  const handleUpdateInstruction = (text, index) => {
    const updated = [...instructions];
    updated[index] = text;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index) => {
    if (instructions.length <= 1) {
      Alert.alert('Perhatian', 'Resep membutuhkan minimal 1 langkah instruksi.');
      return;
    }
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update Submit Handler
  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validasi Gagal', 'Nama resep wajib diisi.');
      return;
    }

    if (!imageUri) {
      Alert.alert('Validasi Gagal', 'Silakan pilih gambar untuk resep Anda.');
      return;
    }

    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (cleanIngredients.length === 0) {
      Alert.alert('Validasi Gagal', 'Masukkan minimal satu bahan masakan.');
      return;
    }

    const cleanInstructions = instructions.map((i) => i.trim()).filter(Boolean);
    if (cleanInstructions.length === 0) {
      Alert.alert('Validasi Gagal', 'Masukkan minimal satu langkah memasak.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedRecipeData = {
        id: recipeId,
        name: name.trim(),
        category,
        image: imageUri,
        prepTime: prepTime.trim() || '20 menit',
        servings: parseInt(servings, 10) || 2,
        calories: parseInt(calories, 10) || 350,
        difficulty,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
        isCustom: true,
      };

      await updateMyRecipe(updatedRecipeData);
      Alert.alert('Sukses', 'Perubahan resep berhasil disimpan!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Gagal memperbarui resep:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memperbarui resep.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat data resep...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <CustomHeader
        title="Edit Resep"
        subtitle="Perbarui data resep masakan Anda"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Section: Upload Gambar */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Foto Resep Makanan *</Text>
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.changeImageBtn}
                  onPress={handlePickImage}
                >
                  <Ionicons name="camera" size={16} color={colors.textWhite} />
                  <Text style={styles.changeImageText}>Ganti Foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.uploadBox}
                onPress={handlePickImage}
              >
                <Ionicons name="image-outline" size={40} color={colors.primary} />
                <Text style={styles.uploadText}>Pilih Foto dari Galeri</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Section: Informasi Dasar */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Informasi Dasar</Text>

            {/* Nama Resep */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Nama Resep *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nama resep masakan"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Kategori */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Kategori Makanan *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsScroll}
              >
                {formCategories.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.7}
                      onPress={() => setCategory(cat.name)}
                      style={[
                        styles.catPill,
                        isSelected && styles.catPillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextSelected,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Tingkat Kesulitan */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Tingkat Kesulitan</Text>
              <View style={styles.difficultyRow}>
                {difficultyLevels.map((lvl) => {
                  const isSelected = difficulty === lvl;
                  return (
                    <TouchableOpacity
                      key={lvl}
                      activeOpacity={0.7}
                      onPress={() => setDifficulty(lvl)}
                      style={[
                        styles.diffPill,
                        isSelected && styles.diffPillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.diffPillText,
                          isSelected && styles.diffPillTextSelected,
                        ]}
                      >
                        {lvl}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Grid Detail: Waktu, Porsi, Kalori */}
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Waktu Masak</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="20 menit"
                  placeholderTextColor={colors.textLight}
                  value={prepTime}
                  onChangeText={setPrepTime}
                />
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Porsi</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="2"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                  value={servings}
                  onChangeText={setServings}
                />
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Kalori (kkal)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="400"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                  value={calories}
                  onChangeText={setCalories}
                />
              </View>
            </View>
          </View>

          {/* Section: Bahan-Bahan Dinamis */}
          <View style={styles.sectionCard}>
            <View style={styles.dynamicHeader}>
              <Text style={styles.sectionLabel}>Daftar Bahan *</Text>
              <Text style={styles.badgeCount}>{ingredients.length} item</Text>
            </View>

            {ingredients.map((item, index) => (
              <View key={index} style={styles.dynamicRow}>
                <Text style={styles.rowNumber}>{index + 1}.</Text>
                <TextInput
                  style={[styles.textInput, styles.dynamicInput]}
                  placeholder={`Bahan ke-${index + 1}`}
                  placeholderTextColor={colors.textLight}
                  value={item}
                  onChangeText={(text) => handleUpdateIngredient(text, index)}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRemoveIngredient(index)}
                  style={styles.deleteRowBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddIngredient}
              style={styles.addDynamicBtn}
            >
              <Ionicons name="add-circle" size={18} color={colors.primary} />
              <Text style={styles.addDynamicText}>+ Tambah Bahan</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Langkah Instruksi Dinamis */}
          <View style={styles.sectionCard}>
            <View style={styles.dynamicHeader}>
              <Text style={styles.sectionLabel}>Langkah-Langkah Memasak *</Text>
              <Text style={styles.badgeCount}>{instructions.length} langkah</Text>
            </View>

            {instructions.map((step, index) => (
              <View key={index} style={styles.dynamicRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.dynamicInput, styles.multilineInput]}
                  placeholder={`Langkah ke-${index + 1}`}
                  placeholderTextColor={colors.textLight}
                  value={step}
                  onChangeText={(text) => handleUpdateInstruction(text, index)}
                  multiline
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRemoveInstruction(index)}
                  style={styles.deleteRowBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddInstruction}
              style={styles.addDynamicBtn}
            >
              <Ionicons name="add-circle" size={18} color={colors.primary} />
              <Text style={styles.addDynamicText}>+ Tambah Langkah</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Simpan Perubahan */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUpdate}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <Ionicons name="save-outline" size={22} color={colors.textWhite} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Menyimpan...' : 'Perbarui Resep'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  changeImageText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  uploadBox: {
    width: '100%',
    height: 140,
    borderWidth: 2,
    borderColor: '#FFCCBC',
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  categoryPillsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  catPillTextSelected: {
    color: colors.textWhite,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  diffPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  diffPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  diffPillTextSelected: {
    color: colors.textWhite,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCol: {
    flex: 1,
  },
  dynamicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 8,
  },
  rowNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 20,
  },
  stepNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  dynamicInput: {
    flex: 1,
  },
  multilineInput: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  deleteRowBtn: {
    padding: 6,
  },
  addDynamicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  addDynamicText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    ...shadows.floating,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditRecipeScreen;
