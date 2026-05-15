"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as d3 from "d3";
import { concepts } from "@/data/concepts";
import type { Concept } from "@/data/types";

type Node = {
  id: string;
  title: string;
  source: Concept["sources"][number];
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};
type Link = { source: string; target: string };

const COLORS: Record<string, string> = {
  "career-program": "#a78bfa",
  dalton: "#7aa2ff",
  axia: "#e0a458",
};

export default function GraphPage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 560 });

  const { nodes, links } = useMemo(() => {
    const ids = new Set(concepts.map((c) => c.id));
    const nodes: Node[] = concepts.map((c) => {
      const degree = c.related.filter((r) => ids.has(r)).length;
      return {
        id: c.id,
        title: c.title,
        source: c.sources[0],
        radius: 6 + Math.min(8, degree * 0.9),
      };
    });
    const edges = new Set<string>();
    const links: Link[] = [];
    concepts.forEach((c) => {
      c.related.forEach((r) => {
        if (!ids.has(r)) return;
        const k = [c.id, r].sort().join("|");
        if (edges.has(k)) return;
        edges.add(k);
        links.push({ source: c.id, target: r });
      });
    });
    return { nodes, links };
  }, []);

  // Track container size responsively.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = Math.max(420, Math.min(680, Math.round(window.innerHeight * 0.7)));
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!ref.current || size.w <= 0) return;
    const { w, h } = size;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", w).attr("height", h);

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 3])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom as any);

    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(78)
          .strength(0.42),
      )
      .force("charge", d3.forceManyBody().strength(-230))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide<Node>().radius((d) => d.radius + 7));

    const link = g
      .append("g")
      .attr("stroke", "#2a3142")
      .attr("stroke-opacity", 0.45)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelected((cur) => (cur === d.id ? null : d.id)));

    node
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => COLORS[d.source] ?? "#7aa2ff")
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#0a0c10")
      .attr("stroke-width", 1.5);

    node
      .append("text")
      .text((d) => d.title)
      .attr("x", (d) => d.radius + 6)
      .attr("y", 4)
      .attr("fill", "#9aa3b2")
      .attr("font-size", 10)
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("pointer-events", "none");

    node.call(
      d3
        .drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) simulation.alphaTarget(0);
          // Keep the node pinned where the user dropped it.
        }) as any,
    );

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, size]);

  // Highlight selected node + neighbours.
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    const connected = new Set<string>();
    if (selected) {
      connected.add(selected);
      links.forEach((l) => {
        const s = typeof l.source === "string" ? l.source : (l.source as any).id;
        const t = typeof l.target === "string" ? l.target : (l.target as any).id;
        if (s === selected) connected.add(t);
        if (t === selected) connected.add(s);
      });
    }
    svg
      .selectAll<SVGCircleElement, Node>("circle")
      .attr("fill-opacity", (d) => (!selected ? 0.85 : connected.has(d.id) ? 1 : 0.12))
      .attr("stroke", (d) => (selected && d.id === selected ? "#7aa2ff" : "#0a0c10"))
      .attr("stroke-width", (d) => (selected && d.id === selected ? 2.5 : 1.5));
    svg
      .selectAll<SVGTextElement, Node>("text")
      .attr("fill-opacity", (d) => (!selected ? 1 : connected.has(d.id) ? 1 : 0.18));
    svg.selectAll<SVGLineElement, Link>("line").attr("stroke-opacity", (d: any) => {
      if (!selected) return 0.45;
      const s = typeof d.source === "string" ? d.source : d.source.id;
      const t = typeof d.target === "string" ? d.target : d.target.id;
      return s === selected || t === selected ? 0.95 : 0.04;
    });
  }, [selected, links, size]);

  const sel = selected ? concepts.find((c) => c.id === selected) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Knowledge Graph</div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tightish mt-1">One system, not three.</h1>
        <p className="text-ink-muted text-sm mt-1 max-w-2xl">
          Force-directed map of every concept. Tap a node to surface its connections across Career Program, Dalton, and Axia. Drag to rearrange; scroll or pinch to zoom.
        </p>
      </header>
      <div className="grid lg:grid-cols-4 gap-4">
        <div ref={wrapRef} className="lg:col-span-3 card p-2 overflow-hidden">
          <svg ref={ref} className="w-full" style={{ height: size.h }} />
        </div>
        <aside className="card p-5 h-fit">
          <div className="h-section mb-2">Legend</div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-source-career" /> Career Program</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-source-dalton" /> Dalton</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-source-axia" /> Axia</li>
          </ul>
          <div className="h-section mt-5 mb-2">Selected</div>
          {sel ? (
            <div className="space-y-2">
              <div className="text-ink font-semibold">{sel.title}</div>
              <p className="text-ink-muted text-sm">{sel.essence}</p>
              <Link href={`/library?c=${sel.id}`} className="btn btn-primary inline-flex">
                Open in library
              </Link>
            </div>
          ) : (
            <div className="text-ink-subtle text-sm">Tap a node to inspect. Tap again to clear.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
