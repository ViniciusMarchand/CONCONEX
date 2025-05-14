import { createElement } from "react";

interface ListProps {
    items: any[];
    itemProp: string;
    compoenent: React.ElementType;
    aux?: any
}

export default function List({ items, itemProp, compoenent, aux }: ListProps) {
    return items.map(item => (
        createElement(compoenent, { [itemProp]: item, key: item.id, aux })
    ))
}