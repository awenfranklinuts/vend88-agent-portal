"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth, hasPermission, canSeeAllTeams, isPortalUser } from "@/context/AuthContext";
import { getApiUrl, API_CONFIG } from "@/config/api";

export type NotificationSource = "inquiry" | "registration";

export interface PortalNotification {
  /** Stable across polls - `${source}:${recordId}` - so read state survives a refetch. */
  id: string;
  source: NotificationSource;
  title: string;
  subtitle?: string;
  /** ISO timestamp the record was created/submitted. */
  createdAt: string;
  href: string;
}

interface NotificationsContextType {
  notifications: PortalNotification[];
  unreadIds: Set<string>;
  unreadCount: number;
  /** Any source the user is allowed to be notified about. */
  enabled: boolean;
  refresh: () => Promise<void>;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

/** Background poll. Long enough to be cheap, short enough to feel live. */
const POLL_MS = 60_000;
/** Cap per source so a large backlog can't fill the panel. */
const PER_SOURCE_LIMIT = 20;
/**
 * On a first visit there is no read marker, so everything pending would come
 * back as unread - including records from months ago. Only the last week counts.
 */
const DEFAULT_LOOKBACK_DAYS = 7;

const lastSeenKey = (email: string | null) => `v88.notifications.lastSeen.${email || "anon"}`;

const readLastSeen = (email: string | null): number => {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(lastSeenKey(email));
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed)) return parsed;
  } catch {
    // Private mode / storage disabled - fall through to the default window.
  }
  return Date.now() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
};

const writeLastSeen = (email: string | null, value: number) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(lastSeenKey(email), String(value));
  } catch {
    // Nothing to do - the badge simply reappears next session.
  }
};

const toTime = (value?: string | null): number => {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
};

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { token, userEmail, role, adminProfile } = useAuth();
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [lastSeen, setLastSeen] = useState(0);
  // Guards against two polls (interval + focus) overlapping on a slow backend.
  const inFlight = useRef(false);

  // Inquiries are triaged by Vend88 itself, so the same gate the page uses.
  const canSeeInquiries = canSeeAllTeams(adminProfile) && hasPermission(adminProfile, "manage_inquiries");
  const canSeeRegistrations = hasPermission(adminProfile, "manage_registration_forms");
  const enabled = !!token && isPortalUser(role) && (canSeeInquiries || canSeeRegistrations);

  // The marker is per account: switching users must not inherit a read state.
  useEffect(() => {
    setLastSeen(readLastSeen(userEmail));
  }, [userEmail]);

  const fetchInquiries = useCallback(async (): Promise<PortalNotification[]> => {
    const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.INQUIRIES_LIST), {
      token,
      page: 1,
      limit: PER_SOURCE_LIMIT,
      status: "new",
    });
    if (response.data?.status_code !== 200) return [];
    const rows: any[] = response.data.inquiries || [];
    return rows.map((row) => ({
      id: `inquiry:${row._id}`,
      source: "inquiry" as const,
      title: row.full_name || row.company_name || "New inquiry",
      subtitle: row.company_name && row.full_name ? row.company_name : row.email || row.mobile,
      createdAt: row.created_at,
      href: "/admin/inquiries",
    }));
  }, [token]);

  const fetchRegistrations = useCallback(async (): Promise<PortalNotification[]> => {
    const response = await axios.get("/api/registration/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rows: any[] = response.data?.data || response.data?.registrations || [];
    if (!Array.isArray(rows)) return [];
    return rows
      // `pending` is a generated link nobody has filled in yet - not news.
      // `submitted` is a customer's answers sitting in the approval queue.
      .filter((row) => row.status === "submitted")
      .map((row) => {
        const id = row.id || row._id || row.form_id;
        return {
          id: `registration:${id}`,
          source: "registration" as const,
          title: row.business_name || row.businessName || "New registration",
          subtitle: row.contact_name || row.ownerName || row.owner_name || row.contact_email || row.contactEmail,
          createdAt: row.submitted_at || row.submittedAt || row.created_at || row.generated_at,
          href: `/admin/registrations/${id}`,
        };
      })
      .sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
      .slice(0, PER_SOURCE_LIMIT);
  }, [token]);

  const refresh = useCallback(async () => {
    if (!enabled || inFlight.current) return;
    inFlight.current = true;
    try {
      const [inquiries, registrations] = await Promise.all([
        canSeeInquiries ? fetchInquiries().catch((e) => {
          console.warn("[Notifications] inquiry poll failed:", e?.message);
          return [] as PortalNotification[];
        }) : Promise.resolve([] as PortalNotification[]),
        canSeeRegistrations ? fetchRegistrations().catch((e) => {
          console.warn("[Notifications] registration poll failed:", e?.message);
          return [] as PortalNotification[];
        }) : Promise.resolve([] as PortalNotification[]),
      ]);
      setNotifications(
        [...inquiries, ...registrations].sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
      );
    } finally {
      inFlight.current = false;
    }
  }, [enabled, canSeeInquiries, canSeeRegistrations, fetchInquiries, fetchRegistrations]);

  // Poll while signed in, and catch up whenever the tab comes back into view.
  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      return;
    }
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
    };
  }, [enabled, refresh]);

  const unreadIds = useMemo(
    () => new Set(notifications.filter((n) => toTime(n.createdAt) > lastSeen).map((n) => n.id)),
    [notifications, lastSeen]
  );

  const markAllRead = useCallback(() => {
    const now = Date.now();
    setLastSeen(now);
    writeLastSeen(userEmail, now);
  }, [userEmail]);

  const value = useMemo(
    () => ({ notifications, unreadIds, unreadCount: unreadIds.size, enabled, refresh, markAllRead }),
    [notifications, unreadIds, enabled, refresh, markAllRead]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}
