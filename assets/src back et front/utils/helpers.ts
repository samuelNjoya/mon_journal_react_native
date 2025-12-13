export const showBenaccPrice = (price: number, min_subscription: number) => {
    let amount = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
    }).format(Math.ceil(price * min_subscription));
    return `${amount}`
}

export const showValidity = (min_subscription: number, delay: string, month: string, day: string) => {
    let period = delay === "30" ? month : day
    let plural = delay == "1" && min_subscription > 1 ? 's' : ''
    return `${min_subscription} ${period}${plural}`
}

export const showBenaccPricePeriod = (price: number, min_subscription: number, delay: string, month: string, day: string) => {
    let period = delay === "30" ? month : day
    let plural = delay == "1" && min_subscription > 1 ? 's' : ''
    let amount = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
    }).format(Math.ceil(price * min_subscription));
    return `${amount}/${min_subscription} ${period}${plural}`
}

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Effectuée': return 'checkmark-circle';
        case 'pending': return 'time';
        case 'Annulée': return 'close-circle';
        default: return 'help-circle';
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Effectuée': return '#4CAF50';
        case 'pending': return '#FF9800';
        case 'Annulée': return '#F44336';
        default: return '#9E9E9E';
    }
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const normalizeDate = (date?: Date) => {
    if (!date) return new Date();
    const normalized = new Date(date);
    normalized.setHours(12, 0, 0, 0); // ✅ fixe l'heure à midi
    return normalized;
};