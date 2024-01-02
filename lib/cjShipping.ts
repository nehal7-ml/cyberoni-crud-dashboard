

const email = process.env.CJSHIPPING_EMAIL as string;
const password = process.env.CJSHIPPING_PASSWORD as string;
const apiUrl = 'https://developers.cjdropshipping.com/api2.0/v1';

const authHeader = {
    "CJ-Access-Token": "",
}
let refreshToken: string | null = null;

type AccessTokenResponse = {
    code: number;
    result: boolean;
    message: string;
    data: {
        accessToken: string;
        accessTokenExpiryDate: string | Date;
        refreshToken: string;
        refreshTokenExpiryDate: string | Date;
        createDate: string;
    } | null;
    requestId: string;
}

interface Product {
    pid: string;
    productName: string[];
    productNameEn: string;
    productSku: string;
    productImage: string;
    productWeight: number;
    productType: any; // Replace 'any' with the actual type if known
    productUnit: string;
    sellPrice: number;
    categoryId: string;
    categoryName: string;
    sourceFrom: number;
    remark: string;
    createTime: Date | null;
}

interface ProductListResponse {
    code: number;
    result: boolean;
    message: string;
    data: {
        pageNum: number;
        pageSize: number;
        total: number;
        list: Product[];
    };
    requestId: string;
}



export async function getAccessToken(email: string, password: string) {

    const res = await fetch(`${apiUrl}/authentication/getAccessToken`, {

        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    })

    const { data }: AccessTokenResponse = await res.json();
    authHeader["CJ-Access-Token"] = data?.accessToken as string;
    refreshToken = data?.refreshToken as string;
    return data;

}

export async function getNewToken(refreshToken: string) {

    const res = await fetch(`${apiUrl}/authentication/getAccessToken`, {

        method: 'POST',
        body: JSON.stringify({
            refreshToken,
        })
    })

    const { data }: AccessTokenResponse = await res.json();
    authHeader["CJ-Access-Token"] = data?.accessToken as string;
    return data;

}

export async function getProductList() {
    const res = await fetch(`${apiUrl}/product/list`, {

        method: 'GET',
        headers: authHeader
    })

    const productList: ProductListResponse = await res.json()

    return productList.data


}