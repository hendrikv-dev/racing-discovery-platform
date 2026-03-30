"use server";

import { RaceStatus, RaceSubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOptionalFloat(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseRequiredDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Date is required.");
  }

  return new Date(value);
}

export async function createChampionshipAction(formData: FormData) {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  await prisma.championship.create({
    data: {
      name,
      slug,
      category: String(formData.get("category") ?? "").trim(),
      region: String(formData.get("region") ?? "").trim(),
      season: String(formData.get("season") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim(),
      accentColor: String(formData.get("accentColor") ?? "").trim() || "#3b82f6"
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/championships");
  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function updateChampionshipAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  await prisma.championship.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      region: String(formData.get("region") ?? "").trim(),
      season: String(formData.get("season") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim(),
      accentColor: String(formData.get("accentColor") ?? "").trim() || "#3b82f6"
    }
  });

  revalidatePath("/admin/championships");
  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function deleteChampionshipAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  await prisma.championship.delete({
    where: { id }
  });

  revalidatePath("/admin/championships");
  revalidatePath("/championships");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function updateRaceAdminAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "UPCOMING") as RaceStatus;

  await prisma.race.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      series: String(formData.get("series") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      summary: String(formData.get("summary") ?? "").trim(),
      status,
      startDate: parseRequiredDate(formData.get("startDate")),
      endDate: parseRequiredDate(formData.get("endDate")),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      championshipId: String(formData.get("championshipId") ?? ""),
      trackId: String(formData.get("trackId") ?? "")
    }
  });

  revalidatePath("/admin/races");
  revalidatePath("/races");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function updateRacerAdminAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const championshipId = String(formData.get("championshipId") ?? "");

  await prisma.racer.update({
    where: { id },
    data: {
      championshipId: championshipId || null
    }
  });

  revalidatePath("/admin/racers");
  revalidatePath("/championships");
  revalidatePath("/search");
}

export async function updateTrackAdminAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  await prisma.track.update({
    where: { id },
    data: {
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude"))
    }
  });

  revalidatePath("/admin/tracks");
  revalidatePath("/tracks");
  revalidatePath("/");
  revalidatePath("/search");
}

export async function createRaceSubmissionAction(formData: FormData) {
  const eventName = String(formData.get("eventName") ?? "").trim();
  const series = String(formData.get("series") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const circuit = String(formData.get("circuit") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!eventName || !series || !eventDate || !circuit || !description) {
    throw new Error("All required submission fields must be completed.");
  }

  await prisma.raceSubmission.create({
    data: {
      eventName,
      series,
      eventDate: new Date(eventDate),
      circuit,
      description,
      sourceNotes: String(formData.get("sourceNotes") ?? "").trim() || null,
      contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
      championshipId: String(formData.get("championshipId") ?? "").trim() || null,
      trackId: String(formData.get("trackId") ?? "").trim() || null,
      latitude: parseOptionalFloat(formData.get("latitude")),
      longitude: parseOptionalFloat(formData.get("longitude"))
    }
  });

  revalidatePath("/submit-race");
  revalidatePath("/admin/submissions");
}

export async function updateSubmissionStatusAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "PENDING") as RaceSubmissionStatus;

  await prisma.raceSubmission.update({
    where: { id },
    data: {
      status,
      approvedAt: status === RaceSubmissionStatus.APPROVED ? new Date() : null
    }
  });

  revalidatePath("/admin/submissions");
  revalidatePath("/");
}

export async function convertSubmissionToRaceAction(formData: FormData) {
  await requireAdminSession();
  const submissionId = String(formData.get("submissionId") ?? "");
  const submission = await prisma.raceSubmission.findUnique({
    where: { id: submissionId }
  });

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const name = String(formData.get("name") ?? submission.eventName).trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  const series = String(formData.get("series") ?? submission.series).trim();
  const location = String(formData.get("location") ?? submission.circuit).trim();
  const summary = String(formData.get("summary") ?? submission.description).trim();
  const championshipId = String(formData.get("championshipId") ?? submission.championshipId ?? "").trim();
  const trackId = String(formData.get("trackId") ?? submission.trackId ?? "").trim();
  const latitude = parseOptionalFloat(formData.get("latitude")) ?? submission.latitude ?? 0;
  const longitude = parseOptionalFloat(formData.get("longitude")) ?? submission.longitude ?? 0;
  const startDate = parseRequiredDate(formData.get("startDate"));
  const endDate = parseRequiredDate(formData.get("endDate"));
  const status = String(formData.get("status") ?? "UPCOMING") as RaceStatus;

  const race = await prisma.race.create({
    data: {
      slug,
      name,
      series,
      location,
      summary,
      status,
      startDate,
      endDate,
      latitude,
      longitude,
      championshipId,
      trackId
    }
  });

  await prisma.raceSubmission.update({
    where: { id: submissionId },
    data: {
      status: RaceSubmissionStatus.CONVERTED,
      convertedAt: new Date(),
      approvedAt: submission.approvedAt ?? new Date(),
      raceId: race.id,
      championshipId: championshipId || null,
      trackId: trackId || null,
      latitude,
      longitude
    }
  });

  revalidatePath("/admin/submissions");
  revalidatePath("/races");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/championships");
}
