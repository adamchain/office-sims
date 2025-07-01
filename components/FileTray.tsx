import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Inbox, FolderOpen } from 'lucide-react-native';

interface FileTrayProps {
  onPress: () => void;
  onDrawerPress: (drawerIndex: number) => void;
  isDropTarget?: boolean;
  onDrop?: (drawerIndex: number) => void;
}

export default function FileTray({ onPress, onDrawerPress, isDropTarget = false, onDrop }: FileTrayProps) {
  const [hoveredDrawer, setHoveredDrawer] = useState<number | null>(null);

  const drawers = [
    { label: 'A', color: '#FF6B6B' },
    { label: 'B', color: '#4ECDC4' },
    { label: 'C', color: '#45B7D1' },
    { label: 'D', color: '#96CEB4' },
    { label: 'E', color: '#FFEAA7' },
  ];

  const handleDrawerPress = (index: number) => {
    if (onDrop && isDropTarget) {
      onDrop(index);
    } else {
      onDrawerPress(index);
    }
  };

  return (
    <View style={[styles.trayContainer, isDropTarget && styles.dropTarget]}>
      {/* Main Tray Body */}
      <TouchableOpacity style={styles.trayMain} onPress={onPress}>
        <View style={styles.trayBack}>
          <View style={styles.trayDivider} />
          <View style={styles.trayDivider} />
        </View>
        <View style={styles.trayFront}>
          <Inbox size={24} color="#8B4513" />
          <Text style={styles.trayLabel}>File Tray</Text>
        </View>
      </TouchableOpacity>

      {/* Individual Drawers */}
      <View style={styles.drawersContainer}>
        {drawers.map((drawer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.drawer,
              { backgroundColor: drawer.color },
              hoveredDrawer === index && styles.hoveredDrawer,
              isDropTarget && styles.dropTargetDrawer,
            ]}
            onPress={() => handleDrawerPress(index)}
            onPressIn={() => setHoveredDrawer(index)}
            onPressOut={() => setHoveredDrawer(null)}
          >
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerLabel}>{drawer.label}</Text>
            <FolderOpen size={12} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tray Base */}
      <View style={styles.trayBase} />

      {isDropTarget && (
        <View style={styles.dropOverlay}>
          <Text style={styles.dropText}>Drop file into a drawer</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trayContainer: {
    width: 120,
    height: 140,
    position: 'relative',
  },
  dropTarget: {
    transform: [{ scale: 1.1 }],
  },
  trayMain: {
    width: 100,
    height: 70,
    position: 'relative',
    alignSelf: 'center',
  },
  trayBack: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 50,
    backgroundColor: '#A0522D',
    borderRadius: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  trayDivider: {
    height: 2,
    backgroundColor: '#8B4513',
    marginHorizontal: 8,
    borderRadius: 1,
  },
  trayFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#DEB887',
    borderRadius: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CD853F',
  },
  trayLabel: {
    fontSize: 8,
    color: '#8B4513',
    fontWeight: '600',
    marginTop: 2,
  },
  drawersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  drawer: {
    width: 18,
    height: 35,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  hoveredDrawer: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
  },
  dropTargetDrawer: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  drawerHandle: {
    width: 8,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 1,
  },
  drawerLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  trayBase: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
    height: 8,
    backgroundColor: '#8B4513',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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