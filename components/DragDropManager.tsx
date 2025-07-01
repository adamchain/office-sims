import React, { useState } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import type { DeskFileData } from './DeskScene';

interface DragDropManagerProps {
  children: React.ReactNode;
  onFileDrop: (file: DeskFileData, drawerIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function DragDropManager({ 
  children, 
  onFileDrop, 
  onDragStart, 
  onDragEnd 
}: DragDropManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFile, setDraggedFile] = useState<DeskFileData | null>(null);

  const handleDragStart = (file: DeskFileData) => {
    setIsDragging(true);
    setDraggedFile(file);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedFile(null);
    onDragEnd();
  };

  const handleDrop = (drawerIndex: number) => {
    if (draggedFile) {
      onFileDrop(draggedFile, drawerIndex);
    }
    handleDragEnd();
  };

  return (
    <View style={{ flex: 1 }}>
      {React.cloneElement(children as React.ReactElement, {
        isDragging,
        draggedFile,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDrop: handleDrop,
      })}
    </View>
  );
}