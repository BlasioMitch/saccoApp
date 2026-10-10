import { gql } from '@apollo/client'

export const AUDIT_LOGS = gql`
  query AuditLogs($filter: AuditLogFilter, $limit: Int, $offset: Int) {
    auditLogs(filter: $filter, limit: $limit, offset: $offset) {
      total
      limit
      offset
      items {
        id createdAt actorId actorEmail actorRole source action entityType entityId
        method path statusCode ip userAgent summary changes subjectId subjectName clientCreatedAt
      }
    }
  }
`;

export const AUDIT_FACETS = gql`
  query AuditFacets {
    auditFacets { actions entityTypes actors { actorId actorEmail } subjects { subjectId subjectName } }
  }
`;
