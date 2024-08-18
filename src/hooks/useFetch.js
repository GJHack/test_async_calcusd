

export async function useFetch({url = "", params = {}, headers = {}, cors = true}) {

    try {

        return new Promise( async (resolve, reject) => {
          
            const req = await fetch(url, {
                mode: (cors) ? "cors" : "no-cors",
                ...params,
                ...headers
            });

            if(!await req.ok) {
                reject(`Фатальная ошибка запроса: код ответа -> ${await req.status}`);
                resolve(false);
                return;
            }
            
            console.log(`запрос удачно завершен код ответа:`, await req.status);
            const json = await req.json();
            
            resolve(json);
        })

    } catch(e) {

        console.log(`Запрос на ${url} завершен неудачно\n`, e);

    }

}