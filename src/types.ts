export type PropsShop = {
    price: string
    title: string
    description: string
    base1: string
    base2: string
    base3: string
    pricePromo: string
    priceId: string
    tokenProps : string
    verifToken : boolean
    id : string
    imageId1 : string
    imageId2 : string
    imageId3 : string
    dateDelivery: string
    sizes : any
}

export type PropsBuy = {
    priceId : string
    price : string
    title: string
    base: string
    dateDelivery: string
}

export type propsAdmin = {
    tokenProps : string
    verifToken : boolean
}