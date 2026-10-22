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
  type MetaDetailedTarget,
} from "../../../../../../api/metaCampaignsApi";
import type { AdSetDetailedTarget } from "../adsManagerTypes";

type Props = {
  businessId: string | null;
  selected: AdSetDetailedTarget[];
  onChange: (next: AdSetDetailedTarget[]) => void;
  /** Test / visual-QA overrides — default to Meta Marketing API clients. */
  browseFn?: typeof browseMetaDetailedTargeting;
  searchFn?: typeof searchMetaDetailedTargeting;
};

type BrowseBranch = "demographics" | "interests" | "behaviors";

type TreeNode = {
  key: string;
  name: string;
  path: string[];
  branch: BrowseBranch;
  type: string;
  id: string;
  selectable: boolean;
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

function formatAudienceSize(value?: number | null) {
  if (value == null || !Number.isFinite(value) || value <= 0) return "";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
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
    /life_events|family_statuses|relationship_statuses|education_statuses|work_|industries|income|politics|demographic/.test(
      type
    )
  ) {
    return "demographics";
  }
  const root = String(item.path?.[0] || "");
  if (/interest|תחומי עניין/i.test(root)) return "interests";
  if (/behavior|התנהג/i.test(root)) return "behaviors";
  if (/demographic|דמוגרפ/i.test(root)) return "demographics";
  return "interests";
}

