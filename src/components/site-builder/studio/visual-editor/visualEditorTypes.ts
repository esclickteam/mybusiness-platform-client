import type React from "react";

import type {
  AnimationPresetValue,
  StudioSitePage,
  StylePatch,
} from "../types";

import type {
  BizuplyFormConfig,
  BizuplyFormField,
} from "../FormBuilderModal";

import type {
  VisualAnimationMap,
  VisualAttributeMap,
  VisualAttributeValue,
  VisualBooleanMap,
  VisualContentItem,
  VisualContentMap,
  VisualCustomCode,
  VisualDeletedMap,
  VisualDeviceMode,
  VisualLayoutItem,
  VisualLayoutMap,
  VisualResponsiveItem,
  VisualResponsiveMap,
  VisualStyleMap,
} from "./utils/visualData";

import type { StudioTemplateRenderer } from "../data/templates/templateEditorTypes";
import type {
  VisualEditableElementType,
  VisualSelectedElement,
} from "../VisualInspector";

export type { VisualDeviceMode };

export type VisualSelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
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
  url?: string;
  secureUrl?: string;
  secure_url?: string;
  alt?: string;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;
  resource_type?: "image" | "video" | "raw" | string;

  linkValue?: string;
  linkTarget?: "_self" | "_blank" | string;

  tagName?: string;
  label?: string;
  computedStyle?: Record<string, string>;
  detectedAnimation?: {
    name?: string;
    duration?: string;
    delay?: string;
    timingFunction?: string;
    transitionProperty?: string;
    transitionDuration?: string;
  };

  node?: HTMLElement;
  element?: HTMLElement;
  domNode?: HTMLElement;

  deleteTargetId?: string;
  deleteTargetNode?: HTMLElement;
};

export type VisualSaveStatus = "draft" | "published";

export type VisualMediaPayload = VisualContentItem & {
  src?: string;
  url?: string;
  secureUrl?: string;
  secure_url?: string;
  originalUrl?: string;
  alt?: string;

  mediaType?: "image" | "video" | "raw" | string;
  resourceType?: "image" | "video" | "raw" | string;
  resource_type?: "image" | "video" | "raw" | string;

  publicId?: string;
  public_id?: string;
  mediaAssetId?: string | null;

  mimeType?: string;
  mime_type?: string;
  originalName?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  folder?: string;
};

export type VisualLinkPayload = {
  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;
};

export type VisualRuntimeCssInput = {
  selectedElementId?: string;
  hoveredElementId?: string;
};

