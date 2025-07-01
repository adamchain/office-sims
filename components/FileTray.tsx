import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';

interface FileTrayProps {
  onPress: () => void;
}

export default function FileTray({ onPress }: FileTrayProps) {
  return (
    <TouchableOpacity style={styles.tray} onPress={onPress}>
      <View style={styles.trayBack}>
        <View style={styles.trayDivider} />
        <View style={styles.trayDivider} />
      </View>
      <View style={styles.trayFront}>
        <Inbox size={28} color="#8B4513" />
        <Text style={styles.trayLabel}>Tray</Text>
      </View>
      <View style={styles.trayBase} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tray: {
    width: 100,
    height: 90,
    position: 'relative',
  },
  trayBack: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 60,
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
    height: 65,
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
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '600',
    marginTop: 2,
  },
  trayBase: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
    height: 8,
    backgroundColor: '#8B4513',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});