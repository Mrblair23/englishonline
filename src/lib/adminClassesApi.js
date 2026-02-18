// Centralized API client usage
import { apiFetch } from "./api";

export async function getClassSlots({ teacherId } = {}) {
  const path = teacherId
    ? `/class-slots?teacherId=${teacherId}`
    : `/class-slots`;
  return await apiFetch(`/api${path}`);
}

export async function createClassSlot(slotData) {
  return await apiFetch(`/class-slots`, {
    method: "POST",
    body: slotData,
  });
}

export async function updateClassSlot(id, updates = {}) {
  return await apiFetch(`/class-slots/${id}`, {
    method: "PATCH",
    body: updates,
  });
}

export async function cancelClassSlot(id) {
  return await apiFetch(`/class-slots/${id}/cancel`, {
    method: "POST",
  });
}

export async function bookClassSlotForStudent(enrollmentData) {
  return await apiFetch(`/class-slot-enrollments`, {
    method: "POST",
    body: enrollmentData,
  });
}

export async function getEnrollmentsForSlot(slotId) {
  return await apiFetch(`/class-slot-enrollments?slotId=${slotId}`);
}
