import { format,isValid, parseISO } from "date-fns"

export const formatDate = (dateString) => {
    const date = parseISO(dateString)
    if (isValid(date)){
        return format(date, "MMM yyyy")
    } else{
        return "Present"
    }
}