export type VisualEditorController = {
  renderer: StudioTemplateRenderer;

  templateKey?: string;
  templateName?: string;
  businessId?: string;

  canvasRef?: React.RefObject<HTMLElement | null>;
  canvasElement?: HTMLElement | null;
  setCanvasElement?: (node: HTMLElement | null) => void;

  data: Record<string, any>;
  setData?: (
    next:
      | Record<string, any>
      | ((current: Record<string, any>) => Record<string, any>),
  ) => void;
  replaceData?: (
    next:
      | Record<string, any>
      | ((current: Record<string, any>) => Record<string, any>),
  ) => void;
  resetData?: () => void;

  styles: VisualStyleMap;
  content: VisualContentMap;
  animations: VisualAnimationMap;
  deleted: VisualDeletedMap;
  layout: VisualLayoutMap;
  attributes: VisualAttributeMap;
  responsive: VisualResponsiveMap;
  locked: VisualBooleanMap;
  hidden: VisualBooleanMap;

  pages?: StudioSitePage[];
  activePageId?: string;

  deviceMode: VisualDeviceMode;
  setDeviceMode: (device: VisualDeviceMode) => void;

  isPreviewMode: boolean;
  setIsPreviewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  togglePreviewMode?: () => void;

  isInlineEditing?: boolean;
  setIsInlineEditing?: React.Dispatch<React.SetStateAction<boolean>>;

  selectedElement: VisualSelectedElementWithLink | null;
  hoveredElementId?: string;
  selectionBox?: VisualSelectionBox | null;

  setSelectedElement?: React.Dispatch<
    React.SetStateAction<VisualSelectedElementWithLink | null>
  >;
  setHoveredElementId?: React.Dispatch<React.SetStateAction<string>>;

  selectNode?: (
    node: HTMLElement | null,
  ) => VisualSelectedElementWithLink | null;
  selectByElementId?: (
    elementId: string,
  ) => VisualSelectedElementWithLink | null;
  selectParent?: () => VisualSelectedElementWithLink | null | boolean;
  registerAllVisualElements?: () => void;
  refreshSelectedElement?: () => void;
  clearSelection: () => void;

  contextMenu?: VisualContextMenuState;
  closeContextMenu?: () => void;
  openLinkSettings?: (elementId: string) => void;

  formBuilderModal?: {
    open: boolean;
    elementId: string;
  };
  activeFormBuilderConfig?: BizuplyFormConfig;
  openFormBuilder?: (target?: string | HTMLElement | null) => boolean;
  closeFormBuilder?: () => void;
  updateFormBuilderConfig?: (patch: Partial<BizuplyFormConfig>) => boolean;
  updateFormBuilderField?: (
    fieldId: string,
    patch: Partial<BizuplyFormField>,
  ) => boolean;
  deleteFormBuilderField?: (fieldId: string) => boolean;
  moveFormBuilderField?: (
    fieldId: string,
    direction: "up" | "down",
  ) => boolean;

  customCode?: VisualCustomCode;
  /** Merged effective code (site + page) */
  pageCustomCode?: VisualCustomCode;
  siteCustomCode?: VisualCustomCode;
  updateCustomCode?: (patch: Partial<VisualCustomCode>) => boolean;
  updatePageCustomCode?: (patch: Partial<VisualCustomCode>) => boolean;
  updateSiteCustomCode?: (patch: Partial<VisualCustomCode>) => boolean;

  runtimeCss?: string;
  buildRuntimeCss?: (input?: VisualRuntimeCssInput) => string;

  handleCanvasClick?: React.MouseEventHandler<HTMLElement>;
  handleCanvasMouseMove?: React.MouseEventHandler<HTMLElement>;
  handleCanvasMouseLeave?: React.MouseEventHandler<HTMLElement>;
  handleCanvasContextMenu?: React.MouseEventHandler<HTMLElement>;

  updateContent?: (
    elementId: string,
    patch: Record<string, any>,
  ) => boolean | void;
  updateVisualContent?: (
    elementId: string,
    patch: Record<string, any>,
  ) => boolean | void;
  setVisualContent?: (
    elementId: string,
    patch: Record<string, any>,
  ) => boolean | void;

  updateText: (
    elementId: string,
    value: string,
  ) => boolean | void;
  updateInlineText?: (
    elementId: string,
    value: string,
  ) => boolean | void;
  updateElementText?: (
    elementId: string,
    value: string,
  ) => boolean | void;
  updateElementContent?: (
    elementId: string,
    value: string,
  ) => boolean | void;

  updateImage: (
    elementId: string,
    payload: VisualMediaPayload,
  ) => boolean | void;

  updateLink: (
    elementId: string,
    payload: VisualLinkPayload,
  ) => boolean | void;

  applyStyle: (
    elementId: string,
    style: StylePatch,
  ) => boolean | void;
  resetStyle: (
    elementId: string,
  ) => boolean | void;

  applyLayout?: (
    elementId: string,
    layout: VisualLayoutItem,
  ) => boolean | void;
  updateLayout?: (
    elementId: string,
    layout: VisualLayoutItem,
  ) => boolean | void;

  updateAttributes?: (
    elementId: string,
    attributes: Record<string, VisualAttributeValue>,
  ) => boolean | void;

  applyResponsive?: (
    elementId: string,
    device: VisualDeviceMode,
    patch: VisualResponsiveItem,
  ) => boolean | void;

  setAnimation: (
    elementId: string,
    animation: AnimationPresetValue | string,
  ) => boolean | void;
  clearAnimation: (
    elementId: string,
  ) => boolean | void;
  previewAnimation?: (
    elementId?: string,
  ) => boolean | void;

  startInlineTextEdit?: (
    elementId: string,
  ) => boolean | void;
  finishInlineTextEdit?: () => boolean | void;

  openMediaPicker?: (
    elementId: string,
  ) => boolean | void | Promise<boolean | void>;
  openBackgroundMediaPicker?: (
    elementId: string,
  ) => boolean | void | Promise<boolean | void>;

  setElementLocked?: (
    elementId: string,
    locked: boolean,
  ) => boolean | void;
  toggleElementLocked?: (
    elementId?: string,
  ) => boolean | void;

  setElementHidden?: (
    elementId: string,
    hidden: boolean,
  ) => boolean | void;
  toggleElementHidden?: (
    elementId?: string,
  ) => boolean | void;

  duplicateElement?: (
    elementId?: string,
  ) => boolean | void;
  duplicateSelected?: () => boolean | void;

  deleteElement?: (
    elementId?: string,
  ) => boolean | void;
  deleteSelected?: () => boolean | void;
  restoreElement?: (
    elementId: string,
  ) => boolean | void;

  bringForward?: (
    elementId?: string,
  ) => boolean | void;
  sendBackward?: (
    elementId?: string,
  ) => boolean | void;

  applyDataToDom?: () => void;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;

  isSaving: boolean;
  isUploadingMedia?: boolean;
  lastSavedAt?: string;
  saveError?: string;

  save: (
    status?: VisualSaveStatus,
  ) => void | Promise<void> | Promise<any>;
  saveDraft?: () => void | Promise<void> | Promise<any>;
  publish?: () => void | Promise<void> | Promise<any>;

  keys?: {
    VISUAL_STYLE_KEY: string;
    VISUAL_ANIMATION_KEY: string;
    VISUAL_CONTENT_KEY: string;
    VISUAL_DELETED_KEY: string;
    VISUAL_LAYOUT_KEY?: string;
    VISUAL_ATTRIBUTE_KEY?: string;
    VISUAL_RESPONSIVE_KEY?: string;
    VISUAL_LOCKED_KEY?: string;
    VISUAL_HIDDEN_KEY?: string;
  };
};

export type VisualEditableType = VisualEditableElementType;
