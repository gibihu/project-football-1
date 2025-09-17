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

function EventTrans(event: string): string {
    let text = '';
    switch (event) {
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

function timeDiff(futureDate: string | Date): string {
    const now: Date = new Date();
    const future: Date = typeof futureDate === "string" ? new Date(futureDate) : futureDate;

    // คำนวณส่วนต่าง (มิลลิวินาที)
    let diffMs: number = future.getTime() - now.getTime();

    if (diffMs < 0) {
        return "เวลาที่กำหนดผ่านมาแล้ว";
    }

    const days: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * (1000 * 60 * 60 * 24);

    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);

    const minutes: number = Math.floor(diffMs / (1000 * 60));
    diffMs -= minutes * (1000 * 60);

    const seconds: number = Math.floor(diffMs / 1000);

    return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
}

function timeDiffRounded(futureDate: string | Date): string {
    const now: Date = new Date();
    const future: Date = typeof futureDate === "string" ? new Date(futureDate) : futureDate;

    let diffMs: number = future.getTime() - now.getTime();

    if (diffMs <= 0) {
        return "เวลาที่กำหนดผ่านมาแล้ว";
    }

    const days: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} ว.`;
    }

    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours} ชม.`;
    }

    const minutes: number = Math.floor(diffMs / (1000 * 60));
    if (minutes > 0) {
        return `${minutes} น.`;
    }

    const seconds: number = Math.floor(diffMs / 1000);
    return `${seconds} วิ.`;
}


export {
    ShortName,
    EventTrans,
    timeDiff,
    timeDiffRounded,
}
