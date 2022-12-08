import { bech32 } from 'bech32';

export const formatAddress = (address, offset = 5) => {
    if (address?.length > 20) {
        return (
            address.slice(0, offset) +
            "****" +
            address.slice(address.length - offset, address.length)
        );
    }

    return address;
};

export const addressMask = (e, setValidAddress, ethAddress) => {
    if(ethAddress) {
        e.target.maxLength = 42
    }
    let value = e.target.value
    let regex;
    if(ethAddress){
        regex = /^0x[a-fA-F0-9]{40}$/;
    }
    else {
        regex = /0x[a-fA-F0-9]/g;
    }

    if(regex.test(value)) {
        setValidAddress(true)
    }
    else{
        setValidAddress(false)
    }
    e.target.value = value
    return e
}

export const getDelegatorFromValidator = (validatorAddress, bech32Prefix    ) => {
    let address = bech32.decode(validatorAddress);

    return bech32.encode(bech32Prefix, address.words);
}