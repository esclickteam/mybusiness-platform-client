/**
 * Pure graph transforms for inserting a module on a connection / after a node.
 * Kept free of React Flow so reconnect rules can be unit-tested.
 */

export type FlowEdgeLike = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: unknown;
};

export type InsertOnEdgeArgs = {
  edgeId: string;
  newNodeId: string;
  /** Outgoing handle on the newly inserted node C (e.g. "out", "yes", "path_1"). */
  newNodeSourceHandle: string;
  createEdgeId: () => string;
};

export type InsertOnEdgeResult<E extends FlowEdgeLike> = {
  ok: boolean;
  edges: E[];
  removedEdge: E | null;
};

function handleKey(handle: string | null | undefined, fallback = "out") {
  return handle || fallback;
}

/**
 * A -> B + insert C on that edge => A -> C -> B
 * Removes ONLY the clicked edge (by id).
 * Preserves A->C sourceHandle and C->B targetHandle from the old edge.
 */
export function reconnectInsertOnEdge<E extends FlowEdgeLike>(
  edges: E[],
  args: InsertOnEdgeArgs
): InsertOnEdgeResult<E> {
  const removedEdge = edges.find((edge) => edge.id === args.edgeId) || null;
  if (!removedEdge) {
    return { ok: false, edges, removedEdge: null };
  }

  const remaining = edges.filter((edge) => edge.id !== args.edgeId);

  const edgeAC = {
    id: args.createEdgeId(),
    source: removedEdge.source,
    target: args.newNodeId,
    sourceHandle: removedEdge.sourceHandle ?? undefined,
    targetHandle: undefined,
    label: typeof removedEdge.label === "string" ? removedEdge.label : undefined,
  } as E;

  const edgeCB = {
    id: args.createEdgeId(),
    source: args.newNodeId,
    target: removedEdge.target,
    sourceHandle: args.newNodeSourceHandle,
    targetHandle: removedEdge.targetHandle ?? undefined,
    label: undefined,
  } as E;

  return {
    ok: true,
    edges: [...remaining, edgeAC, edgeCB],
    removedEdge,
  };
}

export type SpliceAfterNodeArgs = {
  afterNodeId: string;
  newNodeId: string;
  newNodeSourceHandle: string;
  afterSourceHandle: string;
  createEdgeId: () => string;
};

/**
 * Splice a node after afterNodeId on a specific source handle.
 */
export function spliceNodeAfterHandle<E extends FlowEdgeLike>(
  edges: E[],
  args: SpliceAfterNodeArgs
): { edges: E[]; replaced: E[] } {
  const afterHandle = handleKey(args.afterSourceHandle);
  const replaced = edges.filter(
    (edge) =>
      edge.source === args.afterNodeId &&
      handleKey(edge.sourceHandle) === afterHandle
  );
  const replacedIds = new Set(replaced.map((edge) => edge.id));
  const remaining = edges.filter((edge) => !replacedIds.has(edge.id));

  const edgeToNew = {
    id: args.createEdgeId(),
    source: args.afterNodeId,
    target: args.newNodeId,
    sourceHandle: args.afterSourceHandle,
    targetHandle: undefined,
    label: undefined,
  } as E;

  const reconnected = replaced.map(
    (oldEdge) =>
      ({
        id: args.createEdgeId(),
        source: args.newNodeId,
        target: oldEdge.target,
        sourceHandle: args.newNodeSourceHandle,
        targetHandle: oldEdge.targetHandle ?? undefined,
        label: typeof oldEdge.label === "string" ? oldEdge.label : undefined,
      }) as E
  );

  return {
    edges: [...remaining, edgeToNew, ...reconnected],
    replaced,
  };
}