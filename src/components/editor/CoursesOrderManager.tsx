import React, { useState } from "react";
import { Course } from "../../types";
import {
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUpDown,
  Search,
  Calendar,
  Sparkles,
} from "lucide-react";

interface CoursesOrderManagerProps {
  courses: Course[];
  selectedCourseIds: string[];
  coursesOrder?: string[];
  onUpdateOrderAndSelection: (newSelectedIds: string[], newOrder: string[]) => void;
  onToggleCourse: (courseId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  searchPlaceholder?: string;
  maxHeightClass?: string;
}

export const CoursesOrderManager: React.FC<CoursesOrderManagerProps> = ({
  courses,
  selectedCourseIds,
  coursesOrder = [],
  onUpdateOrderAndSelection,
  onToggleCourse,
  onSelectAll,
  onDeselectAll,
  searchPlaceholder,
  maxHeightClass = "max-h-96",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Compute full unified ordered list of courses
  // Courses that are in coursesOrder or selectedCourseIds come first in that order, followed by any remaining courses
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const orderedIds: string[] = [];
  const seenIds = new Set<string>();

  // 1. Follow coursesOrder if present
  if (Array.isArray(coursesOrder) && coursesOrder.length > 0) {
    for (const id of coursesOrder) {
      if (courseMap.has(id) && !seenIds.has(id)) {
        orderedIds.push(id);
        seenIds.add(id);
      }
    }
  }

  // 2. Follow selectedCourseIds for any not yet included
  for (const id of selectedCourseIds) {
    if (courseMap.has(id) && !seenIds.has(id)) {
      orderedIds.push(id);
      seenIds.add(id);
    }
  }

  // 3. Append remaining library courses
  for (const c of courses) {
    if (!seenIds.has(c.id)) {
      orderedIds.push(c.id);
      seenIds.add(c.id);
    }
  }

  const orderedCourses = orderedIds
    .map((id) => courseMap.get(id))
    .filter((c): c is Course => c !== undefined);

  // Calculate active sequence ranks (#1, #2, #3...) among selected courses
  const selectedSet = new Set(selectedCourseIds);
  let activeCounter = 0;
  const rankMap = new Map<string, number>();
  for (const c of orderedCourses) {
    if (selectedSet.has(c.id)) {
      activeCounter++;
      rankMap.set(c.id, activeCounter);
    }
  }

  // Handle reordering: move item at fromIndex to toIndex
  const handleMove = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= orderedCourses.length) return;

    const newOrderedCourses = [...orderedCourses];
    const [movedItem] = newOrderedCourses.splice(fromIndex, 1);
    newOrderedCourses.splice(toIndex, 0, movedItem);

    const newFullOrder = newOrderedCourses.map((c) => c.id);
    // Keep selectedCourseIds sorted according to the new sequence
    const newSelectedIds = newFullOrder.filter((id) => selectedSet.has(id));

    onUpdateOrderAndSelection(newSelectedIds, newFullOrder);
  };

  // Move directly to top (position #1)
  const handleMoveToTop = (index: number) => {
    handleMove(index, 0);
  };

