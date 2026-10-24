import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  X,
} from "lucide-react";
import {
  browseMetaDetailedTargeting,
  searchMetaDetailedTargeting,
  suggestMetaDetailedTargeting,
  type MetaDetailedTarget,
} from "../../../../../../api/metaCampaignsApi";
import type { AdSetDetailedTarget } from "../adsManagerTypes";

type Props = {
  businessId: string | null;
  selected: AdSetDetailedTarget[];
  onChange: (next: AdSetDetailedTarget[]) => void;
  browseFn?: typeof browseMetaDetailedTargeting;
  searchFn?: typeof searchMetaDetailedTargeting;
  suggestFn?: typeof suggestMetaDetailedTargeting;
};

type BrowseBranch = "demographics" | "interests" | "behaviors";
type PanelMode = "closed" | "suggestions" | "search" | "browse";
type SuggestSort = "relevance" | "size";

type TreeNode = {
  key: string;
  name: string;
  path: string[];
  branch: BrowseBranch;
  type: string;
  id: string;
  selectable: boolean;
  unsupportedReason?: string;
  description: string;
  audienceSize?: number | null;
  audienceSizeLower?: number | null;
  children: TreeNode[];
};

const ROOT_BRANCHES: Array<{
  id: BrowseBranch;
  labelKey: string;
  pathRoots: RegExp;
}> = [
  {
    id: "demographics",
    labelKey: "browseDemographics",
    pathRoots: /demographic|דמוגרפ/i,
  },
  {
    id: "interests",
    labelKey: "browseInterests",
    pathRoots: /interest|תחומי עניין|תחום עניין/i,
  },
  {
    id: "behaviors",
    labelKey: "browseBehaviors",
    pathRoots: /behavior|התנהג/i,
  },
];

function isSyntheticName(name?: string) {
  const n = String(name || "").trim();
  return !n || n === "__ROOT__" || /^__+ROOT__+$/i.test(n);
}

/** True only for Meta taxonomy root folder labels — not leaf names that contain those words. */
function isBranchRootLabel(segment?: string) {
  return /^(demographics?|interests?|behaviors?|דמוגרפיה|תחומי עניין|תחום עניין|התנהגויות|התנהגות)$/i.test(
    String(segment || "").trim()
  );
}

function formatAudienceCount(value?: number | null, locale = "he-IL") {
  if (value == null || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    return "";
  }
  const tag = String(locale || "he").toLowerCase().startsWith("he")
    ? "he-IL"
    : "en-US";
  return new Intl.NumberFormat(tag).format(Math.round(Number(value)));
}

/** Meta Ads Manager style: full numeric range, not abbreviated 1740.2M. */
function formatAudienceSizeRange(
  lower?: number | null,
  upper?: number | null,
  locale = "he-IL"
) {
  const hi = formatAudienceCount(upper ?? lower, locale);
  const lo = formatAudienceCount(lower, locale);
  if (lo && hi && lo !== hi) return `${lo} - ${hi}`;
  return hi || lo || "";
}

function branchOf(item: MetaDetailedTarget): BrowseBranch {
  const explicit = String(item.branch || "").toLowerCase();
  if (
    explicit === "demographics" ||
    explicit === "interests" ||
    explicit === "behaviors"
  ) {
    return explicit;
  }
  const type = String(item.type || "").toLowerCase();
  if (type === "interests" || type === "interest") return "interests";
  if (type === "behaviors" || type === "behavior") return "behaviors";
  if (
    /life_events|family_statuses|relationship_statuses|education_statuses|college_years|work_|industries|income|politics|demographic/.test(
      type
    )
  ) {
    return "demographics";
  }
  const root = String(item.path?.[0] || item.name || "");
  if (/interest|תחומי עניין/i.test(root)) return "interests";
  if (/behavior|התנהג/i.test(root)) return "behaviors";
  if (/demographic|דמוגרפ/i.test(root)) return "demographics";
  return "interests";
}

/**
 * Meta targetingbrowse `path` is the parent chain; `name` is this node.
 * Some rows already include `name` as the last path segment — don't duplicate.
 * Getting this wrong flattens folders (e.g. Banking absorbs Retail banking's id).
 */
