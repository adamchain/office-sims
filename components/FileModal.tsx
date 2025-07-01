import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, File, Upload } from 'lucide-react-native';
import FileImportButton from './FileImportButton';
import FileViewer from './FileViewer';
import type { FileData } from './DeskScene';

interface FileModalProps {
  visible: boolean;
  title: string;
  files: FileData[];
  onClose: () => void;
  onFileImported?: (file: FileData) => void;
  allowImport?: boolean;
}

export default function FileModal({ visible, title, files, onClose, onFileImported, allowImport = false }: FileModalProps) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [selectedFileUri, setSelectedFileUri] = useState<string>('');

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

  const handleFilePress = (file: FileData) => {
    // For now, we'll create a mock URI since we don't have the actual file URIs stored
    // In a real implementation, you'd store and retrieve the actual file URIs
    const mockUri = `file://mock/${file.name}`;
    setSelectedFile(file);
    setSelectedFileUri(mockUri);
  };

  const handleFileImported = (file: FileData) => {
    if (onFileImported) {
      onFileImported(file);
    }
  };

  return (
    <>
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

            {allowImport && (
              <View style={styles.importSection}>
                <FileImportButton
                  onFileImported={handleFileImported}
                  style={styles.importButton}
                />
              </View>
            )}

            <ScrollView style={styles.fileList}>
              {files.length === 0 ? (
                <View style={styles.emptyState}>
                  <Upload size={48} color="#CCC" />
                  <Text style={styles.emptyText}>No files yet</Text>
                  {allowImport && (
                    <Text style={styles.emptySubtext}>
                      Import your first file to get started
                    </Text>
                  )}
                </View>
              ) : (
                files.map((file, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.fileItem}
                    onPress={() => handleFilePress(file)}
                  >
                    {getFileIcon(file.name)}
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <Text style={styles.fileDetails}>{file.type} • {file.size}</Text>
                      <Text style={styles.fileDate}>{file.date}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FileViewer
        visible={!!selectedFile}
        file={selectedFile}
        fileUri={selectedFileUri}
        onClose={() => {
          setSelectedFile(null);
          setSelectedFileUri('');
        }}
      />
    </>
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
  importSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  importButton: {
    width: '100%',
  },
  fileList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
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