import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { X, Download, FileText, CircleAlert as AlertCircle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import type { FileData } from './DeskScene';

interface FileViewerProps {
  visible: boolean;
  file: FileData | null;
  fileUri?: string;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FileViewer({ visible, file, fileUri, onClose }: FileViewerProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible && file && fileUri) {
      loadFileContent();
    }
  }, [visible, file, fileUri]);

  const loadFileContent = async () => {
    if (!file || !fileUri) return;

    setIsLoading(true);
    setError('');
    setFileContent('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html'].includes(extension || '')) {
        // Read text files
        const content = await FileSystem.readAsStringAsync(fileUri);
        setFileContent(content);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        // Images will be handled by the Image component
        setFileContent('image');
      } else if (extension === 'pdf') {
        // PDFs will be handled separately
        setFileContent('pdf');
      } else {
        setError('File type not supported for preview');
      }
    } catch (err) {
      console.error('Error loading file:', err);
      setError('Failed to load file content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file || !fileUri) return;

    try {
      if (Platform.OS === 'web') {
        // On web, open the file in a new tab
        await WebBrowser.openBrowserAsync(fileUri);
      } else {
        // On mobile, you could implement sharing or saving to gallery
        console.log('Download functionality for mobile would go here');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const renderFileContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <FileText size={48} color="#666" />
          <Text style={styles.loadingText}>Loading file...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <AlertCircle size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Download size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Open Externally</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!file || !fileUri) return null;

    const extension = file.name.split('.').pop()?.toLowerCase();

    // Handle images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '') || fileContent === 'image') {
      return (
        <ScrollView style={styles.imageContainer} maximumZoomScale={3} minimumZoomScale={1}>
          <Image
            source={{ uri: fileUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </ScrollView>
      );
    }

    // Handle PDFs
    if (extension === 'pdf' || fileContent === 'pdf') {
      return (
        <View style={styles.centerContent}>
          <FileText size={48} color="#D2691E" />
          <Text style={styles.pdfText}>PDF Document</Text>
          <Text style={styles.pdfSubtext}>
            PDF viewing is not available in the web preview.
            {'\n'}Click below to open in your browser.
          </Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Download size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Open PDF</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Handle text files
    if (fileContent && fileContent !== 'image' && fileContent !== 'pdf') {
      return (
        <ScrollView style={styles.textContainer}>
          <Text style={styles.textContent}>{fileContent}</Text>
        </ScrollView>
      );
    }

    // Fallback for unsupported files
    return (
      <View style={styles.centerContent}>
        <FileText size={48} color="#666" />
        <Text style={styles.unsupportedText}>Preview not available</Text>
        <Text style={styles.unsupportedSubtext}>
          This file type cannot be previewed in the app.
        </Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Download size={20} color="#FFF" />
          <Text style={styles.downloadButtonText}>Open Externally</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible || !file) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.fileDetails}>
              {file.type} • {file.size}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDownload}>
            <Download size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderFileContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fileInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fileDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
  },
  pdfText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  pdfSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  unsupportedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  unsupportedSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: screenWidth,
    height: screenHeight - 120,
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});