import { post } from "@/composable/useApi.js";
import { useUserStore } from "@/stores/userSession.js";
import router from "@/router/index.js";

export async function login(form) {
            //Merr një objekt form me kredenciale (email dhe fjalëkalim).
            // Dërgon një kërkesë POST te api/login për të provuar hyrjen.
            // Nëse hyrja është e suksesshme (status 200):
            // Ruan të dhënat e përdoruesit (id, firstname, lastname, email) në dyqanin e gjendjes.
            // Ruan token-in e autentikimit.
            // Përditëson gjendjen e kyçjes.
            // Kthen të dhënat e përdoruesit.
            // Nëse dështon (gabim ose status jo 200):
            // Shtyp një mesazh gabimi dhe kthen null.
            try{
                return await post('api/login', form).then(res => { 

            if (res && res.status === 200) {
                useUserStore().setUser({
                    id: res.data.user.id,
                    firstname: res.data.user.firstname,
                    lastname: res.data.user.lastname,
                    email: res.data.user.email,
                });
                useUserStore().setToken(res.data.token);
                useUserStore().setIsLoggedIn();
                return res.data.user;
            }
            return null;
        });
    } catch (e) {
        console.error('Login error:', e);
        return null;
    }
}

export async function register(form) {
    try {
        console.log('Register payload:', form); 
        return await post('api/register', form).then(res => {
            console.log('Register response:', res); 
            if (res && res.status === 201) {
                useUserStore().setUser({
                    id: res.data.user.id,
                    firstname: res.data.user.firstname,
                    lastname: res.data.user.lastname,
                    email: res.data.user.email,
                });
                useUserStore().setToken(res.data.token);
                useUserStore().setIsLoggedIn();
                router.push('/');
                return res.data.user;
            }
            return null;
        });
    } catch (e) {
        console.error('Registration error:', e.response?.data || e); 
        throw e; 
    }
}

export async function logout() {
    try {
        const res = await post('api/logout', {}, {
            headers: { Authorization: `Bearer ${useUserStore().token}` }
        });
        if (res?.status === 200) {
            useUserStore().logoutUser();
            router.push('/login');
            return res;
        }
        return null;
    } catch (e) {
        console.error('Logout error:', e);
        return null;
    }
}