import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SelectPackpointProps = {
    onChange?: (id: string) => void;
    onSubmit?: (id: string | null) => void;
};

interface PackageType {
    id: string;
    points: number;
    price: number;
    price_per_points: number;
}

const mock: PackageType[] = [
    {
        id: 'jjasd-ereg',
        points: 15,
        price: 50,
        price_per_points: 3.3,
    },
    {
        id: 'jjas-dds5d-ereg',
        points: 100,
        price: 80,
        price_per_points: 2,
    },
];

const API_URL: string = import.meta.env.VITE_API_URL;
export default function SelectPackpoint({ onChange, onSubmit }: SelectPackpointProps) {
    const [items, setItems] = useState<PackageType[]>([]);
    const [selected, setSelected] = useState<string>('');

    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [isFetch, setIsFetch] = useState<boolean>(true);

    const handleSelect = (id: string) => {
        console.log(id);
        if(selected == id){
            setSelected('');
            onChange?.('');
            setIsSelected(false);
        }else{
            setSelected(id);
            onChange?.(id);
            setIsSelected(true);
        }
    };

    const handleSubmit = () => {
        onSubmit?.(selected); // ส่งค่า id ตอนกดปุ่ม
    };


    useEffect(()=>{
        const fetchData = async () => {
            setIsFetch(true);
            const res = await fetch(`${API_URL}/package-points`, { credentials: "include" });
            const result = await res.json();
            if(result.code == 200){
                const data = result.data;
                setItems(data);
            }else{
                const errors = result;
                toast.error(result.message, { description: errors.detail || result.code || '' });
            }
            setIsFetch(false);
        };

        fetchData();
    }, []);



    return (
        <div className="space-y-4">
            {isFetch ? (
                <div className="flex justify-center items-center h-10 w-full">
                    <LoaderCircle className="animate-spin" />
                </div>
            ): (
                <>
                    <div className="grid grid-cols-4 gap-2">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.id)}
                                className='col-span-1'
                            >
                                <CardPoints item={item} selected={selected == item.id ? true : false} />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selected}
                        className={`w-full py-2 rounded text-white ${!isSelected
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        Submit
                    </button>
                </>
            )}
        </div>
    );
}


function CardPoints({item, selected = false}:{item:PackageType, selected?: boolean}) {
    return (
        <>
            <Card className={selected ? 'border-yellow-600' : ''}>
                <CardHeader className="flex items-end justify-center">
                    <CardTitle className="text-yellow-600 fonct-bold text-4xl">{item.points}</CardTitle>
                    <CardDescription className="text-xs">พ้อยท์</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center">{item.price} บาท</p>
                </CardContent>
            </Card>
        </>
    );
}