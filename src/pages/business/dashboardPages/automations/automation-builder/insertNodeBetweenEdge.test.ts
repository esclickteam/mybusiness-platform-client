import { describe, expect, it } from "vitest";
import {
  reconnectInsertOnEdge,
  spliceNodeAfterHandle,
  type FlowEdgeLike,
} from "./insertNodeBetweenEdge";

let seq = 0;
function idFactory(prefix: string) {
  return () => `${prefix}_${++seq}`;
}

function edge(partial: FlowEdgeLike): FlowEdgeLike {
  return { ...partial };
}

describe("reconnectInsertOnEdge", () => {
  it("A -> B insert C => A -> C -> B and removes A -> B", () => {
    seq = 0;
    const edges = [
      edge({ id: "e_ab", source: "A", target: "B", sourceHandle: "out" }),
    ];
    const result = reconnectInsertOnEdge(edges, {
      edgeId: "e_ab",
      newNodeId: "C",
      newNodeSourceHandle: "out",
      createEdgeId: idFactory("e"),
    });
    expect(result.ok).toBe(true);
    expect(result.removedEdge?.id).toBe("e_ab");
    expect(result.edges).toHaveLength(2);
    expect(result.edges.find((e) => e.id === "e_ab")).toBeUndefined();
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "A", target: "C", sourceHandle: "out" }),
        expect.objectContaining({ source: "C", target: "B", sourceHandle: "out" }),
      ])
    );
  });

  it("preserves unrelated edges in a larger flow", () => {
    seq = 0;
    const edges = [
      edge({ id: "e_xa", source: "X", target: "A", sourceHandle: "out" }),
      edge({ id: "e_ab", source: "A", target: "B", sourceHandle: "out" }),
      edge({ id: "e_by", source: "B", target: "Y", sourceHandle: "out" }),
    ];
    const result = reconnectInsertOnEdge(edges, {
      edgeId: "e_ab",
      newNodeId: "C",
      newNodeSourceHandle: "out",
      createEdgeId: idFactory("e"),
    });
    expect(result.ok).toBe(true);
    expect(result.edges).toHaveLength(4);
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "e_xa", source: "X", target: "A" }),
        expect.objectContaining({ id: "e_by", source: "B", target: "Y" }),
        expect.objectContaining({ source: "A", target: "C" }),
        expect.objectContaining({ source: "C", target: "B" }),
      ])
    );
    expect(result.edges.find((e) => e.source === "A" && e.target === "B")).toBeUndefined();
  });

  it("preserves sourceHandle on A->C and targetHandle on C->B", () => {
    seq = 0;
    const edges = [
      edge({
        id: "e_ab",
        source: "A",
        target: "B",
        sourceHandle: "path_2",
        targetHandle: "in_special",
        label: "path 2",
      }),
    ];
    const result = reconnectInsertOnEdge(edges, {
      edgeId: "e_ab",
      newNodeId: "C",
      newNodeSourceHandle: "yes",
      createEdgeId: idFactory("e"),
    });
    expect(result.ok).toBe(true);
    const ac = result.edges.find((e) => e.source === "A" && e.target === "C");
    const cb = result.edges.find((e) => e.source === "C" && e.target === "B");
    expect(ac?.sourceHandle).toBe("path_2");
    expect(ac?.label).toBe("path 2");
    expect(cb?.sourceHandle).toBe("yes");
    expect(cb?.targetHandle).toBe("in_special");
  });

  it("returns ok:false without mutating edges when edgeId is missing", () => {
    seq = 0;
    const edges = [
      edge({ id: "e_ab", source: "A", target: "B", sourceHandle: "out" }),
    ];
    const result = reconnectInsertOnEdge(edges, {
      edgeId: "missing",
      newNodeId: "C",
      newNodeSourceHandle: "out",
      createEdgeId: idFactory("e"),
    });
    expect(result.ok).toBe(false);
    expect(result.edges).toBe(edges);
    expect(result.edges).toHaveLength(1);
  });
});

describe("spliceNodeAfterHandle", () => {
  it("appends on a free handle without removing other handles", () => {
    seq = 0;
    const edges = [
      edge({ id: "e_route1", source: "T", target: "A", sourceHandle: "route_1" }),
    ];
    const result = spliceNodeAfterHandle(edges, {
      afterNodeId: "T",
      newNodeId: "C",
      newNodeSourceHandle: "out",
      afterSourceHandle: "route_2",
      createEdgeId: idFactory("e"),
    });
    expect(result.replaced).toHaveLength(0);
    expect(result.edges).toHaveLength(2);
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "e_route1" }),
        expect.objectContaining({ source: "T", target: "C", sourceHandle: "route_2" }),
      ])
    );
  });

  it("splices into an existing handle: A->B becomes A->C->B", () => {
    seq = 0;
    const edges = [
      edge({ id: "e_ab", source: "A", target: "B", sourceHandle: "out" }),
      edge({ id: "e_xy", source: "X", target: "Y", sourceHandle: "out" }),
    ];
    const result = spliceNodeAfterHandle(edges, {
      afterNodeId: "A",
      newNodeId: "C",
      newNodeSourceHandle: "out",
      afterSourceHandle: "out",
      createEdgeId: idFactory("e"),
    });
    expect(result.replaced.map((e) => e.id)).toEqual(["e_ab"]);
    expect(result.edges.find((e) => e.id === "e_ab")).toBeUndefined();
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "e_xy" }),
        expect.objectContaining({ source: "A", target: "C", sourceHandle: "out" }),
        expect.objectContaining({ source: "C", target: "B", sourceHandle: "out" }),
      ])
    );
  });
});