
function translateStatus(status: string) {
    let text = '';
    switch (status) {
        case 'pending':
            text = 'รอดำเนินการ';
            break;
        case 'cancle':
            text = 'ยกเลิก';
            break;
        case 'awaiting_approval':
            text = 'รออนุมัติ';
            break;
        case 'approved':
            text = 'อนุมัติแล้ว';
            break;
        case 'rejected':
            text = 'ปฏิเสธ';
            break;
        case 'failed':
            text = 'ล้มเหลว';
            break;
        case 'refund':
            text = 'ขอเงินคืน';
            break;
        case 'refunded':
            text = 'คืนเงิน';
            break;
        default:
            text = 'ไม่พบสถาณะ';
    }
    return text;
}


export {
    translateStatus
}