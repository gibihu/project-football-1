function ShortName(name: string): string {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        // ถ้ามีคำเดียว → 2 ตัวแรก
        return parts[0].slice(0, 2);
    } else if (parts.length === 2) {
        // ถ้ามี 2 คำ → ตัวแรกของแต่ละคำ
        return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
        // ถ้ามี 3 คำขึ้นไป → เอา 3 คำแรก แล้วเอาตัวแรกของแต่ละคำ
        return parts.slice(0, 3).map(p => p[0].toUpperCase()).join("");
    }
}

function EventTrans(event: string): string{
    let text = '';
    switch(event){
        case 'GOAL':
            text = 'ทำประตู';
            break;
        case 'GOAL_PENALTY':
            text = 'ทำประตูจุดโทษ';
            break;
        case 'YELLOW_CARD':
            text = 'ใบเหลือง';
            break;
        case 'RED_CARD':
            text = 'ใบเแดง';
            break;
        case 'SUBSTITUTION':
            text = 'เปลี่ยนตัว';
            break;
        default:
            text = 'ไม่ทราบอีเว้น';
    }

    return text;
}

export {
    ShortName,
    EventTrans
}