  // Sort by date (descending: newest first)
  const handleSortNewestFirst = () => {
    const sorted = [...orderedCourses].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (!dateA && !dateB) return a.name.localeCompare(b.name, "es");
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.localeCompare(dateA);
    });

    const newFullOrder = sorted.map((c) => c.id);
    const newSelectedIds = newFullOrder.filter((id) => selectedSet.has(id));
    onUpdateOrderAndSelection(newSelectedIds, newFullOrder);
  };

  // Sort by date (ascending: oldest first)
  const handleSortOldestFirst = () => {
    const sorted = [...orderedCourses].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (!dateA && !dateB) return a.name.localeCompare(b.name, "es");
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.localeCompare(dateB);
    });

    const newFullOrder = sorted.map((c) => c.id);
    const newSelectedIds = newFullOrder.filter((id) => selectedSet.has(id));
    onUpdateOrderAndSelection(newSelectedIds, newFullOrder);
  };

  // Sort alphabetically A-Z
  const handleSortAlphabetical = () => {
    const sorted = [...orderedCourses].sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    const newFullOrder = sorted.map((c) => c.id);
    const newSelectedIds = newFullOrder.filter((id) => selectedSet.has(id));
    onUpdateOrderAndSelection(newSelectedIds, newFullOrder);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Transparent or custom drag preview
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      handleMove(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Filtered view when searching
  const q = searchQuery.toLowerCase().trim();
  const filteredIndices: number[] = [];
  orderedCourses.forEach((c, idx) => {
    if (!q) {
      filteredIndices.push(idx);
    } else if (
      c.name.toLowerCase().includes(q) ||
      c.institution.toLowerCase().includes(q) ||
      (c.date && c.date.toLowerCase().includes(q))
    ) {
      filteredIndices.push(idx);
    }
  });

  return (
    <div className="space-y-2.5">
      {/* Top action bar: Visibilidad rápida y Orden automático */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-50/80 p-2 rounded-xl border border-neutral-200/80 text-xs">
        {/* Toggle Visibilidad */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSelectAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs"
            title="Activar y mostrar todos los cursos en este CV"
          >
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>Mostrar todos ({courses.length})</span>
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Ocultar todos los cursos en este CV"
          >
            <EyeOff className="w-3 h-3 text-neutral-500" />
            <span>Ocultar todos</span>
          </button>
        </div>

        {/* Botones de Ordenamiento Automático */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1 mr-0.5">
            <ArrowUpDown className="w-3 h-3 text-neutral-400" />
            Ordenar:
          </span>
          <button
            type="button"
            onClick={handleSortNewestFirst}
            className="px-2 py-0.5 text-[10px] font-medium rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            title="Ordenar cursos por fecha (Más recientes arriba)"
          >
            Recientes
          </button>
          <button
            type="button"
            onClick={handleSortOldestFirst}
            className="px-2 py-0.5 text-[10px] font-medium rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            title="Ordenar cursos por fecha (Más antiguos arriba)"
          >
            Antiguos
          </button>
          <button
            type="button"
            onClick={handleSortAlphabetical}
            className="px-2 py-0.5 text-[10px] font-medium rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            title="Ordenar cursos alfabéticamente de la A a la Z"
          >
            A-Z
          </button>
        </div>
      </div>

      {/* Buscador de cursos */}
      {courses.length > 5 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder || `Buscar entre los ${courses.length} cursos...`}
            className="w-full text-xs pl-8 pr-14 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Lista de cursos con Drag & Drop, Flechas y Ojito */}
      <div className={`space-y-1.5 overflow-y-auto pr-1 ${maxHeightClass}`}>
        {filteredIndices.map((realIdx) => {
          const course = orderedCourses[realIdx];
          const isSelected = selectedSet.has(course.id);
          const activeRank = rankMap.get(course.id);
          const isFirst = realIdx === 0;
          const isLast = realIdx === orderedCourses.length - 1;
          const isDragging = draggedIndex === realIdx;
          const isDragOver = dragOverIndex === realIdx;

          return (
            <div
              key={course.id}
              draggable
              onDragStart={(e) => handleDragStart(e, realIdx)}
              onDragOver={(e) => handleDragOver(e, realIdx)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, realIdx)}
              className={`group flex items-center justify-between gap-2 p-2 rounded-xl border text-xs transition-all select-none ${
                isDragging ? "opacity-30 border-dashed border-neutral-400 bg-neutral-100" : ""
              } ${isDragOver && !isDragging ? "border-neutral-900 bg-neutral-100/80 shadow-xs" : ""} ${
                isSelected
                  ? "bg-white border-neutral-200 shadow-2xs hover:border-neutral-300"
                  : "bg-neutral-50/60 opacity-60 border-neutral-200/50 hover:opacity-85"
              }`}
            >
              {/* Handle de arrastre y badge de orden */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-600 p-0.5 rounded transition-colors"
                  title="Arrastrar para reordenar"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </span>

                {/* Badge de número de orden */}
                {isSelected ? (
                  <span
                    className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1 rounded-md bg-neutral-900 text-white font-mono text-[10px] font-bold shadow-2xs"
                    title={`Posición #${activeRank} en la vista previa del CV`}
                  >
                    #{activeRank}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1 rounded-md bg-neutral-200 text-neutral-500 font-mono text-[10px]"
                    title="Curso oculto en este CV"
                  >
                    --
                  </span>
                )}
              </div>

              {/* Contenido del curso (click para toggle) */}
              <div
                onClick={() => onToggleCourse(course.id)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-semibold truncate block ${
                      isSelected ? "text-neutral-900" : "text-neutral-600"
                    }`}
                    title={course.name}
                  >
                    {course.name}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                  <span className="truncate">{course.institution}</span>
                  {course.date && (
                    <span className="text-neutral-400 font-mono-num shrink-0">
                      · {course.date}
                    </span>
                  )}
                  {course.duration && (
                    <span className="text-neutral-400 shrink-0">
                      ({course.duration})
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de acción: Subir, Bajar, Poner Primero y Ojito */}
              <div className="flex items-center gap-0.5 shrink-0">
                {/* Botón Poner Primero (⇈) */}
                <button
                  type="button"
                  onClick={() => handleMoveToTop(realIdx)}
                  disabled={isFirst}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Poner primero (#1)"
                >
                  <ChevronsUp className="w-3.5 h-3.5" />
                </button>

                {/* Botón Subir (↑) */}
                <button
                  type="button"
                  onClick={() => handleMove(realIdx, realIdx - 1)}
                  disabled={isFirst}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Subir una posición"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Botón Bajar (↓) */}
                <button
                  type="button"
                  onClick={() => handleMove(realIdx, realIdx + 1)}
                  disabled={isLast}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Bajar una posición"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-neutral-200 mx-0.5" />

                {/* Ojito de visibilidad */}
                <button
                  type="button"
                  onClick={() => onToggleCourse(course.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-neutral-100 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
                  }`}
                  title={isSelected ? "Ocultar este curso en el CV" : "Mostrar este curso en el CV"}
                >
                  {isSelected ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {courses.length === 0 && (
          <div className="text-center py-6 text-xs text-neutral-500">
            No hay cursos en tu biblioteca maestra.
          </div>
        )}

        {courses.length > 0 && filteredIndices.length === 0 && (
          <div className="text-center py-4 text-xs text-neutral-400">
            No se encontraron cursos que coincidan con "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
