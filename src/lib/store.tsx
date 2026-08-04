"use client";

// ก่อนจะลืมถาม - state + localStorage (spec C11: เก็บในเครื่องเป็นค่าเริ่มต้น)

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Answers,
  AppState,
  Category,
  KeptCard,
} from "./types";

const STORAGE_KEY = "luemtham.v1";

const initialState: AppState = {
  answers: {
    relationship: null,
    relationshipCustom: "",
    self: null,
    condition: null,
    time: null,
    fear: null,
  },
  seen: [],
  kept: [],
  meal: { where: null, who: "", when: null, bring: [] },
  memory: { notes: {} },
  letter: "",
  updatedAt: null,
};

type Action =
  | { type: "hydrate"; payload: AppState }
  | { type: "setAnswer"; payload: Partial<Answers> }
  | { type: "keepCard"; payload: KeptCard }
  | { type: "skipCard"; payload: string }
  | { type: "removeKept"; payload: string }
  | { type: "setOwnNote"; payload: { id: string; text: string; category: Category } }
  | { type: "setMeal"; payload: Partial<AppState["meal"]> }
  | { type: "toggleBring"; payload: string }
  | { type: "setMemoryNote"; payload: { id: string; text: string } }
  | { type: "setLetter"; payload: string }
  | { type: "resetAll" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "setAnswer":
      return { ...state, answers: { ...state.answers, ...action.payload } };
    case "keepCard": {
      if (state.kept.some((k) => k.id === action.payload.id)) {
        return {
          ...state,
          seen: state.seen.includes(action.payload.id)
            ? state.seen
            : [...state.seen, action.payload.id],
        };
      }
      return {
        ...state,
        kept: [...state.kept, action.payload],
        seen: state.seen.includes(action.payload.id)
          ? state.seen
          : [...state.seen, action.payload.id],
      };
    }
    case "skipCard":
      return {
        ...state,
        seen: state.seen.includes(action.payload)
          ? state.seen
          : [...state.seen, action.payload],
      };
    case "removeKept":
      return { ...state, kept: state.kept.filter((k) => k.id !== action.payload) };
    case "setOwnNote": {
      const { id, text, category } = action.payload;
      const existing = state.kept.find((k) => k.id === id);
      if (existing) {
        return {
          ...state,
          kept: state.kept.map((k) =>
            k.id === id ? { ...k, ownNote: text } : k,
          ),
        };
      }
      const card: KeptCard = { id, text: "", category, ownNote: text };
      return {
        ...state,
        kept: [...state.kept, card],
        seen: state.seen.includes(id) ? state.seen : [...state.seen, id],
      };
    }
    case "setMeal":
      return { ...state, meal: { ...state.meal, ...action.payload } };
    case "toggleBring": {
      const has = state.meal.bring.includes(action.payload);
      return {
        ...state,
        meal: {
          ...state.meal,
          bring: has
            ? state.meal.bring.filter((b) => b !== action.payload)
            : [...state.meal.bring, action.payload],
        },
      };
    }
    case "setMemoryNote":
      return {
        ...state,
        memory: {
          notes: { ...state.memory.notes, [action.payload.id]: action.payload.text },
        },
      };
    case "setLetter":
      return { ...state, letter: action.payload };
    case "resetAll":
      return { ...initialState };
    default:
      return state;
  }
}

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  ready: boolean; // hydrate จาก localStorage เสร็จแล้ว
  savedAt: number | null; // ใช้แสดง autosave indicator
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ready, setReady] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const firstSave = useRef(true);

  // hydrate ครั้งเดียวตอน mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        dispatch({ type: "hydrate", payload: { ...initialState, ...parsed } });
      }
    } catch {
      // เสียหาย/อ่านไม่ได้ - เริ่มใหม่เงียบๆ
    }
    setReady(true);
  }, []);

  // autosave ทุกครั้งที่ state เปลี่ยน (spec C1.4)
  useEffect(() => {
    if (!ready) return;
    if (firstSave.current) {
      firstSave.current = false;
      return; // ข้ามการเซฟครั้งแรกหลัง hydrate
    }
    try {
      const toSave: AppState = { ...state, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setSavedAt(Date.now());
    } catch {
      // เต็ม/ปิดไว้ - ไม่ทำให้แอปพัง
    }
  }, [state, ready]);

  return (
    <StoreContext.Provider value={{ state, dispatch, ready, savedAt }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
