import axios from 'axios';
import { RoleDto } from '../dto/role-auth.dtos';

import { UserRole } from 'src/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakService {
  private readonly keycloakUrl = 'https://internship-id.zodinet.tech';

  async getAccessTokenRealms(): Promise<{ access_token: string }> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    formData.append('username', process.env.KEYCLOAK_USERNAME);
    formData.append('password', process.env.KEYCLOAK_PASSWORD);

    try {
      const data = await axios.post(
        `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return { access_token: data.data.access_token };
    } catch (error: any) {
      return error.message;
    }
  }
  async signUpKeyCloak(signUpInfo: any, accessToken: string): Promise<any> {
    try {
      const data = await axios.post(
        `${this.keycloakUrl}/admin/realms/Booking/users`,
        signUpInfo,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return data.data;
    } catch (error: any) {
      return error.response.data.errorMessage;
    }
  }

  async getUserIdKeyCloak(email: string, accessToken: string): Promise<any> {
    try {
      const data = await axios.get(
        `${this.keycloakUrl}/admin/realms/Booking/users?email=${email}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.data;
    } catch (error: any) {
      return error.message;
    }
  }
  async getRoleIdKeyCloak(
    accessToken: string,
    role: UserRole,
  ): Promise<RoleDto> {
    try {
      const data = await axios.get(
        `${this.keycloakUrl}/admin/realms/Booking/clients/${process.env.KEYCLOAK_CLIENT_ID_UUID}/roles/${role}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.data;
    } catch (error: any) {
      return error.response.data.errorMessage;
    }
  }

  async createRoleUserKeyCloak(
    userId: string,
    accessToken: string,
    dataBody,
  ): Promise<any> {
    console.log(userId);
    console.log(process.env.KEYCLOAK_CLIENT_ID_UUID);
    try {
      const data = await axios.post(
        `${this.keycloakUrl}/admin/realms/Booking/users/${userId}/role-mappings/clients/${process.env.KEYCLOAK_CLIENT_ID_UUID}`,
        dataBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.data;
    } catch (error: any) {
      return error.response.data.errorMessage;
    }
  }

  async updateUserKeyCloak(
    userId: string,
    dataBody,
    accessToken: string,
  ): Promise<any> {
    console.log(userId);
    console.log(process.env.CLIENT_ID_UIID_KEYCLOAK);
    try {
      const data = await axios.put(
        `${this.keycloakUrl}/admin/realms/Booking/users/${userId}`,
        dataBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data.data;
    } catch (error: any) {
      return error.response.data.errorMessage;
    }
  }
}
