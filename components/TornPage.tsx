import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, PanResponder, Animated } from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import type { TornPageData } from './DeskScene';

interface TornPageProps {
  page: TornPageData;
  onUpdate: (id: string, updates: Partial<TornPageData>) => void;
  onDelete: (id: string) => void;
}

export default function TornPage({ page, onUpdate, onDelete }: TornPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(page.text);

  const pan = new Animated.ValueXY({ x: page.x, y: page.y });

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
      onUpdate(page.id, { x: newX, y: newY });
    },
  });

  const handleSave = () => {
    onUpdate(page.id, { text: editText });
    setIsEditing(false);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.pageContainer,
          {
            transform: pan.getTranslateTransform(),
            zIndex: page.zIndex,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.page}
          onPress={() => setIsEditing(true)}
        >
          {/* Torn edge effect */}
          <View style={styles.tornEdge} />
          <View style={styles.pageContent}>
            <Text style={styles.pageText} numberOfLines={8}>
              {page.text}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Page</Text>
              <TouchableOpacity onPress={() => onDelete(page.id)}>
                <Trash2 size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              placeholder="Write your notes here..."
              placeholderTextColor="#666"
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    position: 'absolute',
    width: 120,
    height: 160,
  },
  page: {
    flex: 1,
    backgroundColor: '#FFFACD',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ rotate: '1deg' }],
    position: 'relative',
  },
  tornEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#F0E68C',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    borderStyle: 'dashed',
  },
  pageContent: {
    flex: 1,
    padding: 8,
    paddingTop: 12,
  },
  pageText: {
    fontSize: 9,
    color: '#333',
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
    backgroundColor: '#FFFACD',
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
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#8B4513',
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