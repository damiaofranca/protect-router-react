import axios from 'axios';
import { redirect } from 'react-router-dom';

import { decodeTokenAsync, removeToken } from '../scripts';

interface IConfigAPI {
    loginUrl: string;
    redirectUrl: string;
}

interface IUserConfig {
    userData: any;
    onRemoveCurrentUser: () => void;
    onSetCurrentUser: (values: any) => void;
}

export let userComing: IUserConfig | null = null;

export default class ApiConfiguration {
    constructor(private api: typeof axios, private configApi: IConfigAPI, private userConfig: IUserConfig) {
        this.injectConfig();

        userComing = this.userConfig;
    }

    injectConfig() {
        this.api.interceptors.request.use(
            async (config) => {
                if (config.url !== this.configApi.loginUrl) {
                    const token_local = await decodeTokenAsync();

                    if (typeof token_local === 'string' && !config.headers['authorization']) {
                        config.headers['authorization'] = `Bearer ${token_local}`;
                    } else {
                        redirect(this.configApi.redirectUrl);
                    }
                }

                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                const token_local = process.env.REACT_APP_LOCAL_TOKEN;
                if (response.status === 401 && response.data.message && response.data.message === 'EXPIRED_TOKEN') {
                    if (typeof token_local === 'string') {
                        removeToken();
                        redirect(this.configApi.redirectUrl);
                    }
                }
                return response;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
    }
}
