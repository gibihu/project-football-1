


interface Types {
    message?: string;
}
function InputError({message}: Types){
    return (
        <span className="text-xs text-destructive">{message}</span>
    );
}


export {InputError};