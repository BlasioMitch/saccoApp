import { gql } from '@apollo/client'

export const MY_NOTIFICATIONS = gql`
  query MyNotifications($limit: Int) {
    myNotifications(limit: $limit) {
      unreadCount
      items { id category title body targetType targetId readAt createdAt }
    }
  }
`;

// ids omitted: marks all as read
export const MARK_NOTIFICATIONS_READ = gql`
  mutation MarkNotificationsRead($ids: [ID!]) {
    markNotificationsRead(ids: $ids)
  }
`;
