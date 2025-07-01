import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FolderOpen, FileText, Image, FileVideo } from 'lucide-react-native';

export default function FilesScreen() {
  const recentFiles = [
    { name: 'Invoice.pdf', type: 'pdf', date: '2024-01-15' },
    { name: 'PitchDeck.pptx', type: 'presentation', date: '2024-01-14' },
    { name: 'Meeting_Notes.docx', type: 'document', date: '2024-01-13' },
    { name: 'Budget_2024.xlsx', type: 'spreadsheet', date: '2024-01-12' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText size={24} color="#D2691E" />;
      case 'presentation':
        return <Image size={24} color="#FF6347" />;
      case 'spreadsheet':
        return <FileVideo size={24} color="#32CD32" />;
      default:
        return <FileText size={24} color="#696969" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FolderOpen size={32} color="#8B4513" />
        <Text style={styles.headerTitle}>File Explorer</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Files</Text>
          {recentFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              {getFileIcon(file.type)}
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDate}>{file.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fileDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});