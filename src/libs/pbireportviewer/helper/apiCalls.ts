//import { IAppAuthContext } from '@msx/platform-types';
import { trackPromise } from 'react-promise-tracker';

export async function httpGet(token: string, url: string, onSuccessCallback: any, onErrorCallback: any) {
    try {
        let response = await trackPromise(fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Content-Type-Options': 'nosniff',
                'Authorization': "Bearer " + token,
            },
        }));
        var data = await response.json();
        if (onSuccessCallback != null) {
            onSuccessCallback(data);
        }
    }
    catch (error) {
        if (onErrorCallback != null) {
            console.log('error');
            onErrorCallback(error); 
        }
    }
}

