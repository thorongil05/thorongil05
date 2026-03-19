import PropTypes from "prop-types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TIEBREAKER_CRITERIA_OPTIONS } from "../../constants/tiebreakerCriteria";

function SortableChip({ id, label, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200"
    >
      <span
        {...attributes}
        {...listeners}
        className="text-slate-500 cursor-grab active:cursor-grabbing select-none text-base"
        title="Trascina per riordinare"
      >
        ⠿
      </span>
      <span className="flex-1">{label}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-slate-500 hover:text-red-400 transition-colors text-xs font-bold"
        title="Rimuovi"
      >
        ✕
      </button>
    </div>
  );
}

SortableChip.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

function AvailableList({ available, onAdd }) {
  if (available.length === 0) return null;
  return (
    <div className="space-y-1 mt-3">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
        Aggiungi criterio
      </p>
      {available.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onAdd(opt.value)}
          className="w-full text-left text-sm px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors border border-transparent hover:border-slate-600"
        >
          + {opt.label}
        </button>
      ))}
    </div>
  );
}

AvailableList.propTypes = {
  available: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default function TiebreakerEditor({ value, onChange }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const selected = (value || []).map((v) => {
    const opt = TIEBREAKER_CRITERIA_OPTIONS.find((o) => o.value === v);
    return { value: v, label: opt?.label ?? v };
  });

  const available = TIEBREAKER_CRITERIA_OPTIONS.filter(
    (o) => !(value || []).includes(o.value)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = (value || []).indexOf(active.id);
    const newIndex = (value || []).indexOf(over.id);
    onChange(arrayMove(value || [], oldIndex, newIndex));
  };

  const handleAdd = (criterionValue) => {
    onChange([...(value || []), criterionValue]);
  };

  const handleRemove = (criterionValue) => {
    onChange((value || []).filter((v) => v !== criterionValue));
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Criteri di ex-aequo (in ordine)
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Punti è sempre il primo criterio. Alfabetico è sempre l&apos;ultimo.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={(value || []).map(String)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1 min-h-[2rem]">
            {selected.length === 0 && (
              <p className="text-xs text-slate-600 italic py-1">Nessun criterio configurato</p>
            )}
            {selected.map((item) => (
              <SortableChip
                key={item.value}
                id={item.value}
                label={item.label}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AvailableList available={available} onAdd={handleAdd} />
    </div>
  );
}

TiebreakerEditor.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};
