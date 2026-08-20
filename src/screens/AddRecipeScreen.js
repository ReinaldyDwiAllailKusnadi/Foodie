import React, { useState } from 'react';
import {
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
import { addMyRecipe } from '../storage/storage';
import { colors, borderRadius, spacing, shadows } from '../styles/theme';

const AddRecipeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Indonesian');
  const [imageUri, setImageUri] = useState('');
  const [prepTime, setPrepTime] = useState('20 menit');
  const [servings, setServings] = useState('2');
  const [calories, setCalories] = useState('350');
  const [difficulty, setDifficulty] = useState('Mudah');

  // Dynamic inputs
  const [ingredients, setIngredients] = useState(['', '']);
  const [instructions, setInstructions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories for selection (excluding 'All')
  const formCategories = categories.filter((c) => c.id !== 'all');
  const difficultyLevels = ['Mudah', 'Sedang', 'Sulit'];

  // Image Picker Handler
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
      Alert.alert('Error', 'Gagal membuka galeri gambar.');
    }
  };

  // Preset Image URLs for quick testing
  const handleUsePresetImage = () => {
    const presets = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80',
    ];
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    setImageUri(randomPreset);
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

  // Submit Form Handler
  const handleSubmit = async () => {
    // Validasi
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
      const newRecipeData = {
        name: name.trim(),
        category,
        image: imageUri,
        prepTime: prepTime.trim() || '20 menit',
        servings: parseInt(servings, 10) || 2,
        calories: parseInt(calories, 10) || 350,
        difficulty,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
      };

      await addMyRecipe(newRecipeData);
      Alert.alert('Sukses', 'Resep baru berhasil disimpan ke Makanan Saya!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Gagal menyimpan resep baru:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan resep.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <CustomHeader
        title="Tambah Resep Baru"
        subtitle="Buat dan simpan kreasi masakan Anda"
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
              <View style={styles.uploadArea}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.uploadBox}
                  onPress={handlePickImage}
                >
                  <Ionicons name="image-outline" size={40} color={colors.primary} />
                  <Text style={styles.uploadText}>Pilih Foto dari Galeri</Text>
                  <Text style={styles.uploadHint}>Mendukung JPG, PNG, WEBP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.presetLinkBtn}
                  onPress={handleUsePresetImage}
                >
                  <Ionicons name="sparkles" size={14} color={colors.primary} />
                  <Text style={styles.presetLinkText}>
                    Gunakan Foto Contoh Otomatis
                  </Text>
                </TouchableOpacity>
              </View>
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
                placeholder="Contoh: Soto Ayam Lamongan Spesial"
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
                <Text style={styles.fieldLabel}>Porsi (Orang)</Text>
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
            <Text style={styles.dynamicHint}>
              Tuliskan bahan beserta takarannya satu per satu.
            </Text>

            {ingredients.map((item, index) => (
              <View key={index} style={styles.dynamicRow}>
                <Text style={styles.rowNumber}>{index + 1}.</Text>
                <TextInput
                  style={[styles.textInput, styles.dynamicInput]}
                  placeholder={`Bahan ke-${index + 1} (cth: 2 siung bawang putih)`}
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
            <Text style={styles.dynamicHint}>
              Tuliskan instruksi langkah demi langkah secara berurutan.
            </Text>

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

          {/* Tombol Simpan Resep */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <Ionicons name="checkmark-circle" size={22} color={colors.textWhite} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Resep'}
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
  uploadArea: {
    alignItems: 'center',
  },
  uploadBox: {
    width: '100%',
    height: 160,
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
  uploadHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  presetLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    padding: 6,
  },
  presetLinkText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
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
  dynamicHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
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

export default AddRecipeScreen;
