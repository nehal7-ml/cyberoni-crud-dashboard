export type createSupplierDTO = {

    baseShippingPrice: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    supplierName: string;
    supplierStatus?: string;
    shippingWeight?: number;
    listPrice?: number;
    salePrice?: number;
    availability?: string;
    supplierWrittenComments?: string;
    supplierUrl: string;
    supplierEmail?: string;
    supplierWhatsApp?: string
}