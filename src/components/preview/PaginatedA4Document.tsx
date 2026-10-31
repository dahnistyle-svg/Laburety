import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Resume, MasterLibrary } from "../../types";
import { ResumeRenderer } from "../templates/ResumeRenderer";
import { getSpacingConfig } from "../templates/templateUtils";

interface PaginatedA4DocumentProps {
  resume: Resume;
  library: MasterLibrary;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface ItemAllocation {
  sectionIndex: number;
  itemStartIndex?: number;
  itemEndIndex?: number;
  isFullSection: boolean;
  isContinuation?: boolean;
}

interface PageAllocation {
  pageIndex: number;
  includeHeader: boolean;
  sections: ItemAllocation[];
}

// Medidas reales de cada sección, tomadas del DOM de medición (staging)
interface SectionMetrics {
  top: number; // posición vertical de la sección dentro del CV
  bottom: number;
  gapBefore: number; // espacio real entre esta sección y la anterior
  headBlock: number; // altura desde el inicio de la sección hasta el primer ítem (título + intro)
  headingCost: number; // lo que ocupa solo el título (alto + margen inferior)
  tail: number; // contenido que queda debajo del último ítem
  items: HTMLElement[];
  itemTops: number[];
  itemBottoms: number[];
}

// Strict standard A4 dimensions at 96 DPI
export const A4_WIDTH_PX = 794; // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm
export const TOP_PADDING_PX = 56; // Top margin
export const BOTTOM_PADDING_PX = 54; // Bottom margin (~14.3mm)
export const HORIZONTAL_PADDING_PX = 64; // Side margins (~17mm)
export const MAX_CONTENT_HEIGHT_PX = 1013; // 1123 - 56 - 54

// ---- Ajustes de paginación -------------------------------------------------
// La hoja tiene un borde de 1px por lado que le resta altura útil.
const PAGE_BORDER_PX = 2;
// Margen de seguridad: la hoja tiene overflow hidden, así que si el cálculo se
// pasa por unos píxeles, el texto del final se cortaría sin aviso.
const SAFETY_PX = 12;
const PAGE_LIMIT_PX = MAX_CONTENT_HEIGHT_PX - PAGE_BORDER_PX - SAFETY_PX;
// false = al continuar una sección en la hoja siguiente NO se repite el título
// (evita "IDIOMAS" o "EXPERIENCIA" duplicados). Poner true para repetirlo.
const REPEAT_HEADING_ON_CONTINUATION = false;
// true = imprime en la consola (F12) una tabla con las medidas y el reparto.
const DEBUG_PAGINATION = false;

// ---- Utilidades de medición --------------------------------------------------
const getHeadingEl = (section: HTMLElement): HTMLElement | null =>
  (section.querySelector("h2, .border-b, h3") as HTMLElement | null) ||
  (section.firstElementChild as HTMLElement | null);

// Ítems indivisibles de una sección (solo los más externos, sin duplicar anidados)
const getSectionItems = (section: HTMLElement): HTMLElement[] => {
  const headingEl = getHeadingEl(section);
  const all = Array.from(section.querySelectorAll(".page-break-avoid")) as HTMLElement[];
  return all.filter(
    (el) =>
      el !== headingEl &&
      !(headingEl && headingEl.contains(el)) &&
      !all.some((other) => other !== el && other.contains(el))
  );
};

// Posición vertical acumulada. Usa offsetTop (no getBoundingClientRect) para que
// el zoom/escala del visor no altere las medidas.
const absTop = (el: HTMLElement): number => {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
};

// Altura que ocupa un tramo de ítems [a, b) dentro de una hoja
const chunkHeight = (m: SectionMetrics, a: number, b: number): number => {
  let maxBottom = m.itemBottoms[a];
  for (let k = a; k < b; k++) {
    if (m.itemBottoms[k] > maxBottom) maxBottom = m.itemBottoms[k];
  }
  const span = Math.max(0, maxBottom - m.itemTops[a]);
  let head = m.headBlock;
  if (a > 0 && !REPEAT_HEADING_ON_CONTINUATION) {
    head = Math.max(0, m.headBlock - m.headingCost);
  }
  const tail = b === m.items.length ? m.tail : 0;
  return head + span + tail;
};

export const PaginatedA4Document: React.FC<PaginatedA4DocumentProps> = ({
  resume,
  library,
  containerRef,
}) => {
  const [pages, setPages] = useState<PageAllocation[]>([
    { pageIndex: 0, includeHeader: true, sections: [] },
  ]);
  const [measureTick, setMeasureTick] = useState(0);

  const stagingRef = useRef<HTMLDivElement>(null);
  const pageMountRefs = useRef<(HTMLDivElement | null)[]>([]);

  const spacingConfig = getSpacingConfig(resume?.visualSettings?.spacing);

  // Volver a medir cuando terminan de cargar las tipografías (EB Garamond,
  // Merriweather, etc.). Si se mide antes, las alturas salen distintas.
  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) return;
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setMeasureTick((t) => t + 1);
    };
    fonts.ready.then(bump);
    fonts.addEventListener("loadingdone", bump);
    return () => {
      cancelled = true;
      fonts.removeEventListener("loadingdone", bump);
    };
  }, []);

  useLayoutEffect(() => {
    if (!stagingRef.current) return;

    const root = stagingRef.current.firstElementChild as HTMLElement | null;
    if (!root) return;

    const singlePage: PageAllocation[] = [
      { pageIndex: 0, includeHeader: true, sections: [] },
    ];

    // UNA SOLA HOJA: todo el contenido entra en el área útil
    if (root.scrollHeight <= MAX_CONTENT_HEIGHT_PX - PAGE_BORDER_PX) {
      setPages(singlePage);
      return;
    }

    const sectionEls = Array.from(root.querySelectorAll("section")) as HTMLElement[];
    if (sectionEls.length === 0) {
      setPages(singlePage);
      return;
    }

    // 1) Medir cada sección con posiciones reales (no con sumas estimadas)
    const rootTop = absTop(root);
    const rel = (el: HTMLElement) => absTop(el) - rootTop;

    const metrics: SectionMetrics[] = sectionEls.map((section) => {
      const top = rel(section);
      const bottom = top + section.offsetHeight;
      const items = getSectionItems(section);
      const itemTops = items.map(rel);
      const itemBottoms = items.map((el, k) => itemTops[k] + el.offsetHeight);

      const headingEl = getHeadingEl(section);
      let headingCost = 0;
      if (headingEl) {
        const cs = window.getComputedStyle(headingEl);
        headingCost = headingEl.offsetHeight + (parseFloat(cs.marginBottom) || 0);
      }

      const headBlock = items.length > 0 ? Math.max(0, itemTops[0] - top) : 0;
      const maxItemBottom = items.length > 0 ? Math.max(...itemBottoms) : bottom;
      const tail = Math.max(0, bottom - maxItemBottom);

      return {
        top,
        bottom,
        gapBefore: 0,
        headBlock,
        headingCost,
        tail,
        items,
        itemTops,
        itemBottoms,
      };
    });

    // El margen inferior de la última sección de una hoja también ocupa lugar:
    // se descuenta del límite para que no invada el margen de la página.
    const trailingMargin = Math.max(
      0,
      ...sectionEls.map((el) => parseFloat(window.getComputedStyle(el).marginBottom) || 0)
    );
    const pageLimit = PAGE_LIMIT_PX - trailingMargin;

    // Espacio real entre secciones (incluye margin-bottom y space-y de la plantilla)
    for (let i = 1; i < metrics.length; i++) {
      metrics[i].gapBefore = Math.max(0, metrics[i].top - metrics[i - 1].bottom);
    }

    // 2) Repartir en hojas
    const newPages: PageAllocation[] = [
      { pageIndex: 0, includeHeader: true, sections: [] },
    ];
    let pageIdx = 0;
    // En la hoja 1 el encabezado ocupa lo que hay antes de la primera sección
    let used = metrics[0].top;
    let hasContent = false;

    const startNewPage = () => {
      pageIdx += 1;
      newPages.push({ pageIndex: pageIdx, includeHeader: false, sections: [] });
      used = 0;
      hasContent = false;
    };

    metrics.forEach((m, sIdx) => {
      const n = m.items.length;
      const fullH = m.bottom - m.top;
      const gap = hasContent ? m.gapBefore : 0;

      // La sección completa entra en lo que queda de la hoja
      if (used + gap + fullH <= pageLimit) {
        newPages[pageIdx].sections.push({ sectionIndex: sIdx, isFullSection: true });
        used += gap + fullH;
        hasContent = true;
        return;
      }

      // Sección indivisible (0 o 1 bloque): pasa entera a la hoja siguiente
      if (n < 2) {
        if (hasContent) startNewPage();
        newPages[pageIdx].sections.push({ sectionIndex: sIdx, isFullSection: true });
        used += fullH;
        hasContent = true;
        return;
      }

      // Sección divisible: se reparte ítem por ítem
      let start = 0;
      while (start < n) {
        const g = hasContent ? m.gapBefore : 0;

        let end = start;
        for (let e = start + 1; e <= n; e++) {
          if (used + g + chunkHeight(m, start, e) <= pageLimit) {
            end = e;
          } else {
            break;
          }
        }

        if (end === start) {
          // No entra ni un ítem: se pasa a una hoja nueva y se reintenta
          if (hasContent) {
            startNewPage();
            continue;
          }
          // Hoja vacía y aun así no entra: se fuerza un ítem para no quedar en bucle
          end = start + 1;
        }

        newPages[pageIdx].sections.push({
          sectionIndex: sIdx,
          isFullSection: start === 0 && end === n,
          itemStartIndex: start,
          itemEndIndex: end,
          isContinuation: start > 0,
        });

        used += g + chunkHeight(m, start, end);
        hasContent = true;
        start = end;
        if (start < n) startNewPage();
      }
    });

    if (DEBUG_PAGINATION) {
      console.table(
        metrics.map((m, i) => ({
          seccion: i,
          top: Math.round(m.top),
          alto: Math.round(m.bottom - m.top),
          gapBefore: Math.round(m.gapBefore),
          items: m.items.length,
        }))
      );
      console.table(
        newPages.flatMap((p) =>
          p.sections.map((s) => ({
            hoja: p.pageIndex + 1,
            seccion: s.sectionIndex,
            completa: s.isFullSection,
            desde: s.itemStartIndex,
            hasta: s.itemEndIndex,
          }))
        )
      );
    }

    setPages(newPages);
  }, [resume, library, measureTick]);

  // Mount cloned and partitioned DOM into each page container
  useLayoutEffect(() => {
    if (pages.length <= 1) return;
    if (!stagingRef.current) return;

    const root = stagingRef.current.firstElementChild as HTMLElement | null;
    if (!root) return;

    pages.forEach((pageAlloc, pIdx) => {
      const mountEl = pageMountRefs.current[pIdx];
      if (!mountEl) return;

      const pageClone = root.cloneNode(true) as HTMLElement;

      // Remove header on page 2+
      if (pIdx > 0) {
        const header =
          pageClone.querySelector("header") ||
          pageClone.querySelector(".border-b-2") ||
          pageClone.firstElementChild;
        if (
          header &&
          (header.tagName.toLowerCase() === "header" ||
            header.classList.contains("border-b-2") ||
            header.classList.contains("text-center"))
        ) {
          header.remove();
        }
      }

      // Filter and prune sections
      const clonedSections = Array.from(
        pageClone.querySelectorAll("section")
      ) as HTMLElement[];
      const keepMap = new Map<number, ItemAllocation>();
      pageAlloc.sections.forEach((s) => keepMap.set(s.sectionIndex, s));

      clonedSections.forEach((sec, sIdx) => {
        const alloc = keepMap.get(sIdx);
        if (!alloc) {
          sec.remove();
          return;
        }
        if (
          alloc.isFullSection ||
          alloc.itemStartIndex === undefined ||
          alloc.itemEndIndex === undefined
        ) {
          return;
        }

        const headingEl = getHeadingEl(sec);
        const items = getSectionItems(sec);
        const start = alloc.itemStartIndex;
        const end = alloc.itemEndIndex;

        items.forEach((item, itemIdx) => {
          if (itemIdx < start || itemIdx >= end) {
            item.remove();
          }
        });

        // En la hoja de continuación no se repite el título de la sección
        if (alloc.isContinuation && !REPEAT_HEADING_ON_CONTINUATION && headingEl) {
          headingEl.remove();
        }
      });

      mountEl.innerHTML = "";
      mountEl.appendChild(pageClone);
    });

    // Control: avisa en consola si alguna hoja quedó con contenido cortado
    pageMountRefs.current.slice(0, pages.length).forEach((el, i) => {
      if (el && el.scrollHeight > el.clientHeight + 1) {
        console.warn(
          `[Paginación] La hoja ${i + 1} se pasa ${el.scrollHeight - el.clientHeight}px del área útil; puede quedar texto cortado.`
        );
      }
    });
  }, [pages, resume, library]);

  return (
    <>
      {/* Hidden off-screen staging element with exact fixed A4 width and padding to measure heights */}
      <div
        ref={stagingRef}
        className={`w-full no-print print:hidden ${spacingConfig.leading}`}
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: `${A4_WIDTH_PX}px`,
          padding: `${TOP_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px ${BOTTOM_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px`,
          boxSizing: "border-box",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          backgroundColor: "#ffffff",
        }}
        aria-hidden="true"
      >
        <ResumeRenderer resume={resume} library={library} />
      </div>

      {/* Real multi-page A4 document preview */}
      <div
        ref={containerRef}
        className={`flex flex-col items-center gap-8 pb-12 w-full print:gap-0 print:pb-0 print:block ${spacingConfig.leading}`}
      >
        {pages.map((_, idx) => (
          <div
            key={idx}
            className={`a4-page a4-page-sheet relative bg-white shadow-xl rounded-xs border border-neutral-200/80 text-neutral-900 transition-shadow hover:shadow-2xl ${spacingConfig.leading}`}
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`,
              maxHeight: `${A4_HEIGHT_PX}px`,
              padding: `${TOP_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px ${BOTTOM_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px`,
              boxSizing: "border-box",
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Real page indicator tag (Word/Docs style) */}
            <div
              data-html2canvas-ignore="true"
              className="absolute bottom-3 right-6 text-[10px] font-mono-num text-neutral-400 no-print print:hidden select-none"
            >
              Página {idx + 1} de {pages.length}
            </div>

            {/* Mount for page content */}
            {pages.length === 1 ? (
              <ResumeRenderer resume={resume} library={library} />
            ) : (
              <div
                className="w-full h-full flex flex-col"
                ref={(el) => {
                  pageMountRefs.current[idx] = el;
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};