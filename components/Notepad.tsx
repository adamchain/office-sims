import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, PanResponder, Animated, Alert } from 'react-native';
import { X, Save, Scissors } from 'lucide-react-native';
import type { NotepadData } from './DeskScene';

interface NotepadProps {
  notepad: NotepadData;
  onUpdate: (updates: Partial<NotepadData>) => void;
  onTearPage: (text: string) => void;
}

export default function Notepad({ notepad, onUpdate, onTearPage }: NotepadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(notepad.notes);

  const pan = new Animated.ValueXY({ x: notepad.x, y: notepad.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: (pan.x as any).__getValue(),
        y: (pan.y as any).__getValue(),
      });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
      const newX = Math.max(0, Math.min(300, (pan.x as any).__getValue()));
      const newY = Math.max(50, Math.min(600, (pan.y as any).__getValue()));
      onUpdate({ x: newX, y: newY });
    },
  });

  const handleSave = () => {
    onUpdate({ notes });
    setIsOpen(false);
  };

  const handleTearPage = () => {
    if (notes.trim()) {
      // Take the first few lines or a portion of the notes for the torn page
      const lines = notes.split('\n');
      const pageContent = lines.slice(0, Math.min(lines.length, 6)).join('\n');
      
      if (pageContent.trim()) {
        onTearPage(pageContent);
        
        // Remove the torn content from the notepad
        const remainingContent = lines.slice(6).join('\n');
        setNotes(remainingContent);
        onUpdate({ notes: remainingContent });
        
        Alert.alert('Page Torn', 'A page has been torn from the notepad and can now be moved independently!');
      }
    } else {
      Alert.alert('Empty Page', 'Write something on the notepad before tearing a page!');
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.notepadContainer,
          {
            transform: pan.getTranslateTransform(),
            zIndex: notepad.zIndex,
          },
        ]}
        {...panResponder.panHandlers}
      >
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
      </Animated.View>

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
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleTearPage} style={styles.tearButton}>
                <Scissors size={20} color="#FF6B6B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Save size={24} color="#FFD700" />
              </TouchableOpacity>
            </View>
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
  notepadContainer: {
    position: 'absolute',
    width: 140,
    height: 180,
  },
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  saveButton: {
    padding: 8,
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