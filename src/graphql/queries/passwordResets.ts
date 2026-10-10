import { gql } from '@apollo/client'

const PASSWORD_RESET_FIELDS = gql`
  fragment PasswordResetFields on PasswordResetRequest {
    id
    email
    status
    source
    requestCount
    lastRequestedAt
    createdAt
    handledAt
    note
    user { id fullName email role status avatar twoFactorEnabled lastLogin }
    handledBy { id fullName }
  }
`;

export const GET_PASSWORD_RESETS = gql`
  query PasswordResets($status: PASSWORDRESETSTATUS) {
    passwordResets(status: $status) { ...PasswordResetFields }
  }
  ${PASSWORD_RESET_FIELDS}
`;

export const COMPLETE_PASSWORD_RESET = gql`
  mutation CompletePasswordReset($id: ID!, $password: String!) {
    completePasswordReset(id: $id, password: $password) {
      emailSent
      expiresAt
      request { ...PasswordResetFields }
    }
  }
  ${PASSWORD_RESET_FIELDS}
`;

export const DISMISS_PASSWORD_RESET = gql`
  mutation DismissPasswordReset($id: ID!, $note: String) {
    dismissPasswordReset(id: $id, note: $note) { ...PasswordResetFields }
  }
  ${PASSWORD_RESET_FIELDS}
`;
