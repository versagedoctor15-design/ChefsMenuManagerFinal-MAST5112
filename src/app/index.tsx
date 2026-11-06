import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
}

const COURSES = ['Starter', 'Main Course', 'Dessert', 'Drink'];

export default function App() {
  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data & filters
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState<string | null>(null);

  // ===== Validation =====
  const validateForm = () => {
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'Please enter a Dish Name.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a Description.');
      return false;
    }
    if (!course) {
      Alert.alert('Validation Error', 'Please select a Course.');
      return false;
    }
    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter a Price.');
      return false;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return false;
    }
    return true;
  };

  // ===== Add or Update =====
  const handleSaveItem = () => {
    if (!validateForm()) return;

    const priceValue = parseFloat(price).toFixed(2);

    if (editingId) {
      // Update existing
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                dishName: dishName.trim(),
                description: description.trim(),
                course,
                price: priceValue,
              }
            : item
        )
      );
      Alert.alert('Success', 'Menu item updated successfully!');
    } else {
      // Add new
      const newItem: MenuItem = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course,
        price: priceValue,
      };
      setMenuItems((prev) => [...prev, newItem]);
      Alert.alert('Success', `${newItem.dishName} has been added to the menu!`);
    }

    resetForm();
  };

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
  };

  // ===== Edit =====
  const handleEdit = (item: MenuItem) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
  };

  // ===== Delete =====
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
            Alert.alert('Deleted', `"${name}" has been removed.`);
          },
        },
      ]
    );
  };

  // ===== Filtered list =====
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.dishName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCourse = filterCourse ? item.course === filterCourse : true;
      return matchesSearch && matchesCourse;
    });
  }, [menuItems, searchQuery, filterCourse]);

  // ===== Statistics =====
  const stats = useMemo(() => {
    const total = menuItems.length;
    const average =
      total === 0
        ? 0
        : menuItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / total;

    const byCourse: Record<string, number> = {};
    COURSES.forEach((c) => {
      byCourse[c] = menuItems.filter((item) => item.course === c).length;
    });

    return { total, average, byCourse };
  }, [menuItems]);

  // ===== Render Item =====
  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.dishName}</Text>
        <Text style={styles.cardPrice}>R {item.price}</Text>
      </View>
      <Text style={styles.cardCourse}>{item.course}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id, item.dishName)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* ===== HEADER ===== */}
          <Text style={styles.appTitle}>Chef's Menu Manager</Text>
          <Text style={styles.subtitle}>Final Version – Full Management</Text>

          {/* ===== STATISTICS ===== */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Menu Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>R {stats.average.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Avg Price</Text>
              </View>
            </View>
            <View style={styles.courseStats}>
              {COURSES.map((c) => (
                <Text key={c} style={styles.courseStatText}>
                  {c}: <Text style={{ fontWeight: '700' }}>{stats.byCourse[c]}</Text>
                </Text>
              ))}
            </View>
          </View>

          {/* ===== FORM ===== */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>
              {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
            </Text>

            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grilled Salmon"
              value={dishName}
              onChangeText={setDishName}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Short description of the dish"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Course *</Text>
            <View style={styles.courseContainer}>
              {COURSES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courseButton,
                    course === c && styles.courseButtonSelected,
                  ]}
                  onPress={() => setCourse(c)}
                >
                  <Text
                    style={[
                      styles.courseButtonText,
                      course === c && styles.courseButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Price (R) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 149.99"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Item' : 'Add Menu Item'}
                </Text>
              </TouchableOpacity>

              {editingId && (
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ===== SEARCH & FILTER ===== */}
          <View style={styles.filterContainer}>
            <Text style={styles.sectionTitle}>Search & Filter</Text>

            <TextInput
              style={styles.input}
              placeholder="Search by dish name..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.courseContainer}>
              <TouchableOpacity
                style={[
                  styles.courseButton,
                  filterCourse === null && styles.courseButtonSelected,
                ]}
                onPress={() => setFilterCourse(null)}
              >
                <Text
                  style={[
                    styles.courseButtonText,
                    filterCourse === null && styles.courseButtonTextSelected,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {COURSES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courseButton,
                    filterCourse === c && styles.courseButtonSelected,
                  ]}
                  onPress={() => setFilterCourse(c)}
                >
                  <Text
                    style={[
                      styles.courseButtonText,
                      filterCourse === c && styles.courseButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ===== MENU LIST ===== */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              Menu Items ({filteredItems.length})
            </Text>

            {filteredItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {menuItems.length === 0
                    ? 'No menu items have been added yet.'
                    : 'No items match your search/filter.'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 12,
  },
  // Stats
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ebf8ff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  statLabel: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 4,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  courseStatText: {
    fontSize: 13,
    color: '#4a5568',
  },
  // Form
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 5,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2d3748',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  courseButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#edf2f7',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  courseButtonSelected: {
    backgroundColor: '#2b6cb0',
    borderColor: '#2b6cb0',
  },
  courseButtonText: {
    fontSize: 13,
    color: '#4a5568',
  },
  courseButtonTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  formButtons: {
    marginTop: 16,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4a5568',
    fontSize: 15,
    fontWeight: '600',
  },
  // Filter
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  // List
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2b6cb0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f855a',
  },
  cardCourse: {
    fontSize: 12,
    color: '#2b6cb0',
    fontWeight: '600',
    marginTop: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#4a5568',
    marginTop: 6,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#4299e1',
  },
  deleteBtn: {
    backgroundColor: '#e53e3e',
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
  },
});
