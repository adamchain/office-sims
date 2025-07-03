import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
});