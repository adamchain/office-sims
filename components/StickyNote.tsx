import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, PanResponder, Animated } from 'react-native';
import { X, Trash2, Palette } from 'lucide-react-native';
import type { StickyNoteData } from './DeskScene';
import React, { useState } from 'react';

interface StickyNoteProps {
  note: StickyNoteData;
  onUpdate: (id: string, updates: Partial<StickyNoteData>) => void;
  onDelete: (id: string) => void;
}

const colorMap = {
  urgent: '#FF6B6B',
  normal: '#FFE66D',
  low: '#4ECDC4',
};

export default function StickyNote({ note, onUpdate, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [editColor, setEditColor] = useState(note.color);

  const pan = new Animated.ValueXY({ x: note.x, y: note.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
      const newX = Math.max(0, Math.min(300, pan.x._value));
      const newY = Math.max(50, Math.min(600, pan.y._value));
      onUpdate(note.id, { x: newX, y: newY });
    },
  });

  const handleSave = () => {
    onUpdate(note.id, { text: editText, color: editColor });
    setIsEditing(false);
  };

  const colors: Array<{ key: 'urgent' | 'normal' | 'low'; color: string; label: string }> = [
    { key: 'urgent', color: '#FF6B6B', label: 'Urgent' },
    { key: 'normal', color: '#FFE66D', label: 'Normal' },
    { key: 'low', color: '#4ECDC4', label: 'Low Priority' },
  ];

  return (
    <>
      <Animated.View
        style={[
          styles.stickyNote,
          {
            backgroundColor: colorMap[note.color],
            transform: pan.getTranslateTransform(),
            zIndex: note.zIndex,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.noteText} numberOfLines={4}>
            {note.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colorMap[editColor] }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Sticky Note</Text>
              <TouchableOpacity onPress={() => onDelete(note.id)}>
                <Trash2 size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.colorPicker}>
              <View style={styles.colorPickerHeader}>
                <Palette size={20} color="#333" />
                <Text style={styles.colorPickerTitle}>Color</Text>
              </View>
              <View style={styles.colorOptions}>
                {colors.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.key}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.color },
                      editColor === colorOption.key && styles.selectedColor,
                    ]}
                    onPress={() => setEditColor(colorOption.key)}
                  >
                    <Text style={styles.colorLabel}>{colorOption.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              placeholder="Enter your note..."
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  stickyNote: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ rotate: '2deg' }],
  },
  noteContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  noteText: {
    fontSize: 9,
    color: '#333',
    textAlign: 'center',
    lineHeight: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  colorPicker: {
    marginBottom: 20,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  colorLabel: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});