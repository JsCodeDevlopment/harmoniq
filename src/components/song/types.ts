"use client";

import { RefObject } from "react";

export interface SongInSetlist {
  id: number;
  url: string;
  key: string;
  title?: string;
  artist?: string;
  chord_variations?: string;
}

export interface Setlist {
  id: number;
  title: string;
  songs: SongInSetlist[];
}

export interface SongHeaderProps {
  title?: string;
  artist?: string;
  url: string;
  setlistId: string | null;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  showSetlistSelector: boolean;
  setShowSetlistSelector: (val: boolean) => void;
  setPerformanceMode: (val: boolean) => void;
  localFontSize: string;
  localChordColor: string;
  localInstrument?: string;
  handleUpdateSettings: (updates: { font_size?: string; chord_color?: string; instrument?: string }) => void;
  setlists: Setlist[];
  handleAddToSetlist: (id: number) => void;
  settingsRef: RefObject<HTMLDivElement | null>;
  selectorRef: RefObject<HTMLDivElement | null>;
  settingsBtnRef: RefObject<HTMLButtonElement | null>;
  selectorBtnRef: RefObject<HTMLButtonElement | null>;
  // Version props for mobile
  simplifiedUrl?: string;
  principalUrl?: string;
  keyboardUrl?: string;
  currentUrl: string;
  onVersionChange?: (url: string) => void;
  showTabs: boolean;
  setShowTabs: (val: boolean) => void;
}

export interface SongUtilityBarProps {
  currentKey: string;
  originalKey?: string;
  transpose: number;
  setTranspose: (val: number | ((prev: number) => number)) => void;
  autoScroll: boolean;
  setAutoScroll: (val: boolean) => void;
  performanceMode: boolean;
  setPerformanceMode: (val: boolean) => void;
  showDiagrams: boolean;
  setShowDiagrams: (val: boolean) => void;
  setlist?: Setlist | null;
  songIndex: number;
  goToPrev: () => void;
  goToNext: () => void;
  simplifiedUrl?: string;
  principalUrl?: string;
  keyboardUrl?: string;
  currentUrl: string;
  onVersionChange: (url: string) => void;
  // Settings props
  localFontSize: string;
  localChordColor: string;
  localInstrument: string;
  handleUpdateSettings: (updates: { font_size?: string; chord_color?: string; instrument?: string }) => void;
  showTabs: boolean;
  setShowTabs: (val: boolean) => void;
}

export interface PerformanceHeaderProps {
  onExit: () => void;
  showDiagrams: boolean;
  setShowDiagrams: (val: boolean) => void;
  currentKey: string;
  setTranspose: (val: number | ((prev: number) => number)) => void;
  handleKeyChange: (key: string | null) => void;
  setlist?: Setlist | null;
  songIndex: number;
  goToPrev: () => void;
  goToNext: () => void;
  showTabs: boolean;
  setShowTabs: (val: boolean) => void;
}
