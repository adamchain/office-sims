import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import Notepad from './Notepad';
import StickyNote from './StickyNote';
import FileTray from './FileTray';
import FileDrawer from './FileDrawer';
import RecycleBin from './RecycleBin';
import FileModal from './FileModal';
import Pen from './Pen';
import DeskFile from './DeskFile';
import DeskFolder from './DeskFolder';
import AddItemModal from './AddItemModal';
import RecycleBinModal, { DeletedItem } from './RecycleBinModal';
import TornPage from './TornPage';

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

export interface TornPageData {
  id: string;
  text: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface NotepadData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  notes: string;
}

export interface FileTrayData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  files: FileData[];
}

export default function DeskScene() {
  const pathname = usePathname();
  
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

  const [tornPages, setTornPages] = useState<TornPageData[]>([]);

  const [notepad, setNotepad] = useState<NotepadData>({
    id: 'notepad-1',
    x: 30,
    y: 40,
    zIndex: 100,
    notes: 'Welcome to your desk!\n\nTap items to interact:\n• Yellow notepad for daily notes\n• Sticky notes for quick reminders\n• Manila folder for quick access files\n• File drawer for long-term storage\n• Pen to add new sticky notes\n• Recycle bin to restore deleted items'
  });

  const [fileTray, setFileTray] = useState<FileTrayData>({
    id: 'filetray-1',
    x: screenWidth - 160,
    y: 220,
    zIndex: 100,
    files: [
      { name: 'Invoice.pdf', type: 'PDF Document', size: '245 KB', date: 'Today' },
      { name: 'PitchDeck.pptx', type: 'PowerPoint', size: '1.2 MB', date: 'Yesterday' },
    ]
  });

  const [longTermFiles, setLongTermFiles] = useState<FileData[]>([
    { name: 'Annual_Report_2023.pdf', type: 'PDF Document', size: '5.4 MB', date: 'Last week' },
    { name: 'Budget_Spreadsheet.xlsx', type: 'Excel File', size: '234 KB', date: 'Last month' },
    { name: 'Team_Photos.zip', type: 'Archive', size: '15.2 MB', date: '2 months ago' },
    { name: 'Project_Archive.zip', type: 'Archive', size: '125 MB', date: '3 months ago' },
    { name: 'Backup_Database.sql', type: 'Database', size: '45 MB', date: '6 months ago' },
  ]);

  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);

  const [showFileTray, setShowFileTray] = useState(false);
  const [showFileDrawer, setShowFileDrawer] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<DeskFolderData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(200);

  // Zoom and pan state for mobile
  const [zoomLevel, setZoomLevel] = useState(Platform.OS === 'web' ? 1 : 0.7);

  // Listen for navigation to add tab
  React.useEffect(() => {
    if (pathname === '/add') {
      setShowAddModal(true);
    }
  }, [pathname]);

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
    const noteToDelete = stickyNotes.find(note => note.id === id);
    if (noteToDelete) {
      const deletedItem: DeletedItem = {
        id: noteToDelete.id,
        name: noteToDelete.text.substring(0, 30) + (noteToDelete.text.length > 30 ? '...' : ''),
        type: 'stickyNote',
        originalData: noteToDelete,
        deletedAt: new Date().toLocaleDateString(),
      };
      setDeletedItems(prev => [deletedItem, ...prev]);
    }
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  };

  const addStickyNote = () => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      text: 'New note',
      color: 'normal',
      x: Math.random() * (deskWidth - 100),
      y: Math.random() * (deskHeight - 200) + 100,
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
    const fileToDelete = deskFiles.find(file => file.id === id);
    if (fileToDelete) {
      const deletedItem: DeletedItem = {
        id: fileToDelete.id,
        name: fileToDelete.name,
        type: 'file',
        originalData: fileToDelete,
        deletedAt: new Date().toLocaleDateString(),
      };
      setDeletedItems(prev => [deletedItem, ...prev]);
    }
    setDeskFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateDeskFolder = (id: string, updates: Partial<DeskFolderData>) => {
    setDeskFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : folder.zIndex } : folder
    ));
  };

  const deleteDeskFolder = (id: string) => {
    const folderToDelete = deskFolders.find(folder => folder.id === id);
    if (folderToDelete) {
      const deletedItem: DeletedItem = {
        id: folderToDelete.id,
        name: folderToDelete.name,
        type: 'folder',
        originalData: folderToDelete,
        deletedAt: new Date().toLocaleDateString(),
      };
      setDeletedItems(prev => [deletedItem, ...prev]);
    }
    setDeskFolders(prev => prev.filter(folder => folder.id !== id));
  };

  const updateNotepad = (updates: Partial<NotepadData>) => {
    setNotepad(prev => ({ 
      ...prev, 
      ...updates, 
      zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : prev.zIndex 
    }));
  };

  const updateFileTray = (updates: Partial<FileTrayData>) => {
    setFileTray(prev => ({ 
      ...prev, 
      ...updates, 
      zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : prev.zIndex 
    }));
  };

  const addTornPage = (text: string) => {
    const newPage: TornPageData = {
      id: Date.now().toString(),
      text,
      x: notepad.x + 150,
      y: notepad.y + 50,
      zIndex: getNextZIndex(),
    };
    setTornPages(prev => [...prev, newPage]);
  };

  const updateTornPage = (id: string, updates: Partial<TornPageData>) => {
    setTornPages(prev => prev.map(page =>
      page.id === id ? { ...page, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : page.zIndex } : page
    ));
  };

  const deleteTornPage = (id: string) => {
    const pageToDelete = tornPages.find(page => page.id === id);
    if (pageToDelete) {
      const deletedItem: DeletedItem = {
        id: pageToDelete.id,
        name: pageToDelete.text.substring(0, 30) + (pageToDelete.text.length > 30 ? '...' : ''),
        type: 'stickyNote', // Treat torn pages like sticky notes in recycle bin
        originalData: pageToDelete,
        deletedAt: new Date().toLocaleDateString(),
      };
      setDeletedItems(prev => [deletedItem, ...prev]);
    }
    setTornPages(prev => prev.filter(page => page.id !== id));
  };

  const addNewFile = (name: string, type: string) => {
    const newFile: DeskFileData = {
      id: Date.now().toString(),
      name,
      type,
      size: '0 KB',
      date: 'Just now',
      x: Math.random() * (deskWidth - 120) + 60,
      y: Math.random() * (deskHeight - 300) + 150,
      zIndex: getNextZIndex(),
    };
    setDeskFiles(prev => [...prev, newFile]);
  };

  const addNewFolder = (name: string) => {
    const newFolder: DeskFolderData = {
      id: Date.now().toString(),
      name,
      x: Math.random() * (deskWidth - 120) + 60,
      y: Math.random() * (deskHeight - 300) + 150,
      zIndex: getNextZIndex(),
      files: [],
    };
    setDeskFolders(prev => [...prev, newFolder]);
  };

  const handleFolderPress = (folder: DeskFolderData) => {
    setSelectedFolder(folder);
  };

  const handleFileDrop = (file: DeskFileData, target: string) => {
    if (target === 'filetray') {
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        date: file.date,
      };

      setFileTray(prev => ({
        ...prev,
        files: [...prev.files, fileData],
      }));

      deleteDeskFile(file.id);
    }
  };

  const handleFileImported = (file: FileData) => {
    setFileTray(prev => ({
      ...prev,
      files: [file, ...prev.files],
    }));
  };

  const handleLongTermFileImported = (file: FileData) => {
    setLongTermFiles(prev => [file, ...prev]);
  };

  const handleRestoreItem = (item: DeletedItem) => {
    switch (item.type) {
      case 'file':
        setDeskFiles(prev => [...prev, item.originalData]);
        break;
      case 'folder':
        setDeskFolders(prev => [...prev, item.originalData]);
        break;
      case 'stickyNote':
        if (item.originalData.text !== undefined) {
          // It's a sticky note
          setStickyNotes(prev => [...prev, item.originalData]);
        } else {
          // It's a torn page
          setTornPages(prev => [...prev, item.originalData]);
        }
        break;
    }
    setDeletedItems(prev => prev.filter(deletedItem => deletedItem.id !== item.id));
  };

  const handlePermanentDelete = (itemId: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleEmptyBin = () => {
    setDeletedItems([]);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    // Navigate back to desk if we came from the add tab
    if (pathname === '/add') {
      router.replace('/');
    }
  };

  const deskWidth = Platform.OS === 'web' ? screenWidth - 20 : screenWidth * 1.5;
  const deskHeight = Platform.OS === 'web' ? screenHeight * 0.9 : screenHeight * 1.2;

  // Calculate bounds for draggable items to cover the entire desk
  const dragBounds = {
    minX: 0,
    maxX: deskWidth - 100, // Leave some margin for item width
    minY: 0,
    maxY: deskHeight - 100, // Leave some margin for item height
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'web' && {
            transform: [{ scale: zoomLevel }],
          }
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={Platform.OS !== 'web'}
        horizontal={Platform.OS !== 'web'}
        bounces={false}
        maximumZoomScale={Platform.OS !== 'web' ? 1.5 : 1}
        minimumZoomScale={Platform.OS !== 'web' ? 0.5 : 1}
        zoomEnabled={Platform.OS !== 'web'}
      >
        {/* Desk Surface */}
        <View style={[styles.deskSurface, { width: deskWidth, height: deskHeight }]}>

          {/* File Drawer - Fixed position below desk */}
          <View style={styles.drawerContainer}>
            <FileDrawer onPress={() => setShowFileDrawer(true)} />
          </View>

          {/* Recycle Bin - Fixed position below desk */}
          <View style={styles.recycleBinContainer}>
            <RecycleBin 
              onPress={() => setShowRecycleBin(true)} 
              itemCount={deletedItems.length}
            />
          </View>

          {/* Pen - Fixed position */}
          <View style={styles.penContainer}>
            <Pen onPress={addStickyNote} />
          </View>

          {/* Draggable Items */}
          {stickyNotes.map(note => (
            <StickyNote
              key={`sticky-${note.id}`}
              note={note}
              onUpdate={updateStickyNote}
              onDelete={deleteStickyNote}
              bounds={dragBounds}
            />
          ))}

          {deskFiles.map(file => (
            <DeskFile
              key={`file-${file.id}`}
              file={file}
              onUpdate={updateDeskFile}
              onDelete={deleteDeskFile}
              bounds={dragBounds}
            />
          ))}

          {deskFolders.map(folder => (
            <DeskFolder
              key={`folder-${folder.id}`}
              folder={folder}
              onUpdate={updateDeskFolder}
              onDelete={deleteDeskFolder}
              onPress={handleFolderPress}
              bounds={dragBounds}
            />
          ))}

          {tornPages.map(page => (
            <TornPage
              key={`page-${page.id}`}
              page={page}
              onUpdate={updateTornPage}
              onDelete={deleteTornPage}
              bounds={dragBounds}
            />
          ))}

          <Notepad
            notepad={notepad}
            onUpdate={updateNotepad}
            onTearPage={addTornPage}
            bounds={dragBounds}
          />

          <FileTray
            fileTray={fileTray}
            onUpdate={updateFileTray}
            onPress={() => setShowFileTray(true)}
            isDropTarget={isDragging}
            onDrop={handleFileDrop}
            bounds={dragBounds}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      
      {/* File Tray Modal */}
      <FileModal
        visible={showFileTray}
        title="File Tray - Quick Access"
        files={fileTray.files}
        onClose={() => setShowFileTray(false)}
        onFileImported={handleFileImported}
        allowImport={true}
      />

      {/* File Drawer Modal */}
      <FileModal
        visible={showFileDrawer}
        title="File Storage - Long-Term Storage"
        files={longTermFiles}
        onClose={() => setShowFileDrawer(false)}
        onFileImported={handleLongTermFileImported}
        allowImport={true}
      />

      {/* Folder Modal */}
      {selectedFolder && (
        <FileModal
          visible={!!selectedFolder}
          title={selectedFolder.name}
          files={selectedFolder.files}
          onClose={() => setSelectedFolder(null)}
        />
      )}

      {/* Recycle Bin Modal */}
      <RecycleBinModal
        visible={showRecycleBin}
        deletedItems={deletedItems}
        onClose={() => setShowRecycleBin(false)}
        onRestore={handleRestoreItem}
        onPermanentDelete={handlePermanentDelete}
        onEmptyBin={handleEmptyBin}
      />

      {/* Add Item Modal */}
      <AddItemModal
        visible={showAddModal}
        onClose={handleAddModalClose}
        onAddFile={addNewFile}
        onAddFolder={addNewFolder}
        onAddStickyNote={addStickyNote}
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
    flexGrow: 1,
  },
  deskSurface: {
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
  },
  drawerContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    zIndex: 300,
  },
  recycleBinContainer: {
    position: 'absolute',
    bottom: -50,
    right: 20,
    zIndex: 300,
  },
  penContainer: {
    position: 'absolute',
    top: 180,
    left: 180,
    zIndex: 300,
  },
});