function itemFullPath(item: MetaDetailedTarget, branch: BrowseBranch): string[] {
  const raw = Array.isArray(item.path)
    ? item.path.map((p) => String(p || "").trim()).filter(Boolean)
    : [];
  const rootLabel =
    branch === "demographics"
      ? "Demographics"
      : branch === "behaviors"
        ? "Behaviors"
        : "Interests";
  const name = String(item.name || "").trim();

  let parents = raw.slice();
  if (!parents.length) {
    if (name && !isSyntheticName(name) && isBranchRootLabel(name)) return [name];
    parents = [rootLabel];
  } else {
    const first = parents[0];
    const matchesRoot = ROOT_BRANCHES.find((b) => b.id === branch)?.pathRoots.test(
      first
    );
    if (!matchesRoot) parents = [rootLabel, ...parents];
  }

  if (!name || isSyntheticName(name)) return parents;
  if (parents[parents.length - 1] === name) return parents;
  return [...parents, name];
}

function buildBrowseForest(rows: MetaDetailedTarget[]): Record<BrowseBranch, TreeNode[]> {
  const roots: Record<BrowseBranch, TreeNode> = {
    demographics: {
      key: "demographics",
      name: "Demographics",
      path: ["Demographics"],
      branch: "demographics",
      type: "demographics",
      id: "",
      selectable: false,
      unsupportedReason: "category",
      description: "",
      children: [],
    },
    interests: {
      key: "interests",
      name: "Interests",
      path: ["Interests"],
      branch: "interests",
      type: "interests",
      id: "",
      selectable: false,
      unsupportedReason: "category",
      description: "",
      children: [],
    },
    behaviors: {
      key: "behaviors",
      name: "Behaviors",
      path: ["Behaviors"],
      branch: "behaviors",
      type: "behaviors",
      id: "",
      selectable: false,
      unsupportedReason: "category",
      description: "",
      children: [],
    },
  };

  const ensureChild = (
    parent: TreeNode,
    name: string,
    fullPath: string[],
    seed?: MetaDetailedTarget
  ): TreeNode => {
    const key = fullPath.join("›");
    let child = parent.children.find((c) => c.key === key || c.name === name);
    const seedSelectable = Boolean(seed?.id && seed.selectable !== false);
    if (!child) {
      child = {
        key,
        name,
        path: fullPath,
        branch: parent.branch,
        type: seed?.type || parent.type,
        id: seedSelectable ? String(seed!.id) : "",
        selectable: seedSelectable,
        unsupportedReason: seed?.unsupportedReason || (seedSelectable ? "" : "category"),
        description: seed?.description || "",
        audienceSize: seed?.audienceSize ?? null,
        audienceSizeLower: seed?.audienceSizeLower ?? null,
        children: [],
      };
      parent.children.push(child);
    } else if (seedSelectable) {
      // Never turn an already-expanded folder into a leaf just because a Meta
      // row reused the folder path — that was the Banking flatten bug.
      if (child.children.length > 0 && child.name !== String(seed!.name || "")) {
        return child;
      }
      child.id = String(seed!.id);
      child.selectable = true;
      child.unsupportedReason = "";
      child.type = seed!.type || child.type;
      child.description = seed!.description || child.description;
      child.audienceSize = seed!.audienceSize ?? child.audienceSize;
      child.audienceSizeLower = seed!.audienceSizeLower ?? child.audienceSizeLower;
    } else if (seed?.unsupportedReason && !child.selectable) {
      child.unsupportedReason = seed.unsupportedReason;
      child.type = seed.type || child.type;
      child.description = seed.description || child.description;
      if (seed.audienceSize != null) child.audienceSize = seed.audienceSize;
    }
    return child;
  };

  rows.forEach((item) => {
    if (isSyntheticName(item.name)) return;
    const branch = branchOf(item);
    const path = itemFullPath(item, branch);
    // Skip taxonomy root rows — they are the synthetic forest roots.
    if (path.length <= 1) return;
    let cursor = roots[branch];
    for (let i = 1; i < path.length; i += 1) {
      const segment = path[i];
      if (isSyntheticName(segment)) continue;
      // Avoid nesting "Interests" under Interests when Meta duplicates the root name.
      // Do NOT use loose /demographic/ matching — leaf names like
      // "Legacy demographic cluster" must remain in the tree.
      if (isBranchRootLabel(segment)) continue;
      const isLeaf = i === path.length - 1;
      cursor = ensureChild(
        cursor,
        segment,
        path.slice(0, i + 1),
        isLeaf ? item : undefined
      );
    }
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    nodes.forEach((n) => sortNodes(n.children));
  };
  (Object.keys(roots) as BrowseBranch[]).forEach((key) =>
    sortNodes(roots[key].children)
  );

  return {
    demographics: roots.demographics.children,
    interests: roots.interests.children,
    behaviors: roots.behaviors.children,
  };
}

function toDraftItem(item: {
  id: string;
  name: string;
  type?: string;
  path?: string[];
  description?: string;
  audienceSize?: number | null;
  audienceSizeLower?: number | null;
}): AdSetDetailedTarget | null {
  const id = String(item.id || "").trim();
  if (!id) return null;
  return {
    id,
    name: String(item.name || id),
    type: String(item.type || "interests"),
    path: Array.isArray(item.path) ? item.path : [],
    description: item.description || "",
    audienceSize: item.audienceSize ?? null,
    audienceSizeLower: item.audienceSizeLower ?? null,
  };
}

type BrowseUiCache = {
  businessId: string;
  locale: string;
  panelMode: PanelMode;
  browseStack: BrowseBranch[];
  browseFolderKey: string | null;
  browseRows: MetaDetailedTarget[];
  suggestSort: SuggestSort;
};

let browseUiCache: BrowseUiCache | null = null;

function localeForLang(language?: string) {
  return language?.startsWith("he") ? "he_IL" : "en_US";
}

/** Test helper — clears in-memory browse UI between cases. */
export function __resetDetailedTargetingBrowseCacheForTests() {
  browseUiCache = null;
}

export default function AdsManagerDetailedTargetingSection({
  businessId,
  selected,
  onChange,
  browseFn = browseMetaDetailedTargeting,
  searchFn = searchMetaDetailedTargeting,
  suggestFn = suggestMetaDetailedTargeting,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.dir?.() || document?.dir || "rtl") === "rtl";
  const ChevronDrill = isRtl ? ChevronLeft : ChevronRight;
  const ChevronBack = isRtl ? ChevronRight : ChevronLeft;
  const boxRef = useRef<HTMLDivElement | null>(null);
  const reqId = useRef(0);
  const suggestReqId = useRef(0);
  const browseReqId = useRef(0);
  const locale = localeForLang(i18n.language);
  const cached =
    businessId &&
    browseUiCache &&
    browseUiCache.businessId === businessId &&
    browseUiCache.locale === locale
      ? browseUiCache
      : null;

  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [panelMode, setPanelMode] = useState<PanelMode>(
    () => cached?.panelMode || "closed"
  );
  const [searchResults, setSearchResults] = useState<MetaDetailedTarget[]>([]);
  const [suggestResults, setSuggestResults] = useState<MetaDetailedTarget[]>([]);
  const [suggestSort, setSuggestSort] = useState<SuggestSort>(
    () => cached?.suggestSort || "relevance"
  );
  const [suggestBusy, setSuggestBusy] = useState(false);
  const [suggestSource, setSuggestSource] = useState("");
  const [suggestApiGap, setSuggestApiGap] = useState("");
  const [infoTarget, setInfoTarget] = useState<MetaDetailedTarget | null>(null);
  const [browseRows, setBrowseRows] = useState<MetaDetailedTarget[]>(
    () => cached?.browseRows || []
  );
  const [browseBusy, setBrowseBusy] = useState(false);
  /** Drill-down stack: empty = 3 roots; [branch] = that branch's children; deeper via folderKey path. */
  const [browseStack, setBrowseStack] = useState<BrowseBranch[]>(
    () => cached?.browseStack || []
  );
  const [browseFolderKey, setBrowseFolderKey] = useState<string | null>(
    () => cached?.browseFolderKey || null
  );
  const [infoKey, setInfoKey] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => new Set(selected.map((item) => item.id).filter(Boolean)),
    [selected]
  );
  /** Stable seed key — parent often recreates `selected` arrays every render. */
  const selectedSeedKey = useMemo(
    () =>
      selected
        .filter((row) => row.id)
        .map((row) => `${row.type || "interests"}:${row.id}`)
        .join("|"),
    [selected]
  );
  const selectedRef = useRef(selected);
  const selectedIdsRef = useRef(selectedIds);
  selectedRef.current = selected;
  selectedIdsRef.current = selectedIds;

  const forest = useMemo(() => buildBrowseForest(browseRows), [browseRows]);

  const scopeKey = `${businessId || ""}:${locale}`;
  const scopeRef = useRef(scopeKey);

  useEffect(() => {
    if (scopeRef.current === scopeKey) return;
    scopeRef.current = scopeKey;
    const hit =
      businessId &&
      browseUiCache &&
      browseUiCache.businessId === businessId &&
      browseUiCache.locale === locale
        ? browseUiCache
        : null;
    if (hit) {
      setPanelMode(hit.panelMode);
      setBrowseRows(hit.browseRows);
      setBrowseStack(hit.browseStack);
      setBrowseFolderKey(hit.browseFolderKey);
      setSuggestSort(hit.suggestSort);
      return;
    }
    setPanelMode("closed");
    setBrowseRows([]);
    setBrowseStack([]);
    setBrowseFolderKey(null);
    setSearchResults([]);
    setSuggestResults([]);
    setInfoKey(null);
  }, [scopeKey, businessId, locale]);

  useEffect(() => {
    if (!businessId) {
      browseUiCache = null;
      return;
    }
    browseUiCache = {
      businessId,
      locale,
      panelMode,
      browseStack,
      browseFolderKey,
      browseRows,
      suggestSort,
    };
  }, [
    businessId,
    locale,
    panelMode,
    browseStack,
    browseFolderKey,
    browseRows,
    suggestSort,
  ]);

  const loadBrowse = useCallback(async () => {
    if (!businessId) return;
    const id = ++browseReqId.current;
    setBrowseBusy(true);
    setError("");
    try {
      const data = await browseFn(businessId, { locale });
      if (browseReqId.current !== id) return;
      setBrowseRows((data.results || []).filter((row) => !isSyntheticName(row.name)));
    } catch (err) {
      if (browseReqId.current !== id) return;
      setError(
        err instanceof Error
          ? err.message
          : t("metaCampaigns.adsManager.chrome.detailedBrowseFailed")
      );
    } finally {
      if (browseReqId.current === id) setBrowseBusy(false);
    }
  }, [businessId, browseFn, locale, t]);

  const loadSuggestions = useCallback(async () => {
    if (!businessId) return;
    const id = ++suggestReqId.current;
    const seedList = selectedRef.current
      .filter((row) => row.id)
      .map((row) => ({ id: row.id, type: row.type || "interests" }));
    const excludeIds = selectedIdsRef.current;
    setSuggestBusy(true);
    setError("");
    try {
      const data = await suggestFn(businessId, {
        locale,
        sort: suggestSort,
        limit: 30,
        targetingList: seedList,
      });
      if (suggestReqId.current !== id) return;
      setSuggestSource(String(data.source || ""));
      setSuggestApiGap(String(data.apiGap || ""));
      setSuggestResults(
        (data.results || []).filter(
          (row) => row.id && row.selectable !== false && !excludeIds.has(row.id)
        )
      );
    } catch (err) {
      if (suggestReqId.current !== id) return;
      setSuggestResults([]);
      setSuggestSource("");
      setSuggestApiGap("");
      setError(
        err instanceof Error
          ? err.message
          : t("metaCampaigns.adsManager.chrome.detailedSuggestionsFailed")
      );
    } finally {
      if (suggestReqId.current === id) setSuggestBusy(false);
    }
  }, [businessId, suggestFn, locale, suggestSort, t]);

  useEffect(() => {
    if (panelMode !== "browse") return;
    if (browseRows.length || browseBusy) return;
    void loadBrowse();
  }, [panelMode, browseRows.length, browseBusy, loadBrowse]);

  useEffect(() => {
    if (panelMode !== "suggestions") return;
    void loadSuggestions();
  }, [panelMode, suggestSort, selectedSeedKey, loadSuggestions]);

  useEffect(() => {
    if (!businessId) return;
    const q = query.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setPanelMode((prev) => (prev === "search" ? "suggestions" : prev));
      setBusy(false);
      return;
    }
    const id = ++reqId.current;
    const timer = window.setTimeout(async () => {
      try {
        setBusy(true);
        setError("");
        setPanelMode("search");
        const data = await searchFn(businessId, {
          q,
          locale,
          limit: 25,
        });
        if (reqId.current !== id) return;
        setSearchResults(
          (data.results || []).filter(
            (row) => row.id && row.selectable !== false
          )
        );
      } catch (err) {
        if (reqId.current !== id) return;
        setSearchResults([]);
        setError(
          err instanceof Error
            ? err.message
            : t("metaCampaigns.adsManager.chrome.detailedSearchFailed")
        );
      } finally {
        if (reqId.current === id) setBusy(false);
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [businessId, query, searchFn, locale, t]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !boxRef.current) return;
      // Ignore detached targets from in-panel re-renders (drill-down replaces
      // the clicked node before the bubble reaches document).
      if (!document.contains(target)) return;
      if (boxRef.current.contains(target)) return;
      setPanelMode("closed");
      setInfoKey(null);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const addItem = (item: AdSetDetailedTarget) => {
    if (!item.id || selectedIds.has(item.id)) return;
    onChange([...selected, item]);
  };

  const removeItem = (id: string) => {
    onChange(selected.filter((item) => item.id !== id));
  };

  const unsupportedLabel = (reason?: string) => {
    if (reason === "unsupported_flexible_spec") {
      return t("metaCampaigns.adsManager.chrome.targetingUnsupportedFlexible");
    }
    if (reason === "category_not_selectable") {
      return t("metaCampaigns.adsManager.chrome.targetingCategoryNotSelectable");
    }
    return "";
  };

  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      const hit = findNodeByKey(node.children, key);
      if (hit) return hit;
    }
    return null;
  };

  const browseBranch = browseStack[0] || null;
  const browseNodes: TreeNode[] = useMemo(() => {
    if (!browseBranch) return [];
    const roots = forest[browseBranch] || [];
    if (!browseFolderKey) return roots;
    const folder = findNodeByKey(roots, browseFolderKey);
    return folder?.children || [];
  }, [browseBranch, browseFolderKey, forest]);

  const browseHeaderLabel = useMemo(() => {
    if (!browseBranch) return "";
    if (!browseFolderKey) {
      return t(
        `metaCampaigns.adsManager.chrome.${
          ROOT_BRANCHES.find((b) => b.id === browseBranch)?.labelKey
        }`
      );
    }
    const folder = findNodeByKey(forest[browseBranch] || [], browseFolderKey);
    return folder?.name || "";
  }, [browseBranch, browseFolderKey, forest, t]);

  const openSuggestions = () => {
    setBrowseStack([]);
    setBrowseFolderKey(null);
    setInfoKey(null);
    setPanelMode("suggestions");
  };

  const openBrowse = () => {
    setQuery("");
    setSearchResults([]);
    setBrowseStack([]);
    setBrowseFolderKey(null);
    setInfoKey(null);
    setPanelMode((prev) => (prev === "browse" ? "closed" : "browse"));
  };

  const drillIntoBranch = (branch: BrowseBranch) => {
    setBrowseStack([branch]);
    setBrowseFolderKey(null);
    setInfoKey(null);
  };

  const drillIntoFolder = (node: TreeNode) => {
    if (!node.children.length) return;
    setBrowseStack([node.branch]);
    setBrowseFolderKey(node.key);
    setInfoKey(null);
  };

  const browseBack = () => {
    if (browseFolderKey && browseBranch) {
      const folder = findNodeByKey(forest[browseBranch] || [], browseFolderKey);
      const parentPath = folder?.path?.slice(0, -1) || [];
      if (parentPath.length <= 1) {
        setBrowseFolderKey(null);
        return;
      }
      const parentKey = parentPath.join("›");
      const parent = findNodeByKey(forest[browseBranch] || [], parentKey);
      setBrowseFolderKey(parent?.key || null);
      return;
    }
    setBrowseStack([]);
    setBrowseFolderKey(null);
  };

  const toggleSelectNode = (node: TreeNode) => {
    if (!node.selectable || !node.id) return;
    if (selectedIds.has(node.id)) {
      removeItem(node.id);
      return;
    }
    const draft = toDraftItem(node);
    if (draft) addItem(draft);
  };

  const typeLabel = (type?: string) => {
    const tpe = String(type || "").toLowerCase();
    if (tpe === "interests" || tpe === "interest") {
      return t("metaCampaigns.adsManager.chrome.browseInterests");
    }
    if (tpe === "behaviors" || tpe === "behavior") {
      return t("metaCampaigns.adsManager.chrome.browseBehaviors");
    }
    return t("metaCampaigns.adsManager.chrome.browseDemographics");
  };

  const pathLabel = (item: MetaDetailedTarget) => {
    const parts = Array.isArray(item.path)
      ? item.path.map((p) => String(p || "").trim()).filter(Boolean)
      : [];
    if (!parts.length) return typeLabel(item.type);
    // Meta shows parent chain without repeating the leaf name when identical.
    const leaf = String(item.name || "").trim();
    const parents =
      parts[parts.length - 1] === leaf ? parts.slice(0, -1) : parts;
    return parents.join(" > ") || typeLabel(item.type);
  };

  const renderInfoPane = (item: MetaDetailedTarget | TreeNode | null) => {
    if (!item) return null;
    const name = "name" in item ? item.name : "";
    const description =
      ("description" in item && item.description) ||
      t("metaCampaigns.adsManager.chrome.targetingInfoFallback");
    const range = formatAudienceSizeRange(
      item.audienceSizeLower,
      item.audienceSize,
      locale
    );
    const path = Array.isArray(item.path) ? item.path.filter(Boolean) : [];
    return (
      <aside
        className="flex w-[min(260px,42%)] shrink-0 flex-col gap-2 overflow-y-auto border-s border-[#E4E6EB] bg-[#F7F8FA] px-3 py-3 text-start"
        data-testid="detailed-targeting-info-pane"
      >
        <p className="text-[13px] font-bold text-[#050505]">{name}</p>
        <p className="text-[12px] leading-snug text-[#65676B]">{description}</p>
        {range ? (
          <p className="text-[12px] font-semibold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.audienceSizeLabel")}
            {": "}
            <span dir="ltr">{range}</span>
          </p>
        ) : null}
        {path.length ? (
          <p className="text-[11px] leading-snug text-[#8A8D91]">
            {path.join(" › ")}
          </p>
        ) : null}
      </aside>
    );
  };

  const renderResultRow = (
    item: MetaDetailedTarget,
    opts?: { onPick?: () => void }
  ) => {
    const selectedRow = selectedIds.has(item.id);
    const range = formatAudienceSizeRange(
      item.audienceSizeLower,
      item.audienceSize,
      locale
    );
    const infoOpen = infoTarget?.id === item.id;
    return (
      <div
        key={`${item.type}:${item.id}`}
        className={[
          "flex w-full items-start gap-2 border-b border-[#F0F2F5] px-3 py-2.5",
          selectedRow ? "bg-[#E7F3FF]" : "hover:bg-[#F7F8FA]",
        ].join(" ")}
      >
        <button
          type="button"
          className={[
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
            selectedRow
              ? "border-[#1877F2] bg-[#1877F2] text-white"
              : "border-[#CED0D4] bg-white text-transparent",
          ].join(" ")}
          aria-pressed={selectedRow}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (selectedRow) {
              removeItem(item.id);
              return;
            }
            const draft = toDraftItem(item);
            if (draft) {
              addItem(draft);
              opts?.onPick?.();
            }
          }}
        >
          <Check className="h-3 w-3" />
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 text-start"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (selectedRow) return;
            const draft = toDraftItem(item);
            if (draft) {
              addItem(draft);
              opts?.onPick?.();
            }
          }}
        >
          <span className="block truncate text-[13px] font-semibold text-[#050505]">
            {item.name}
          </span>
          <span className="block truncate text-[11px] text-[#65676B]">
            {pathLabel(item)}
          </span>
        </button>
        {range ? (
          <span
            className="max-w-[42%] shrink-0 pt-0.5 text-end text-[11px] font-semibold tabular-nums text-[#65676B]"
            dir="ltr"
          >
            {range}
          </span>
        ) : null}
        <button
          type="button"
          className={[
            "mt-0.5 shrink-0",
            infoOpen ? "text-[#1877F2]" : "text-[#8A8D91] hover:text-[#1877F2]",
          ].join(" ")}
          aria-label={t("metaCampaigns.adsManager.chrome.targetingInfo")}
          aria-pressed={infoOpen}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            setInfoTarget((prev) => (prev?.id === item.id ? null : item));
            setInfoKey(null);
          }}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  const renderBrowseRow = (node: TreeNode) => {
    const hasChildren = node.children.length > 0;
    const selectedRow = node.id ? selectedIds.has(node.id) : false;
    const range = formatAudienceSizeRange(
      node.audienceSizeLower,
      node.audienceSize,
      locale
    );
    const showInfo = infoKey === node.key;
    const blockedHint = !node.selectable
      ? unsupportedLabel(node.unsupportedReason)
      : "";

    return (
      <div key={node.key}>
        <div className="flex items-center gap-2 border-b border-[#F0F2F5] px-3 py-2.5 hover:bg-[#F7F8FA]">
          {node.selectable ? (
            <button
              type="button"
              className={[
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                selectedRow
                  ? "border-[#1877F2] bg-[#1877F2] text-white"
                  : "border-[#CED0D4] bg-white text-transparent",
              ].join(" ")}
              onClick={() => toggleSelectNode(node)}
              aria-pressed={selectedRow}
            >
              <Check className="h-3 w-3" />
            </button>
          ) : (
            <span className="h-4 w-4 shrink-0" aria-hidden />
          )}

          <button
            type="button"
            className="min-w-0 flex-1 text-start"
            onClick={() => {
              if (hasChildren) drillIntoFolder(node);
              else if (node.selectable) toggleSelectNode(node);
              else {
                setInfoKey((prev) => (prev === node.key ? null : node.key));
                setInfoTarget(null);
              }
            }}
          >
            <span className="block truncate text-[13px] font-semibold text-[#050505]">
              {node.name}
            </span>
            {blockedHint && !hasChildren ? (
              <span className="mt-0.5 block text-[11px] font-semibold text-[#8A8D91]">
                {blockedHint}
              </span>
            ) : null}
          </button>

          {range ? (
            <span
              className="max-w-[40%] shrink-0 text-end text-[11px] font-semibold tabular-nums text-[#65676B]"
              dir="ltr"
            >
              {range}
            </span>
          ) : null}

          <button
            type="button"
            className={[
              "shrink-0",
              showInfo ? "text-[#1877F2]" : "text-[#8A8D91] hover:text-[#1877F2]",
            ].join(" ")}
            aria-label={t("metaCampaigns.adsManager.chrome.targetingInfo")}
            onClick={(e) => {
              e.stopPropagation();
              setInfoKey((prev) => (prev === node.key ? null : node.key));
              setInfoTarget(null);
            }}
          >
            <Info className="h-3.5 w-3.5" />
          </button>

          {hasChildren ? (
            <button
              type="button"
              className="shrink-0 text-[#65676B]"
              aria-label="expand"
              onClick={() => drillIntoFolder(node)}
            >
              <ChevronDrill className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  const panelOpen = panelMode !== "closed";

  return (
    <div
      className="rounded-lg border border-[#E4E6EB] px-3.5 py-3"
      data-testid="ads-manager-detailed-targeting"
    >
      <p className="text-[15px] font-bold text-[#050505]">
        {t("metaCampaigns.adsManager.chrome.detailedTargeting")}
      </p>
      <p className="mt-2 text-[13px] font-semibold text-[#65676B]">
        {t("metaCampaigns.adsManager.chrome.includePeopleMatching")}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {selected.length ? (
          selected.map((item) => (
            <span
              key={item.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#1877F2]/30 bg-[#E7F3FF] px-2.5 py-1 text-[12px] font-semibold text-[#1877F2]"
            >
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-white/70"
                aria-label={`${t("metaCampaigns.form.remove")}: ${item.name}`}
                data-remove-id={item.id}
                onClick={() => removeItem(item.id)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-[14px] font-semibold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.allDemographics")}
          </p>
        )}
      </div>

      <div className="relative mt-2" ref={boxRef}>
        <div
          className={[
            "flex min-h-[40px] overflow-hidden rounded-lg border bg-white",
            panelOpen
              ? "border-[#1877F2] shadow-[0_0_0_1px_#1877F2]"
              : "border-[#CED0D4]",
          ].join(" ")}
        >
          <label className="relative flex min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute start-3 h-4 w-4 shrink-0 text-[#8A8D91]" />
            <input
              className="h-10 w-full border-0 bg-transparent py-0 ps-9 pe-3 text-[14px] text-[#050505] outline-none placeholder:text-[#8A8D91]"
              placeholder={t(
                "metaCampaigns.adsManager.chrome.detailedSearchPlaceholder"
              )}
              aria-label={t(
                "metaCampaigns.adsManager.chrome.detailedSearchPlaceholder"
              )}
              data-testid="detailed-targeting-search"
              value={query}
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onFocus={() => {
                if (query.trim().length >= 2) {
                  setPanelMode("search");
                } else {
                  openSuggestions();
                }
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (query.trim().length < 2) openSuggestions();
              }}
            />
            {busy || suggestBusy ? (
              <span className="absolute end-3 text-[11px] font-semibold text-[#65676B]">
                …
              </span>
            ) : null}
          </label>

          <div className="relative shrink-0 border-s border-[#CED0D4]">
            <button
              type="button"
              className={[
                "flex h-full items-center gap-1 px-3 text-[13px] font-semibold",
                panelMode === "browse"
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#050505] hover:bg-[#F0F2F5]",
              ].join(" ")}
              aria-label={t(
                "metaCampaigns.adsManager.chrome.detailedBrowseAria"
              )}
              aria-expanded={panelMode === "browse"}
              data-testid="detailed-targeting-browse"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openBrowse();
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            >
              {t("metaCampaigns.adsManager.chrome.browse")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {panelOpen ? (
          <div
            className={[
              "absolute top-full z-[1300] mt-1 flex max-h-[min(480px,62vh)] flex-col overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
              infoTarget || infoKey ? "inset-x-0 min-w-[min(100%,560px)]" : "inset-x-0",
            ].join(" ")}
            dir={isRtl ? "rtl" : "ltr"}
            data-testid="detailed-targeting-panel"
            data-panel-mode={panelMode}
            role="listbox"
            aria-label={t("metaCampaigns.adsManager.chrome.detailedTargeting")}
          >
            {panelMode === "suggestions" ? (
              <>
                <div
                  className="flex shrink-0 border-b border-[#E4E6EB]"
                  data-testid="detailed-targeting-suggest-tabs"
                >
                  {(["relevance", "size"] as SuggestSort[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={[
                        "flex-1 px-3 py-2.5 text-[13px] font-semibold",
                        suggestSort === tab
                          ? "border-b-2 border-[#1877F2] text-[#1877F2]"
                          : "text-[#65676B] hover:bg-[#F7F8FA]",
                      ].join(" ")}
                      data-testid={`suggest-tab-${tab}`}
                      onClick={() => setSuggestSort(tab)}
                    >
                      {tab === "relevance"
                        ? t("metaCampaigns.adsManager.chrome.suggestionsRelevance")
                        : t("metaCampaigns.adsManager.chrome.suggestionsSize")}
                    </button>
                  ))}
                </div>
                <div className="flex min-h-0 flex-1 overflow-hidden">
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
                    {suggestBusy && !suggestResults.length ? (
                      <p className="px-3 py-3 text-[13px] text-[#65676B]">
                        {t("metaCampaigns.adsManager.chrome.searching")}
                      </p>
                    ) : null}
                    {suggestResults.map((item) => renderResultRow(item))}
                    {!suggestBusy && !suggestResults.length ? (
                      <p className="px-3 py-3 text-[13px] leading-snug text-[#65676B]">
                        {suggestSource === "unavailable_empty_state" || suggestApiGap
                          ? t(
                              "metaCampaigns.adsManager.chrome.detailedSuggestionsUnavailable"
                            )
                          : t(
                              "metaCampaigns.adsManager.chrome.detailedSuggestionsEmpty"
                            )}
                      </p>
                    ) : null}
                  </div>
                  {infoTarget ? renderInfoPane(infoTarget) : null}
                </div>
              </>
            ) : null}

            {panelMode === "search" ? (
              <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
                  {busy && !searchResults.length ? (
                    <p className="px-3 py-3 text-[13px] text-[#65676B]">
                      {t("metaCampaigns.adsManager.chrome.searching")}
                    </p>
                  ) : null}
                  {searchResults.map((item) =>
                    renderResultRow(item, {
                      onPick: () => {
                        setQuery("");
                        setSearchResults([]);
                        setPanelMode("suggestions");
                      },
                    })
                  )}
                  {!busy &&
                  query.trim().length >= 2 &&
                  !searchResults.length ? (
                    <p className="px-3 py-3 text-[13px] text-[#65676B]">
                      {t("metaCampaigns.adsManager.chrome.detailedSearchEmpty")}
                    </p>
                  ) : null}
                </div>
                {infoTarget ? renderInfoPane(infoTarget) : null}
              </div>
            ) : null}

            {panelMode === "browse" ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {browseStack.length ? (
                  <div className="flex shrink-0 items-center gap-2 border-b border-[#F0F2F5] px-3 py-2.5">
                    <button
                      type="button"
                      className="shrink-0 text-[#65676B]"
                      aria-label={t("metaCampaigns.adsManager.chrome.browseBack")}
                      data-testid="detailed-targeting-browse-back"
                      onClick={browseBack}
                    >
                      <ChevronBack className="h-4 w-4" />
                    </button>
                    <span className="min-w-0 flex-1 truncate text-start text-[13px] font-semibold text-[#050505]">
                      {browseHeaderLabel}
                    </span>
                    <Info className="h-3.5 w-3.5 shrink-0 text-[#8A8D91]" />
                  </div>
                ) : null}
                <div className="flex min-h-0 flex-1 overflow-hidden">
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
                    {browseBusy && !browseRows.length ? (
                      <p className="px-3 py-3 text-[13px] text-[#65676B]">
                        {t("metaCampaigns.adsManager.chrome.searching")}
                      </p>
                    ) : !browseStack.length ? (
                      ROOT_BRANCHES.map((root) => (
                        <button
                          key={root.id}
                          type="button"
                          className="flex w-full items-center gap-2 border-b border-[#F0F2F5] px-3 py-2.5 text-start hover:bg-[#F7F8FA]"
                          onClick={() => drillIntoBranch(root.id)}
                        >
                          <span className="min-w-0 flex-1 text-[13px] font-semibold text-[#050505]">
                            {t(`metaCampaigns.adsManager.chrome.${root.labelKey}`)}
                          </span>
                          <Info className="h-3.5 w-3.5 shrink-0 text-[#8A8D91]" />
                          <ChevronDrill className="h-4 w-4 shrink-0 text-[#65676B]" />
                        </button>
                      ))
                    ) : browseNodes.length ? (
                      browseNodes.map((node) => renderBrowseRow(node))
                    ) : (
                      <p className="px-3 py-3 text-[12px] text-[#65676B]">
                        {t("metaCampaigns.adsManager.chrome.detailedBrowseEmpty")}
                      </p>
                    )}
                  </div>
                  {infoKey
                    ? renderInfoPane(
                        browseNodes.find((n) => n.key === infoKey) || null
                      )
                    : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-[12px] font-semibold text-rose-600">{error}</p>
      ) : null}

      {!businessId ? (
        <p className="mt-2 text-[12px] font-semibold text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.connectToSearchTargeting")}
        </p>
      ) : null}
    </div>
  );
}
