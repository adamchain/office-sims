import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DraggableItem from './DraggableItem';
import type { FileTrayData } from './DeskScene';

interface FileTrayProps {
  fileTray: FileTrayData;
  onUpdate: (updates: Partial<FileTrayData>) => void;
  onPress: () => void;
  isDropTarget?: boolean;
  onDrop?: (file: import('./DeskScene').DeskFileData, target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export default function FileTray({ fileTray, onUpdate, onPress, isDropTarget = false, onDrop, bounds }: FileTrayProps) {
  const [hovering, setHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    onUpdate({ x, y });
  };

  const handlePress = () => {
    if (!isDragging) {
      if (onDrop && isDropTarget) {
        onDrop(null as any, 'filetray');
      } else {
        onPress();
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!isDragging) {
        handlePress();
      }
    });

  return (
    <DraggableItem
      x={fileTray.x}
      y={fileTray.y}
      zIndex={fileTray.zIndex}
      onPositionChange={handlePositionChange}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      bounds={bounds}
      disabled={isDropTarget}
    >
      <View style={[styles.trayContainer, isDropTarget && styles.dropTarget]}>
        <GestureDetector gesture={tapGesture}>
          <View style={[styles.tray, hovering && styles.hoveredTray]}>
            <View style={styles.folderTab}>
              <Text style={styles.tabText}>INBOX</Text>
            </View>
            <View style={styles.folderBody}>
              <Inbox size={32} color="#8B4513" />
              <Text style={styles.fileCount}>
                {fileTray.files.length} files
              </Text>
            </View>
          </View>
        </GestureDetector>

        {isDropTarget && (
          <View style={styles.dropOverlay}>
            <Text style={styles.dropText}>Drop file here</Text>
          </View>
        )}
      </View>
    </DraggableItem>
  );
}

const styles = StyleSheet.create({
  trayContainer: {
    width: 120,
    height: 90,
  },
  dropTarget: {
    transform: [{ scale: 1.1 }],
  },
  tray: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  hoveredTray: {
    transform: [{ scale: 1.05 }],
  },
  folderTab: {
    width: 80,
    height: 20,
    backgroundColor: '#DEB887',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#CD853F',
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 8,
    color: '#8B4513',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  folderBody: {
    flex: 1,
    backgroundColor: '#F5DEB3',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CD853F',
    paddingVertical: 8,
  },
  fileCount: {
    fontSize: 8,
    color: '#8B4513',
    marginTop: 4,
    fontWeight: '600',
  },
  dropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  dropText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});