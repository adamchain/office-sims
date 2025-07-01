import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, File } from 'lucide-react-native';
import type { FileData } from './DeskScene';

interface FileModalProps {
  visible: boolean;
  title: string;
  files: FileData[];
  onClose: () => void;
}

export default function FileModal({ visible, title, files, onClose }: FileModalProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText size={24} color="#D2691E" />;
      default:
        return <File size={24} color="#696969" />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.fileList}>
            {files.map((file, index) => (
              <TouchableOpacity key={index} style={styles.fileItem}>
                {getFileIcon(file.name)}
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileDetails}>{file.type} • {file.size}</Text>
                  <Text style={styles.fileDate}>{file.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    maxWidth: 500,
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  fileList: {
    flex: 1,
    padding: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  fileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  fileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
  },
});