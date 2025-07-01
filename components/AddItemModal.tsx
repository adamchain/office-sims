import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X, FileText, Folder, Plus } from 'lucide-react-native';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFile: (name: string, type: string) => void;
  onAddFolder: (name: string) => void;
}

export default function AddItemModal({ visible, onClose, onAddFile, onAddFolder }: AddItemModalProps) {
  const [mode, setMode] = useState<'select' | 'file' | 'folder'>('select');
  const [name, setName] = useState('');
  const [fileType, setFileType] = useState('Document');

  const fileTypes = [
    { label: 'Document', extension: '.docx', type: 'Word Document' },
    { label: 'PDF', extension: '.pdf', type: 'PDF Document' },
    { label: 'Spreadsheet', extension: '.xlsx', type: 'Excel File' },
    { label: 'Presentation', extension: '.pptx', type: 'PowerPoint' },
    { label: 'Text File', extension: '.txt', type: 'Text Document' },
  ];

  const handleAddFile = () => {
    if (name.trim()) {
      const selectedType = fileTypes.find(type => type.label === fileType);
      const fileName = name.trim() + (selectedType?.extension || '.txt');
      onAddFile(fileName, selectedType?.type || 'Document');
      resetModal();
    }
  };

  const handleAddFolder = () => {
    if (name.trim()) {
      onAddFolder(name.trim());
      resetModal();
    }
  };

  const resetModal = () => {
    setMode('select');
    setName('');
    setFileType('Document');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={resetModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={resetModal}>
              <X size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {mode === 'select' ? 'Add New Item' : mode === 'file' ? 'New File' : 'New Folder'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {mode === 'select' && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setMode('file')}
              >
                <FileText size={32} color="#8B4513" />
                <Text style={styles.optionText}>Create File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setMode('folder')}
              >
                <Folder size={32} color="#8B4513" />
                <Text style={styles.optionText}>Create Folder</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'file' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>File Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter file name..."
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>File Type</Text>
              <View style={styles.typeContainer}>
                {fileTypes.map((type) => (
                  <TouchableOpacity
                    key={type.label}
                    style={[
                      styles.typeButton,
                      fileType === type.label && styles.selectedType,
                    ]}
                    onPress={() => setFileType(type.label)}
                  >
                    <Text style={[
                      styles.typeText,
                      fileType === type.label && styles.selectedTypeText,
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.createButton, !name.trim() && styles.disabledButton]}
                onPress={handleAddFile}
                disabled={!name.trim()}
              >
                <Plus size={20} color="#FFF" />
                <Text style={styles.createButtonText}>Create File</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'folder' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Folder Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter folder name..."
                placeholderTextColor="#666"
              />

              <TouchableOpacity
                style={[styles.createButton, !name.trim() && styles.disabledButton]}
                onPress={handleAddFolder}
                disabled={!name.trim()}
              >
                <Plus size={20} color="#FFF" />
                <Text style={styles.createButtonText}>Create Folder</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  optionButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    minWidth: 120,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  formContainer: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedType: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: '#FFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});