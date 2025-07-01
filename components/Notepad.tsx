import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { X, Save } from 'lucide-react-native';

export default function Notepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('Welcome to your desk!\n\nTap items to interact:\n• Yellow notepad for daily notes\n• Sticky notes for quick reminders\n• Manila folder for quick access files\n• File cabinet for long-term storage\n• Pen to add new sticky notes');

  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.notepad} onPress={() => setIsOpen(true)}>
        <View style={styles.notepadSpiral}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.spiralHole} />
          ))}
        </View>
        <View style={styles.notepadContent}>
          <Text style={styles.notepadText} numberOfLines={6}>
            {notes}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Daily Notes</Text>
            <TouchableOpacity onPress={handleSave}>
              <Save size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.textInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Write your daily notes here..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  notepad: {
    width: 140,
    height: 180,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ rotate: '-3deg' }],
  },
  notepadSpiral: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  spiralHole: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6C200',
    borderWidth: 1,
    borderColor: '#CCA000',
  },
  notepadContent: {
    flex: 1,
    padding: 12,
  },
  notepadText: {
    fontSize: 10,
    color: '#333',
    lineHeight: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6C200',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 400,
  },
});