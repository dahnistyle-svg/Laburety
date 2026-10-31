import React, { useState, useLayoutEffect, useRef } from "react";
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

// Strict standard A4 dimensions at 96 DPI
export const A4_WIDTH_PX = 794; // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm
export const TOP_PADDING_PX = 56; // Top margin
export const BOTTOM_PADDING_PX = 54; // Bottom margin (~14.3mm)
export const HORIZONTAL_PADDING_PX = 64; // Side margins (~17mm)
export const MAX_CONTENT_HEIGHT_PX = 1013; // 1123 - 56 - 54

export const PaginatedA4Document: React.FC<PaginatedA4DocumentProps> = ({
  resume,
  library,
  containerRef,
}) => {
  const [pages, setPages] = useState<PageAllocation[]>([
    { pageIndex: 0, includeHeader: true, sections: [] },
  ]);

  const stagingRef = useRef<HTMLDivElement>(null);
  const pageMountRefs = useRef<(HTMLDivElement | null)[]>([]);

  const spacingConfig = getSpacingConfig(resume?.visualSettings?.spacing);

  useLayoutEffect(() => {
    if (!stagingRef.current) return;

    const root = stagingRef.current.firstElementChild as HTMLElement;
    if (!root) return;

    const totalScrollHeight = root.scrollHeight;

    // SINGLE-PAGE SCENARIO: Content fits completely within the 1013px limit
    if (totalScrollHeight <= MAX_CONTENT_HEIGHT_PX) {
      setPages([{ pageIndex: 0, includeHeader: true, sections: [] }]);
      return;
    }

    // MULTI-PAGE SCENARIO: Granular item-by-item partitioning with strict anti-orphan rule (1-column templates)
    const headerEl =
      root.querySelector("header") ||
      root.querySelector(".border-b-2") ||
      root.firstElementChild;
    const headerHeight = (headerEl as HTMLElement)?.offsetHeight || 0;

    const sections = Array.from(root.querySelectorAll("section")) as HTMLElement[];

    const newPages: PageAllocation[] = [
      { pageIndex: 0, includeHeader: true, sections: [] },
    ];
    let currentPageIdx = 0;
    // Page 1 starts with header height + margin
    let currentHeight = headerHeight > 0 ? headerHeight + 12 : 0;

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const sectionHeight = section.offsetHeight;

      // Extract section header element & height
      const headingEl =
        section.querySelector("h2, .border-b, h3") || section.firstElementChild;
      const headingHeight = (headingEl as HTMLElement)?.offsetHeight || 28;

      // Collect divisible items within this section (.page-break-avoid)
      const items = Array.from(
        section.querySelectorAll(".page-break-avoid")
      ).filter((el) => el !== section) as HTMLElement[];

      if (items.length > 0) {
        // ANTI-ORPHAN RULE:
        // A section header and its first item MUST be treated as an indivisible unit.
        // Never render a section heading at the bottom of a page without its first item!
        // Margen de seguridad de 12px para evitar recortes y superposiciones en html2canvas
        const firstItemHeight = items[0].offsetHeight + 12;
        const minUnitHeight = headingHeight + 8 + firstItemHeight;

        // If the heading + first item cannot fit in remaining space, start a new page
        if (currentHeight > 0 && currentHeight + minUnitHeight > MAX_CONTENT_HEIGHT_PX) {
          currentPageIdx++;
          newPages.push({
            pageIndex: currentPageIdx,
            includeHeader: false,
            sections: [],
          });
          currentHeight = 0;
        }

        // Measure how many items fit on the current page with 12px safety margin
        let accumulatedHeight = headingHeight + 8;
        let splitIdx = 0;

        for (let i = 0; i < items.length; i++) {
          const itemH = items[i].offsetHeight + 12;
          if (currentHeight + accumulatedHeight + itemH <= MAX_CONTENT_HEIGHT_PX) {
            accumulatedHeight += itemH;
            splitIdx = i + 1;
          } else {
            break;
          }
        }

        if (splitIdx >= items.length) {
          // All items fit on the current page
          newPages[currentPageIdx].sections.push({
            sectionIndex: sIdx,
            isFullSection: true,
          });
          currentHeight += accumulatedHeight + 12;
        } else if (splitIdx > 0) {
          // Items 0 to splitIdx fit on the current page
          newPages[currentPageIdx].sections.push({
            sectionIndex: sIdx,
            isFullSection: false,
            itemStartIndex: 0,
            itemEndIndex: splitIdx,
          });

          // Remaining items wrap to subsequent page(s)
          let remainingStart = splitIdx;

          while (remainingStart < items.length) {
            currentPageIdx++;
            newPages.push({
              pageIndex: currentPageIdx,
              includeHeader: false,
              sections: [],
            });
            currentHeight = 0;

            let chunkAccum = headingHeight + 8;
            let chunkEnd = remainingStart;

            for (let j = remainingStart; j < items.length; j++) {
              const itemH = items[j].offsetHeight + 12;
              if (chunkAccum + itemH <= MAX_CONTENT_HEIGHT_PX) {
                chunkAccum += itemH;
                chunkEnd = j + 1;
              } else {
                break;
              }
            }

            if (chunkEnd === remainingStart) {
              chunkEnd = remainingStart + 1;
              chunkAccum += (items[remainingStart].offsetHeight || 40) + 12;
            }

            newPages[currentPageIdx].sections.push({
              sectionIndex: sIdx,
              isFullSection: false,
              itemStartIndex: remainingStart,
              itemEndIndex: chunkEnd,
              isContinuation: true,
            });

            currentHeight = chunkAccum + 12;
            remainingStart = chunkEnd;
          }
        } else {
          // Fallback if not even item 0 fit on a fresh page
          newPages[currentPageIdx].sections.push({
            sectionIndex: sIdx,
            isFullSection: false,
            itemStartIndex: 0,
            itemEndIndex: 1,
          });
          currentHeight = headingHeight + 8 + items[0].offsetHeight + 12;
        }
      } else {
        // Indivisible section (e.g. About statement, tools list, continuous text blocks)
        // Margen de seguridad de 12px para evitar recortes y superposiciones en html2canvas
        const safeSectionHeight = sectionHeight + 12;
        if (currentHeight > 0 && currentHeight + safeSectionHeight > MAX_CONTENT_HEIGHT_PX) {
          currentPageIdx++;
          newPages.push({
            pageIndex: currentPageIdx,
            includeHeader: false,
            sections: [],
          });
          currentHeight = 0;
        }

        newPages[currentPageIdx].sections.push({
          sectionIndex: sIdx,
          isFullSection: true,
        });
        currentHeight += safeSectionHeight + 12;
      }
    }

    setPages(newPages);
  }, [resume, library]);

  // Mount cloned and partitioned DOM into each page container
  useLayoutEffect(() => {
    if (pages.length <= 1) return;
    if (!stagingRef.current) return;

    const root = stagingRef.current.firstElementChild as HTMLElement;
    if (!root) return;

    // MOUNTING FOR TEMPLATES (Harvard, Executive, ATS)
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
        } else if (
          !alloc.isFullSection &&
          alloc.itemStartIndex !== undefined &&
          alloc.itemEndIndex !== undefined
        ) {
          const items = Array.from(
            sec.querySelectorAll(".page-break-avoid")
          ).filter((el) => el !== sec) as HTMLElement[];

          items.forEach((item, itemIdx) => {
            if (itemIdx < alloc.itemStartIndex! || itemIdx >= alloc.itemEndIndex!) {
              item.remove();
            }
          });
        }
      });

      mountEl.innerHTML = "";
      mountEl.appendChild(pageClone);
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
