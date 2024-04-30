export async function verifyAliExpressId(id: string) {
    const res = await fetch(`https://www.aliexpress.com/item/${id}.html`, {headers: {

    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    }});

    console.log(res.status);
    if (res.status === 200) {
        return true;
    }
    return false;
}