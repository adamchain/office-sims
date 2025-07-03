import React, { useState } from 'react';
import { View } from 'react-native';
import type { DeskFileData } from './DeskScene';

interface DragDropManagerProps {
  children: React.ReactElement<any>;
  onFileDrop: (file: DeskFileData, target: string) => void;
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

  const handleDrop = (target: string) => {
    if (draggedFile && target) {
      onFileDrop(draggedFile, target);
    }
    handleDragEnd();
  };

  return (
    <View style={{ flex: 1 }}>
      {React.cloneElement(children, {
        isDragging,
        draggedFile,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDrop: handleDrop,
      })}
    </View>
  );
}