function normalizePath(item: MetaDetailedTarget, branch: BrowseBranch): string[] {
  const raw = Array.isArray(item.path)
    ? item.path.map((p) => String(p || "").trim()).filter(Boolean)
    : [];
  const rootLabel =
    branch === "demographics"
      ? "Demographics"
      : branch === "behaviors"
        ? "Behaviors"
        : "Interests";
  if (!raw.length) {
    return item.name ? [rootLabel, item.name] : [rootLabel];
  }
  const first = raw[0];
  const matchesRoot = ROOT_BRANCHES.find((b) => b.id === branch)?.pathRoots.test(
    first
  );
  if (matchesRoot) return raw;
  return [rootLabel, ...raw];
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
    if (!child) {
      child = {
        key,
        name,
        path: fullPath,
        branch: parent.branch,
        type: seed?.type || parent.type,
        id: seed?.id && seed.selectable !== false ? String(seed.id) : "",
        selectable: Boolean(seed?.id && seed.selectable !== false),
        description: seed?.description || "",
        audienceSize: seed?.audienceSize ?? null,
        audienceSizeLower: seed?.audienceSizeLower ?? null,
        children: [],
      };
      parent.children.push(child);
    } else if (seed?.id && seed.selectable !== false) {
      child.id = String(seed.id);
      child.selectable = true;
      child.type = seed.type || child.type;
      child.description = seed.description || child.description;
      child.audienceSize = seed.audienceSize ?? child.audienceSize;
      child.audienceSizeLower = seed.audienceSizeLower ?? child.audienceSizeLower;
    }
    return child;
  };

  rows.forEach((item) => {
    const branch = branchOf(item);
    const path = normalizePath(item, branch);
    let cursor = roots[branch];
    for (let i = 1; i < path.length; i += 1) {
      const segment = path[i];
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
    nodes.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    nodes.forEach((n) => sortNodes(n.children));
  };
  (Object.keys(roots) as BrowseBranch[]).forEach((key) => sortNodes(roots[key].children));

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

export default function AdsManagerDetailedTargetingSection({
  businessId,
  selected,
  onChange,
  browseFn = browseMetaDetailedTargeting,
  searchFn = searchMetaDetailedTargeting,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.dir?.() || document?.dir || "rtl") === "rtl";
  const ChevronExpand = isRtl ? ChevronLeft : ChevronRight;
  const boxRef = useRef<HTMLDivElement | null>(null);
  const reqId = useRef(0);

  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<MetaDetailedTarget[]>([]);
  const [browseRows, setBrowseRows] = useState<MetaDetailedTarget[]>([]);
  const [browseBusy, setBrowseBusy] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [infoKey, setInfoKey] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => new Set(selected.map((item) => item.id).filter(Boolean)),
    [selected]
  );

  const forest = useMemo(() => buildBrowseForest(browseRows), [browseRows]);

  const loadBrowse = useCallback(async () => {
    if (!businessId) return;
    setBrowseBusy(true);
    setError("");
    try {
      const locale = i18n.language?.startsWith("he") ? "he_IL" : "en_US";
      const data = await browseFn(businessId, { locale });
      setBrowseRows(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("metaCampaigns.adsManager.chrome.detailedBrowseFailed")
      );
    } finally {
      setBrowseBusy(false);
    }
  }, [businessId, browseFn, i18n.language, t]);

  useEffect(() => {
    if (!browseOpen) return;
    if (browseRows.length || browseBusy) return;
    void loadBrowse();
  }, [browseOpen, browseRows.length, browseBusy, loadBrowse]);

  useEffect(() => {
    if (!businessId) return;
    const q = query.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      setBusy(false);
      return;
    }
    const id = ++reqId.current;
    const timer = window.setTimeout(async () => {
      try {
        setBusy(true);
        setError("");
        const locale = i18n.language?.startsWith("he") ? "he_IL" : "en_US";
        const data = await searchFn(businessId, {
          q,
          locale,
          limit: 25,
        });
        if (reqId.current !== id) return;
        setSearchResults((data.results || []).filter((row) => row.id));
        setSearchOpen(true);
        setBrowseOpen(false);
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
  }, [businessId, query, searchFn, i18n.language, t]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
        setBrowseOpen(false);
        setInfoKey(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const addItem = (item: AdSetDetailedTarget) => {
    if (!item.id || selectedIds.has(item.id)) return;
    onChange([...selected, item]);
  };

  const removeItem = (id: string) => {
    onChange(selected.filter((item) => item.id !== id));
  };

  const toggleSelect = (node: TreeNode) => {
    if (!node.selectable || !node.id) return;
    if (selectedIds.has(node.id)) {
      removeItem(node.id);
      return;
    }
    const draft = toDraftItem(node);
    if (draft) addItem(draft);
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const hasChildren = node.children.length > 0;
    const isOpen = Boolean(expanded[node.key]);
    const selected = node.id ? selectedIds.has(node.id) : false;
    const size = formatAudienceSize(node.audienceSize);
    const showInfo = infoKey === node.key;

    return (
      <div key={node.key}>
        <div
          className="flex items-center gap-2 border-b border-[#F0F2F5] px-3 py-2.5 hover:bg-[#F7F8FA]"
          style={{ paddingInlineStart: 12 + depth * 14 }}
        >
          {hasChildren ? (
            <button
              type="button"
              className="shrink-0 text-[#65676B]"
              aria-label={isOpen ? "collapse" : "expand"}
              onClick={() => toggleExpand(node.key)}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronExpand className="h-4 w-4" />
              )}
            </button>
          ) : node.selectable ? (
            <span className="w-4 shrink-0" />
          ) : (
            <ChevronExpand className="h-4 w-4 shrink-0 text-[#CED0D4]" />
          )}

          {node.selectable ? (
            <button
              type="button"
              className={[
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                selected
                  ? "border-[#1877F2] bg-[#1877F2] text-white"
                  : "border-[#CED0D4] bg-white text-transparent",
              ].join(" ")}
              onClick={() => toggleSelect(node)}
              aria-pressed={selected}
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
              if (hasChildren) toggleExpand(node.key);
              else if (node.selectable) toggleSelect(node);
            }}
          >
            <span className="block truncate text-[13px] font-semibold text-[#050505]">
              {node.name}
            </span>
            {size ? (
              <span className="block truncate text-[11px] text-[#65676B]">
                {t("metaCampaigns.form.audienceSize", { size })}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="shrink-0 text-[#8A8D91] hover:text-[#1877F2]"
            aria-label={t("metaCampaigns.adsManager.chrome.targetingInfo")}
            onClick={(e) => {
              e.stopPropagation();
              setInfoKey((prev) => (prev === node.key ? null : node.key));
            }}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
        {showInfo ? (
          <div
            className="border-b border-[#F0F2F5] bg-[#F7F8FA] px-3 py-2 text-[12px] leading-snug text-[#65676B]"
            style={{ paddingInlineStart: 28 + depth * 14 }}
          >
            {node.description ||
              (node.path.length
                ? node.path.join(" › ")
                : t("metaCampaigns.adsManager.chrome.targetingInfoFallback"))}
            {node.type ? (
              <span className="mt-1 block text-[11px] font-semibold text-[#8A8D91]">
                {node.type}
                {node.id ? ` · ${node.id}` : ""}
              </span>
            ) : null}
          </div>
        ) : null}
        {hasChildren && isOpen
          ? node.children.map((child) => renderNode(child, depth + 1))
          : null}
      </div>
    );
  };

  const panelOpen = browseOpen || (searchOpen && (searchResults.length > 0 || busy));

  return (
    <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
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
            browseOpen || searchOpen
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
              value={query}
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length >= 2) {
                  setBrowseOpen(false);
                }
              }}
              onFocus={() => {
                if (searchResults.length && query.trim().length >= 2) {
                  setSearchOpen(true);
                  setBrowseOpen(false);
                }
              }}
            />
            {busy ? (
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
                browseOpen
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#050505] hover:bg-[#F0F2F5]",
              ].join(" ")}
              onClick={() => {
                setBrowseOpen((v) => !v);
                setSearchOpen(false);
                setInfoKey(null);
              }}
            >
              {t("metaCampaigns.adsManager.chrome.browse")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {panelOpen ? (
          <div className="absolute inset-x-0 top-full z-[1300] mt-1 max-h-[min(420px,55vh)] overflow-y-auto rounded-lg border border-[#CED0D4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            {browseOpen ? (
              browseBusy && !browseRows.length ? (
                <p className="px-3 py-3 text-[13px] text-[#65676B]">
                  {t("metaCampaigns.adsManager.chrome.searching")}
                </p>
              ) : (
                ROOT_BRANCHES.map((root) => {
                  const children = forest[root.id] || [];
                  const rootKey = `root:${root.id}`;
                  const open = expanded[rootKey] ?? false;
                  return (
                    <div key={root.id}>
                      <div className="flex items-center gap-2 border-b border-[#F0F2F5] px-3 py-2.5 hover:bg-[#F7F8FA]">
                        <button
                          type="button"
                          className="shrink-0 text-[#65676B]"
                          onClick={() => toggleExpand(rootKey)}
                        >
                          {open ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronExpand className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-start text-[13px] font-semibold text-[#050505]"
                          onClick={() => toggleExpand(rootKey)}
                        >
                          {t(`metaCampaigns.adsManager.chrome.${root.labelKey}`)}
                        </button>
                        <Info className="h-3.5 w-3.5 shrink-0 text-[#8A8D91]" />
                      </div>
                      {open
                        ? children.length
                          ? children.map((child) => renderNode(child, 1))
                          : (
                              <p className="border-b border-[#F0F2F5] px-3 py-2 text-[12px] text-[#65676B]">
                                {t(
                                  "metaCampaigns.adsManager.chrome.detailedBrowseEmpty"
                                )}
                              </p>
                            )
                        : null}
                    </div>
                  );
                })
              )
            ) : (
              <>
                {busy && !searchResults.length ? (
                  <p className="px-3 py-3 text-[13px] text-[#65676B]">
                    {t("metaCampaigns.adsManager.chrome.searching")}
                  </p>
                ) : null}
                {searchResults.map((item) => {
                  const selectedRow = selectedIds.has(item.id);
                  const size = formatAudienceSize(item.audienceSize);
                  return (
                    <button
                      key={`${item.type}:${item.id}`}
                      type="button"
                      disabled={selectedRow}
                      className="flex w-full items-start gap-2 px-3 py-2.5 text-start hover:bg-[#E7F3FF] disabled:opacity-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        const draft = toDraftItem(item);
                        if (draft) {
                          addItem(draft);
                          setQuery("");
                          setSearchResults([]);
                          setSearchOpen(false);
                        }
                      }}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-[#050505]">
                          {item.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#65676B]">
                          {[
                            item.path?.slice(-2).join(" › "),
                            item.type,
                            size
                              ? t("metaCampaigns.form.audienceSize", { size })
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-bold text-[#1877F2]">
                        {selectedRow
                          ? t("metaCampaigns.adsManager.chrome.added")
                          : t("metaCampaigns.adsManager.chrome.add")}
                      </span>
                    </button>
                  );
                })}
                {!busy &&
                query.trim().length >= 2 &&
                !searchResults.length ? (
                  <p className="px-3 py-3 text-[13px] text-[#65676B]">
                    {t("metaCampaigns.adsManager.chrome.detailedSearchEmpty")}
                  </p>
                ) : null}
              </>
            )}
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
