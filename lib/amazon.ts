import "server-only"
export async function verifyAsin(asin: string) {

    try {
        const response = await fetch(`https://www.amazon.com/dp/${asin}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'

            }
        })

    console.log(response.status);
        return (response.status === 200)
    } catch (error) {
        console.log(error);
        return false
    }

}