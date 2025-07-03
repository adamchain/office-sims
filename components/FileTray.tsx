import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder, Animated } from 'react-native';
import { Inbox } from 'lucide-react-native';
import type { FileTrayData } from './DeskScene';

interface FileTrayProps {
  fileTray: FileTrayData;
  onUpdate: (updates: Partial<FileTrayData>) => void;
  onPress: () => void;
  isDropTarget?: boolean;
  onDrop?: (file: import('./DeskScene').DeskFileData, target: string) => void;
}

export default function FileTray({ fileTray, onUpdate, onPress, isDropTarget = false, onDrop }: FileTrayProps) {
  const [hovering, setHovering] = useState(false);

  const pan = new Animated.ValueXY({ x: fileTray.x, y: fileTray.y });

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
      onUpdate({ x: newX, y: newY });
    },
  });

  const handlePress = () => {
    if (onDrop && isDropTarget) {
      onDrop(null as any, 'filetray');
    } else {
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.trayContainer,
        {
          transform: pan.getTranslateTransform(),
          zIndex: fileTray.zIndex,
        },
        isDropTarget && styles.dropTarget,
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        style={[styles.tray, hovering && styles.hoveredTray]} 
        onPress={handlePress}
        onPressIn={() => setHovering(true)}
        onPressOut={() => setHovering(false)}
      >
        {/* Manila folder style */}
        <View style={styles.folderTab}>
          <Text style={styles.tabText}>INBOX</Text>
        </View>
        <View style={styles.folderBody}>
          <Inbox size={32} color="#8B4513" />
          <Text style={styles.fileCount}>
            {fileTray.files.length} files
          </Text>
        </View>
      </TouchableOpacity>

      {isDropTarget && (
        <View style={styles.dropOverlay}>
          <Text style={styles.dropText}>Drop file here</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  trayContainer: {
    position: 'absolute',
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
    shadowOpacity: 0.3,
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