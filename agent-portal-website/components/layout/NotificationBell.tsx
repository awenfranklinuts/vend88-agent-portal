"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useNotifications, type PortalNotification } from "@/context/NotificationsContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { formatRelativeTime } from "@/lib/notificationFormat";

const Wrapper = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #5c6b7a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(26, 35, 126, 0.05);
    color: #1a237e;
  }

  @media (max-width: 968px) {
    width: 36px;
    height: 36px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff6b35;
  border: 2px solid white;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  line-height: 12px;
  text-align: center;
`;

const Panel = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  max-width: calc(100vw - 2rem);
  background: white;
  border: 1px solid rgba(16, 30, 54, 0.08);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(16, 30, 54, 0.12);
  overflow: hidden;
  opacity: ${p => (p.$show ? 1 : 0)};
  visibility: ${p => (p.$show ? "visible" : "hidden")};
  transform: ${p => (p.$show ? "translateY(0)" : "translateY(-6px)")};
  transition: all 180ms ease;
  z-index: 20;
`;

const PanelHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(16, 30, 54, 0.06);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8695a7;
`;

const List = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

const Item = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: rgba(16, 30, 54, 0.03);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(16, 30, 54, 0.05);
  }
`;

// A dot carries both the source (hue) and the read state (opacity) - a coloured
// icon tile per row made the panel noisy for what is a two-source list.
const Dot = styled.span<{ $source: string; $unread: boolean }>`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: ${p => (p.$source === "inquiry" ? "#ff6b35" : "#2b7be3")};
  opacity: ${p => (p.$unread ? 1 : 0.28)};
`;

const ItemBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-width: 0;
`;

const ItemTitle = styled.span<{ $unread: boolean }>`
  font-size: 0.875rem;
  font-weight: ${p => (p.$unread ? 600 : 500)};
  color: #0a3655;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemMeta = styled.span`
  font-size: 0.75rem;
  color: #8695a7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.8125rem;
  color: #8695a7;
`;

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function NotificationBell() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { notifications, unreadIds, unreadCount, enabled, refresh, markAllRead } = useNotifications();
  const [open, setOpen] = React.useState(false);
  // Frozen at open time so rows stay marked while the panel is on screen,
  // even though opening it already cleared the badge.
  const [highlighted, setHighlighted] = React.useState<Set<string>>(new Set());

  const t = (key: keyof typeof dict) => dict[key][lang];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open) return;
      const target = event.target as HTMLElement;
      if (!target.closest("[data-notification-bell]")) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const togglePanel = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setHighlighted(new Set(unreadIds));
    setOpen(true);
    // The panel should show the current state, not whatever the last poll left.
    refresh();
    // Opening the panel is the user reading them.
    markAllRead();
  };

  const handleItemClick = (item: PortalNotification) => {
    setOpen(false);
    router.push(item.href);
  };

  if (!enabled) return null;

  return (
    <Wrapper data-notification-bell>
      <IconButton onClick={togglePanel} aria-label={t("notifications")} title={t("notifications")}>
        <BellIcon />
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? "99+" : unreadCount}</Badge>}
      </IconButton>

      <Panel $show={open}>
        <PanelHeader>{t("notifications")}</PanelHeader>

        <List>
          {notifications.length === 0 ? (
            <EmptyState>{t("allCaughtUp")}</EmptyState>
          ) : (
            notifications.map(item => (
              <Item key={item.id} onClick={() => handleItemClick(item)}>
                <Dot $source={item.source} $unread={highlighted.has(item.id)} />
                <ItemBody>
                  <ItemTitle $unread={highlighted.has(item.id)}>{item.title}</ItemTitle>
                  <ItemMeta>
                    {item.source === "inquiry" ? t("newInquiry") : t("newRegistration")}
                    {item.subtitle ? ` · ${item.subtitle}` : ""}
                    {` · ${formatRelativeTime(item.createdAt, lang)}`}
                  </ItemMeta>
                </ItemBody>
              </Item>
            ))
          )}
        </List>
      </Panel>
    </Wrapper>
  );
}
