import React, { useEffect } from 'react';
import { fromUnixTime, isAfter } from 'date-fns';
import { Navigate, Outlet } from 'react-router-dom';
import { decodeHash, removeToken } from '../../scripts';
import { userComing } from '../../api';

export type IProtectedPageProps = {
    redirectTo?: string;
    validadePage?: boolean;
    element?: React.FunctionComponent;
    elementProps?: Record<string, unknown>;
};

export const ProtectedPage: React.FC<IProtectedPageProps> = ({ elementProps, element: Element, validadePage = true, redirectTo = '/login' }) => {
    const profile_data = decodeHash();

    useEffect(() => {
        if (userComing && !userComing.userData && profile_data) {
            userComing.onSetCurrentUser(profile_data);
        }
    }, [profile_data]);

    if (validadePage) {
        if (userComing && !profile_data) {
            removeToken();
            userComing.onRemoveCurrentUser();
            return <Navigate to={redirectTo} />;
        }

        if (userComing && isAfter(new Date(), fromUnixTime(profile_data.exp))) {
            removeToken();
            userComing.onRemoveCurrentUser();
            return <Navigate to={redirectTo} />;
        }
    }

    if (Element) {
        return <Element {...(elementProps || {})} />;
    }

    return <Outlet />;
};
