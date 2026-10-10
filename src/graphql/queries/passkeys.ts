import { gql } from '@apollo/client'

export const MY_PASSKEYS = gql`
  query MyPasskeys {
    myPasskeys { id deviceName createdAt lastUsedAt }
  }
`;

export const PASSKEY_REGISTRATION_OPTIONS = gql`
  mutation PasskeyRegistrationOptions {
    passkeyRegistrationOptions { options challengeToken }
  }
`;

export const ADD_PASSKEY = gql`
  mutation AddPasskey($challengeToken: String!, $response: JSON!, $deviceName: String) {
    addPasskey(challengeToken: $challengeToken, response: $response, deviceName: $deviceName) { id deviceName createdAt lastUsedAt }
  }
`;

export const PASSKEY_LOGIN_OPTIONS = gql`
  mutation PasskeyLoginOptions($email: String) {
    passkeyLoginOptions(email: $email) { options challengeToken }
  }
`;

export const REMOVE_PASSKEY = gql`
  mutation RemovePasskey($id: ID!) {
    removePasskey(id: $id)
  }
`;
