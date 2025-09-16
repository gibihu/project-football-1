


async function csrf() : Promise<any> {
    try{
        const API_URL: string = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/csrf-token`, {
            method: 'GET',
            credentials: 'include'
        });
        if(res.ok){
            const result = await res.json();
            return result.csrf_token;
        }else{
            return false;
        }
    }catch(e){
        return false;
    }
}

export {csrf}