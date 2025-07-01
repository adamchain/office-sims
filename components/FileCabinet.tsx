import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Archive } from 'lucide-react-native';

interface FileCabinetProps {
  onPress: () => void;
}

export default function FileCabinet({ onPress }: FileCabinetProps) {
  return (
    <TouchableOpacity style={styles.cabinet} onPress={onPress}>
      <View style={styles.cabinetTop}>
        <View style={styles.handle} />
      </View>
      <View style={styles.cabinetBody}>
        <Archive size={32} color="#696969" />
        <Text style={styles.cabinetLabel}>Files</Text>
      </View>
      <View style={styles.cabinetBottom}>
        <View style={styles.handle} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cabinet: {
    width: 100,
    height: 120,
    backgroundColor: '#A9A9A9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#808080',
  },
  cabinetTop: {
    height: 35,
    backgroundColor: '#B8B8B8',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  cabinetBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9A9A9',
  },
  cabinetBottom: {
    height: 35,
    backgroundColor: '#B8B8B8',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#808080',
  },
  handle: {
    width: 20,
    height: 4,
    backgroundColor: '#696969',
    borderRadius: 2,
  },
  cabinetLabel: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
    marginTop: 4,
  },
});