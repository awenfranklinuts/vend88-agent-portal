"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useNotifications, type PortalNotification } from "@/context/NotificationsContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { formatRelativeTime } from "@/lib/notificationFormat";

/** The dashboard is a summary - the bell panel holds the rest. */
const VISIBLE_LIMIT = 5;

const Card = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.25rem;
`;

const Title = styled.h2`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8695a7;
  margin: 0;
`;

const UnreadCount = styled.span`
  font-size: 0.8125rem;
  color: #ff6b35;
  font-weight: 600;
`;

const TextButton = styled.button`
  border: none;
  background: transparent;
  color: #8695a7;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #2b7be3;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8125rem 0.5rem;
  margin: 0 -0.5rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: background 150ms ease;

  &:hover {
    background: rgba(16, 30, 54, 0.03);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(16, 30, 54, 0.05);
  }
`;

// A dot carries both the source (hue) and the read state (opacity), which keeps
// the row to two lines of text and no chrome.
const Dot = styled.span<{ $source: string; $unread: boolean }>`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => (p.$source === "inquiry" ? "#ff6b35" : "#2b7be3")};
  opacity: ${p => (p.$unread ? 1 : 0.28)};
`;

const RowBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-width: 0;
  flex: 1;
`;

const RowTitle = styled.span<{ $unread: boolean }>`
  font-size: 0.9375rem;
  font-weight: ${p => (p.$unread ? 600 : 500)};
  color: #0a3655;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowMeta = styled.span`
  font-size: 0.8125rem;
  color: #8695a7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowTime = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: #a4b0be;

  @media (max-width: 640px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  padding: 1.25rem 0 0.5rem;
  font-size: 0.875rem;
  color: #8695a7;
`;

const MoreLine = styled.div`
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: #a4b0be;
`;

export default function NotificationsCard() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { notifications, unreadIds, unreadCount, enabled, markAllRead } = useNotifications();

  const t = (key: keyof typeof dict) => dict[key][lang];

  if (!enabled) return null;

  const visible = notifications.slice(0, VISIBLE_LIMIT);
  const hidden = notifications.length - visible.length;

  const handleRowClick = (item: PortalNotification) => router.push(item.href);

  return (
    <Card>
      <CardHeader>
        <Title>
          {t("notifications")}
          {unreadCount > 0 && <UnreadCount> · {unreadCount > 99 ? "99+" : unreadCount}</UnreadCount>}
        </Title>
        {unreadCount > 0 && <TextButton onClick={markAllRead}>{t("markAllRead")}</TextButton>}
      </CardHeader>

      {visible.length === 0 ? (
        <EmptyState>{t("allCaughtUp")}</EmptyState>
      ) : (
        <>
          <List>
            {visible.map(item => (
              <Row key={item.id} onClick={() => handleRowClick(item)}>
                <Dot $source={item.source} $unread={unreadIds.has(item.id)} />
                <RowBody>
                  <RowTitle $unread={unreadIds.has(item.id)}>{item.title}</RowTitle>
                  <RowMeta>
                    {item.source === "inquiry" ? t("newInquiry") : t("newRegistration")}
                    {item.subtitle ? ` · ${item.subtitle}` : ""}
                  </RowMeta>
                </RowBody>
                <RowTime>{formatRelativeTime(item.createdAt, lang)}</RowTime>
              </Row>
            ))}
          </List>
          {hidden > 0 && (
            <MoreLine>
              {lang === "zh" ? `还有 ${hidden} 条` : `+${hidden} more`}
            </MoreLine>
          )}
        </>
      )}
    </Card>
  );
}
