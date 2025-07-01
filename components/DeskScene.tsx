import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import Notepad from './Notepad';
import StickyNote from './StickyNote';
import FileTray from './FileTray';
import FileCabinet from './FileCabinet';
import FileModal from './FileModal';
import CoffeeMug from './CoffeeMug';
import Pen from './Pen';
import DeskFile from './DeskFile';
import DeskFolder from './DeskFolder';
import AddItemModal from './AddItemModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface StickyNoteData {
  id: string;
  text: string;
  color: 'urgent' | 'normal' | 'low';
  x: number;
  y: number;
  zIndex: number;
}

export interface FileData {
  name: string;
  type: string;
  size: string;
  date: string;
}

export interface DeskFileData extends FileData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface DeskFolderData {
  id: string;
  name: string;
  x: number;
  y: number;
  zIndex: number;
  files: FileData[];
}

export default function DeskScene() {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([
    { id: '1', text: 'Call client at 3pm', color: 'urgent', x: 50, y: 150, zIndex: 1 },
    { id: '2', text: 'Review proposal', color: 'normal', x: 200, y: 200, zIndex: 2 },
    { id: '3', text: 'Order supplies', color: 'low', x: 120, y: 320, zIndex: 3 },
  ]);

  const [deskFiles, setDeskFiles] = useState<DeskFileData[]>([
    { id: '1', name: 'Contract.pdf', type: 'PDF Document', size: '245 KB', date: 'Today', x: 280, y: 180, zIndex: 4 },
    { id: '2', name: 'Report.docx', type: 'Word Document', size: '89 KB', date: 'Yesterday', x: 160, y: 280, zIndex: 5 },
  ]);

  const [deskFolders, setDeskFolders] = useState<DeskFolderData[]>([
    {
      id: '1',
      name: 'Project Alpha',
      x: 240,
      y: 120,
      zIndex: 6,
      files: [
        { name: 'Proposal.pdf', type: 'PDF Document', size: '1.2 MB', date: 'Today' },
        { name: 'Budget.xlsx', type: 'Excel File', size: '234 KB', date: 'Yesterday' },
      ]
    }
  ]);

  const [quickAccessFiles, setQuickAccessFiles] = useState<FileData[]>([
    { name: 'Invoice.pdf', type: 'PDF Document', size: '245 KB', date: 'Today' },
    { name: 'PitchDeck.pptx', type: 'PowerPoint', size: '1.2 MB', date: 'Yesterday' },
    { name: 'Contract.docx', type: 'Word Document', size: '89 KB', date: '2 days ago' },
  ]);

  const [longTermFiles, setLongTermFiles] = useState<FileData[]>([
    { name: 'Annual_Report_2023.pdf', type: 'PDF Document', size: '5.4 MB', date: 'Last week' },
    { name: 'Budget_Spreadsheet.xlsx', type: 'Excel File', size: '234 KB', date: 'Last month' },
    { name: 'Team_Photos.zip', type: 'Archive', size: '15.2 MB', date: '2 months ago' },
    { name: 'Project_Archive.zip', type: 'Archive', size: '125 MB', date: '3 months ago' },
    { name: 'Backup_Database.sql', type: 'Database', size: '45 MB', date: '6 months ago' },
  ]);

  const [showFileTray, setShowFileTray] = useState(false);
  const [showFileCabinet, setShowFileCabinet] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<DeskFolderData | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const getNextZIndex = () => {
    setMaxZIndex(prev => prev + 1);
    return maxZIndex + 1;
  };

  const updateStickyNote = (id: string, updates: Partial<StickyNoteData>) => {
    setStickyNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : note.zIndex } : note
    ));
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  };

  const addStickyNote = () => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      text: 'New note',
      color: 'normal',
      x: Math.random() * (screenWidth - 100),
      y: Math.random() * (screenHeight - 200) + 100,
      zIndex: getNextZIndex(),
    };
    setStickyNotes(prev => [...prev, newNote]);
  };

  const updateDeskFile = (id: string, updates: Partial<DeskFileData>) => {
    setDeskFiles(prev => prev.map(file =>
      file.id === id ? { ...file, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : file.zIndex } : file
    ));
  };

  const deleteDeskFile = (id: string) => {
    setDeskFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateDeskFolder = (id: string, updates: Partial<DeskFolderData>) => {
    setDeskFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : folder.zIndex } : folder
    ));
  };

  const deleteDeskFolder = (id: string) => {
    setDeskFolders(prev => prev.filter(folder => folder.id !== id));
  };

  const addNewFile = (name: string, type: string) => {
    const newFile: DeskFileData = {
      id: Date.now().toString(),
      name,
      type,
      size: '0 KB',
      date: 'Just now',
      x: Math.random() * (screenWidth - 120) + 60,
      y: Math.random() * (screenHeight - 300) + 150,
      zIndex: getNextZIndex(),
    };
    setDeskFiles(prev => [...prev, newFile]);
  };

  const addNewFolder = (name: string) => {
    const newFolder: DeskFolderData = {
      id: Date.now().toString(),
      name,
      x: Math.random() * (screenWidth - 120) + 60,
      y: Math.random() * (screenHeight - 300) + 150,
      zIndex: getNextZIndex(),
      files: [],
    };
    setDeskFolders(prev => [...prev, newFolder]);
  };

  const handleFolderPress = (folder: DeskFolderData) => {
    setSelectedFolder(folder);
  };

  const handleQuickAccessFileImported = (file: FileData) => {
    setQuickAccessFiles(prev => [file, ...prev]);
  };

  const handleLongTermFileImported = (file: FileData) => {
    setLongTermFiles(prev => [file, ...prev]);
  };

  // Sort all items by zIndex for proper rendering order
  const allItems = [
    ...stickyNotes.map(note => ({ ...note, type: 'sticky' as const })),
    ...deskFiles.map(file => ({ ...file, type: 'file' as const })),
    ...deskFolders.map(folder => ({ ...folder, type: 'folder' as const })),
  ].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Desk Surface */}
        <View style={styles.deskSurface}>

          {/* Notepad */}
          <View style={styles.notepadContainer}>
            <Notepad />
          </View>

          {/* File Tray */}
          <View style={styles.fileTrayContainer}>
            <FileTray onPress={() => setShowFileTray(true)} />
          </View>

          {/* File Cabinet */}
          <View style={styles.cabinetContainer}>
            <FileCabinet onPress={() => setShowFileCabinet(true)} />
          </View>

          {/* Coffee Mug */}
          <View style={styles.coffeeContainer}>
            <CoffeeMug />
          </View>

          {/* Pen */}
          <View style={styles.penContainer}>
            <Pen onPress={addStickyNote} />
          </View>

          {/* Render all items in zIndex order */}
          {allItems.map(item => {
            if (item.type === 'sticky') {
              return (
                <StickyNote
                  key={`sticky-${item.id}`}
                  note={item}
                  onUpdate={updateStickyNote}
                  onDelete={deleteStickyNote}
                />
              );
            } else if (item.type === 'file') {
              return (
                <DeskFile
                  key={`file-${item.id}`}
                  file={item}
                  onUpdate={updateDeskFile}
                  onDelete={deleteDeskFile}
                />
              );
            } else if (item.type === 'folder') {
              return (
                <DeskFolder
                  key={`folder-${item.id}`}
                  folder={item}
                  onUpdate={updateDeskFolder}
                  onDelete={deleteDeskFolder}
                  onPress={handleFolderPress}
                />
              );
            }
            return null;
          })}

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <FileModal
        visible={showFileTray}
        title="File Tray - Quick Access"
        files={quickAccessFiles}
        onClose={() => setShowFileTray(false)}
        onFileImported={handleQuickAccessFileImported}
        allowImport={true}
      />

      <FileModal
        visible={showFileCabinet}
        title="File Cabinet - Long-Term Storage"
        files={longTermFiles}
        onClose={() => setShowFileCabinet(false)}
        onFileImported={handleLongTermFileImported}
        allowImport={true}
      />

      {selectedFolder && (
        <FileModal
          visible={!!selectedFolder}
          title={selectedFolder.name}
          files={selectedFolder.files}
          onClose={() => setSelectedFolder(null)}
        />
      )}

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFile={addNewFile}
        onAddFolder={addNewFolder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    minHeight: screenHeight,
  },
  deskSurface: {
    flex: 1,
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    margin: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    minHeight: screenHeight * 0.9,
  },
  notepadContainer: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 100,
  },
  fileTrayContainer: {
    position: 'absolute',
    top: 220,
    right: 40,
    zIndex: 100,
  },
  cabinetContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 100,
  },
  coffeeContainer: {
    position: 'absolute',
    top: 60,
    right: 120,
    zIndex: 100,
  },
  penContainer: {
    position: 'absolute',
    top: 180,
    left: 180,
    zIndex: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});