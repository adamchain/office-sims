import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Plus, FileText, Folder, StickyNote, X } from 'lucide-react-native';
import { router } from 'expo-router';
import AddItemModal from '@/components/AddItemModal';

export default function AddScreen() {
  const [showAddModal, setShowAddModal] = useState(true); // Start with modal open

  const handleClose = () => {
    setShowAddModal(false);
    // Navigate back to desk when modal closes
    router.replace('/');
  };

  const handleAddFile = (name: string, type: string) => {
    // This will be handled by the modal and passed to DeskScene
    setShowAddModal(false);
    router.replace('/');
  };

  const handleAddFolder = (name: string) => {
    // This will be handled by the modal and passed to DeskScene
    setShowAddModal(false);
    router.replace('/');
  };

  const handleAddStickyNote = () => {
    // Navigate back to desk and trigger sticky note creation
    setShowAddModal(false);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Plus size={64} color="#8B4513" />
        <Text style={styles.title}>Add New Item</Text>
        <Text style={styles.subtitle}>Choose what you'd like to add to your desk</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowAddModal(true)}
          >
            <FileText size={32} color="#8B4513" />
            <Text style={styles.optionText}>File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowAddModal(true)}
          >
            <Folder size={32} color="#8B4513" />
            <Text style={styles.optionText}>Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleAddStickyNote}
          >
            <StickyNote size={32} color="#8B4513" />
            <Text style={styles.optionText}>Sticky Note</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddItemModal
        visible={showAddModal}
        onClose={handleClose}
        onAddFile={handleAddFile}
        onAddFolder={handleAddFolder}
        onAddStickyNote={handleAddStickyNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
  },
  optionButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
});