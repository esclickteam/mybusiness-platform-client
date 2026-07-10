import type React from "react";

import type {
  AnimationPresetValue,
  StudioSitePage,
  StylePatch,
} from "../types";

import type {
  VisualAnimationMap,
  VisualContentMap,
  VisualStyleMap,
} from "./utils/visualData";

import type { StudioTemplateRenderer } from "../data/templates/templateEditorTypes";
import type { VisualEditableElementType, VisualSelectedElement } from "../VisualInspector";

export type VisualDeviceMode = "desktop" | "tablet" | "mobile";

export type VisualSelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type VisualContextMenuState = {
  open: boolean;
  x: number;
  y: number;
  elementId: string;
};

export type VisualSelectedElementWithLink = VisualSelectedElement & {
  text?: string;
  src?: string;
  alt?: string;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;

  linkValue?: string;
  linkTarget?: "_self" | "_blank" | string;
};

export type VisualSaveStatus = "draft" | "published";

export type VisualEditorController = {
  renderer: StudioTemplateRenderer;
  templateKey: string;
  templateName?: string;
  businessId?: string;

  data: Record<string, any>;
  styles: VisualStyleMap;
  content: VisualContentMap;
  animations: VisualAnimationMap;

  pages: StudioSitePage[];
  activePageId: string;

  deviceMode: VisualDeviceMode;
  setDeviceMode: (device: VisualDeviceMode) => void;

  isPreviewMode: boolean;
  togglePreviewMode: () => void;

  selectedElement: VisualSelectedElementWithLink | null;
  hoveredElementId?: string;
  selectionBox: VisualSelectionBox | null;
  clearSelection: () => void;

  contextMenu: VisualContextMenuState;
  closeContextMenu?: () => void;

  isSaving: boolean;
  save: (status?: VisualSaveStatus) => void | Promise<void>;

  setCanvasElement?: (node: HTMLElement | null) => void;

  buildRuntimeCss?: (input?: {
    selectedElementId?: string;
    hoveredElementId?: string;
  }) => string;

  handleCanvasClick?: React.MouseEventHandler<HTMLElement>;
  handleCanvasMouseMove?: React.MouseEventHandler<HTMLElement>;
  handleCanvasMouseLeave?: React.MouseEventHandler<HTMLElement>;
  handleCanvasContextMenu?: React.MouseEventHandler<HTMLElement>;

  updateText: (elementId: string, value: string) => void;
  updateImage: (
    elementId: string,
    payload: {
      src?: string;
      alt?: string;
      mediaType?: "image" | "video" | "raw" | string;
    },
  ) => void;
  updateLink: (
    elementId: string,
    payload: {
      href?: string;
      target?: "_self" | "_blank" | string;
    },
  ) => void;

  applyStyle: (elementId: string, style: StylePatch) => void;
  resetStyle: (elementId: string) => void;

  setAnimation: (
    elementId: string,
    animation: AnimationPresetValue | string,
  ) => void;
  clearAnimation: (elementId: string) => void;

  startInlineTextEdit?: (elementId: string) => void;
  openMediaPicker?: (elementId: string) => void;
  openLinkSettings?: (elementId: string) => void;

  duplicateSelected?: () => void;
  deleteSelected?: () => void;
  bringForward?: (elementId: string) => void;
  sendBackward?: (elementId: string) => void;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
};

export type VisualEditableType = VisualEditableElementType;
