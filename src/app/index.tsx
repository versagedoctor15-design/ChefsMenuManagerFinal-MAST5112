import { useState } from 'react';
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

export default function App() {
  // Form state
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  // Menu items list
  const [menuItems, setMenuItems] = useState([]);

  // Course options
  const courses = ['Starter', 'Main Course', 'Dessert', 'Drink'];

  // Validation + Add Item
  const handleAddItem = () => {
    // Required field validation
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'Please enter a Dish Name.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a Description.');
      return;
    }
    if (!course) {
      Alert.alert('Validation Error', 'Please select a Course.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter a Price.');
      return;
    }

    // Price must be a valid number
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    // Create new item
    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: priceValue.toFixed(2),
    };

    // Add to list (this automatically updates the display)
    setMenuItems((prev) => [...prev, newItem]);

    // Clear form
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');

    // Success confirmation
    Alert.alert('Success', `${newItem.dishName} has been added to the menu!`);
  };

  // Render each menu item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.dishName}</Text>
      <Text style={styles.cardCourse}>{item.course}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardPrice}>R {item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ===== APPLICATION TITLE ===== */}
          <Text style={styles.appTitle}>Chef's Menu Manager</Text>
          <Text style={styles.subtitle}>Add & View Menu Items</Text>

          {/* ===== FORM SECTION ===== */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Add New Menu Item</Text>

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
              {courses.map((c) => (
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

            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add Menu Item</Text>
            </TouchableOpacity>
          </View>

          {/* ===== MENU LIST SECTION ===== */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              Current Menu ({menuItems.length})
            </Text>

            {menuItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No menu items have been added yet.
                </Text>
                <Text style={styles.emptySubText}>
                  Use the form above to add your first dish.
                </Text>
              </View>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false} // because we are inside ScrollView
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
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 25,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 5,
  },
  courseButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  courseButtonSelected: {
    backgroundColor: '#2b6cb0',
    borderColor: '#2b6cb0',
  },
  courseButtonText: {
    fontSize: 14,
    color: '#4a5568',
  },
  courseButtonTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2b6cb0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
  },
  cardCourse: {
    fontSize: 13,
    color: '#2b6cb0',
    fontWeight: '600',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 6,
    lineHeight: 20,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f855a',
    marginTop: 8,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 6,
  },
});