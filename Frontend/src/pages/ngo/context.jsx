import { createContext, useContext, useMemo, useState } from "react";
import {
  initialCamps,
  initialSlots,
  initialRegistrations,
} from "./constants";

const NgoDataContext = createContext(null);

export function NgoDataProvider({ children }) {
  const [camps, setCamps] = useState(initialCamps);
  const [slots, setSlots] = useState(initialSlots);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [selectedCampId, setSelectedCampId] = useState(
    initialCamps[0]?._id ?? ""
  );

  const stats = useMemo(() => {
    const totalCamps = camps.length;
    const active = camps.filter((camp) => camp.status === "active").length;
    const upcoming = camps.filter(
      (camp) => new Date(camp.startDate) > new Date()
    ).length;
    const completed = camps.filter((camp) => camp.status === "completed").length;
    const totalSlots = slots.length;
    const totalRegistered = registrations.length;
    const expectedDonors = camps.reduce(
      (acc, camp) => acc + (Number(camp.expectedDonors) || 0),
      0
    );
    const actualDonors = registrations.length;

    return {
      totalCamps,
      active,
      upcoming,
      completed,
      totalSlots,
      totalRegistered,
      expectedDonors,
      actualDonors,
    };
  }, [camps, slots, registrations]);

  const expectedActualRatio = stats.expectedDonors
    ? Math.min(
        100,
        Math.round((stats.actualDonors / stats.expectedDonors) * 100)
      )
    : 0;

  const campLookup = useMemo(() => {
    return camps.reduce((acc, camp) => {
      acc[camp._id] = camp;
      return acc;
    }, {});
  }, [camps]);

  const setCampFocus = (campId) => {
    setSelectedCampId(campId);
  };

  const createCamp = (payload) => {
    const nextCamp = {
      _id: crypto.randomUUID(),
      ...payload,
      expectedDonors: Number(payload.expectedDonors || 0),
      registeredDonors: 0,
      status: payload.status || "pending",
      totalSlots: 0,
    };

    setCamps((prev) => [nextCamp, ...prev]);
    setCampFocus(nextCamp._id);
    return nextCamp;
  };

  const updateCamp = (campId, updates) => {
    setCamps((prev) =>
      prev.map((camp) =>
        camp._id === campId ? { ...camp, ...updates } : camp
      )
    );
  };

  const deleteCamp = (campId) => {
    setCamps((prev) => prev.filter((camp) => camp._id !== campId));
    setSlots((prev) => prev.filter((slot) => slot.campId !== campId));
    setRegistrations((prev) =>
      prev.filter((registration) => registration.campId !== campId)
    );

    setSelectedCampId((current) => {
      if (current === campId) {
        const remaining = camps.filter((camp) => camp._id !== campId);
        return remaining[0]?._id ?? "";
      }
      return current;
    });
  };

  const createSlot = (payload) => {
    if (!payload.campId) return null;

    const nextSlot = {
      _id: crypto.randomUUID(),
      campId: payload.campId,
      slotTime: payload.slotTime,
      maxDonors: Number(payload.maxDonors || 0),
      bookedCount: 0,
    };

    setSlots((prev) => [nextSlot, ...prev]);
    setCamps((prev) =>
      prev.map((camp) =>
        camp._id === payload.campId
          ? { ...camp, totalSlots: camp.totalSlots + 1 }
          : camp
      )
    );

    return nextSlot;
  };

  const registerDonor = (payload) => {
    const { campId, slotId, mobileNumber } = payload;
    const slot = slots.find((item) => item._id === slotId);
    if (!slot) {
      return { ok: false, error: "Slot not found." };
    }
    if (slot.bookedCount >= slot.maxDonors) {
      return { ok: false, error: "Selected slot is already full." };
    }

    const isDuplicate = registrations.some(
      (registration) =>
        registration.campId === campId &&
        registration.mobileNumber.trim() === mobileNumber.trim()
    );

    if (isDuplicate) {
      return { ok: false, error: "Duplicate registration detected for this camp." };
    }

    const nextRegistration = {
      _id: crypto.randomUUID(),
      ...payload,
    };

    setRegistrations((prev) => [nextRegistration, ...prev]);
    setSlots((prev) =>
      prev.map((item) =>
        item._id === slotId
          ? { ...item, bookedCount: Math.min(item.bookedCount + 1, item.maxDonors) }
          : item
      )
    );
    setCamps((prev) =>
      prev.map((camp) =>
        camp._id === campId
          ? { ...camp, registeredDonors: (camp.registeredDonors || 0) + 1 }
          : camp
      )
    );

    return { ok: true };
  };

  const value = {
    camps,
    slots,
    registrations,
    stats,
    expectedActualRatio,
    campLookup,
    selectedCampId,
    setSelectedCampId: setCampFocus,
    createCamp,
    createSlot,
    updateCamp,
    deleteCamp,
    registerDonor,
    setRegistrations,
  };

  return (
    <NgoDataContext.Provider value={value}>{children}</NgoDataContext.Provider>
  );
}

export const useNgoData = () => {
  const context = useContext(NgoDataContext);
  if (!context) {
    throw new Error("useNgoData must be used within NgoDataProvider");
  }
  return context;
};
