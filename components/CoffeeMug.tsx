import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function CoffeeMug() {
  return (
    <View style={styles.mug}>
      <View style={styles.mugBody}>
        <View style={styles.coffee} />
      </View>
      <View style={styles.handle} />
      <View style={styles.steam}>
        <View style={[styles.steamLine, { left: 5, animationDelay: '0s' }]} />
        <View style={[styles.steamLine, { left: 15, animationDelay: '0.5s' }]} />
        <View style={[styles.steamLine, { left: 25, animationDelay: '1s' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mug: {
    width: 50,
    height: 60,
    position: 'relative',
  },
  mugBody: {
    width: 40,
    height: 45,
    backgroundColor: '#8B4513',
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#A0522D',
    padding: 3,
  },
  coffee: {
    flex: 1,
    backgroundColor: '#4A2C2A',
    borderRadius: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  handle: {
    position: 'absolute',
    right: -8,
    top: 15,
    width: 12,
    height: 20,
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 10,
    borderLeftWidth: 0,
  },
  steam: {
    position: 'absolute',
    top: -15,
    left: 2,
    width: 36,
    height: 15,
  },
  steamLine: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
    opacity: 0.6,
  },
});